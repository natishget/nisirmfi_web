import hashlib
import logging

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from app.models.document import Document, DocumentStatus
from app.models.document_chunk import DocumentChunk

from app.rag.document_loader import load_markdown_documents
from app.rag.chunker import chunk_text
from app.rag.embeddings import generate_embedding

logger = logging.getLogger(__name__)


def _compute_content_hash(content: str) -> str:
    """Compute a SHA-256 hash of the document content for deduplication."""
    return hashlib.sha256(content.encode("utf-8")).hexdigest()


async def _get_existing_documents(db: AsyncSession) -> dict[str, Document]:
    """Load all existing documents, keyed by fileName (URL or filename)."""
    result = await db.execute(select(Document))
    docs = result.scalars().all()
    return {doc.fileName: doc for doc in docs}


async def _delete_document_and_chunks(db: AsyncSession, document: Document):
    """Delete a document and its associated chunks."""
    await db.execute(
        delete(DocumentChunk).where(DocumentChunk.documentId == document.id)
    )
    await db.delete(document)
    logger.info(f"Deleted stale document: {document.fileName}")


async def _ingest_single_document(
    db: AsyncSession,
    doc_info: dict,
    content_hash: str
) -> int:
    """
    Ingest a single document: create the Document record, chunk the content,
    generate embeddings, and store the chunks.

    Returns the number of chunks created.
    """
    document = Document(
        title=doc_info["title"],
        fileName=doc_info["fileName"],
        source=doc_info["source"],
        contentType=doc_info["contentType"],
        contentHash=content_hash,
        status=DocumentStatus.READY
    )

    db.add(document)
    await db.flush()  # Get document.id before commit

    chunks = chunk_text(doc_info["content"])
    logger.info(f"Processing {doc_info['title']} ({len(chunks)} chunks)")

    chunk_count = 0
    for index, chunk in enumerate(chunks):
        try:
            embedding = await generate_embedding(chunk)

            chunk_record = DocumentChunk(
                documentId=document.id,
                chunkIndex=index,
                chunkText=chunk,
                embedding=embedding,
                chunkMetadata={
                    "source": doc_info["fileName"],
                    "chunk_number": index,
                    "title": doc_info["title"]
                }
            )

            db.add(chunk_record)
            chunk_count += 1
        except Exception as e:
            logger.error(
                f"Embedding failed for {doc_info['fileName']} "
                f"chunk {index}: {e}"
            )

    return chunk_count


async def ingest_documents(db: AsyncSession):
    """
    Rebuilds the knowledge base with smart deduplication.

    For each document (markdown file or crawled web page):
    - If it's new → ingest it (chunk + embed + store)
    - If it exists and content is unchanged (same hash) → skip it
    - If it exists but content changed → delete old chunks, re-ingest
    - If a previously stored document is no longer present → delete it

    This avoids redundant embedding API calls for unchanged content.
    """
    from app.services.crawler_service import crawl_website

    # Gather all sources
    # 1. Load markdown documents
    markdown_docs = load_markdown_documents()

    # 2. Crawl website pages
    web_pages = []
    try:
        logger.info("Starting website crawl...")
        web_pages = crawl_website(
            start_url="https://nisirmfi.com",
            max_pages=30,
            max_depth=2
        )
        logger.info(f"Crawled {len(web_pages)} pages from website.")
    except Exception as e:
        logger.error(f"Website crawl failed: {e}")

    # Build the incoming document list
    all_docs_to_ingest = []

    for doc in markdown_docs:
        all_docs_to_ingest.append({
            "title": doc["filename"],
            "fileName": doc["filename"],
            "source": "markdown",
            "contentType": "text/markdown",
            "content": doc["content"]
        })

    for page in web_pages:
        all_docs_to_ingest.append({
            "title": page["title"],
            "fileName": page["url"],
            "source": "website",
            "contentType": "text/html",
            "content": page["content"]
        })

    # Load existing documents from DB for comparison
    existing_docs = await _get_existing_documents(db)

    # Track which fileNames are in the current ingestion set
    current_file_names = set()

    stats = {
        "skipped": 0,
        "updated": 0,
        "new": 0,
        "deleted": 0,
        "total_chunks": 0
    }

    for doc_info in all_docs_to_ingest:
        file_name = doc_info["fileName"]
        current_file_names.add(file_name)
        content_hash = _compute_content_hash(doc_info["content"])

        existing_doc = existing_docs.get(file_name)

        if existing_doc:
            # Document already exists — check if content changed
            if existing_doc.contentHash == content_hash:
                # Content unchanged, skip re-ingestion
                logger.info(f"Skipping unchanged document: {file_name}")
                stats["skipped"] += 1
                continue
            else:
                # Content changed — delete old version first
                logger.info(f"Content changed, re-ingesting: {file_name}")
                await _delete_document_and_chunks(db, existing_doc)
                stats["updated"] += 1
        else:
            logger.info(f"New document found: {file_name}")
            stats["new"] += 1

        # Ingest the document (new or updated)
        chunk_count = await _ingest_single_document(
            db, doc_info, content_hash
        )
        stats["total_chunks"] += chunk_count

    # Delete stale documents (in DB but no longer in current sources)
    for file_name, doc in existing_docs.items():
        if file_name not in current_file_names:
            await _delete_document_and_chunks(db, doc)
            stats["deleted"] += 1

    await db.commit()

    logger.info(
        f"Ingestion complete — "
        f"New: {stats['new']}, "
        f"Updated: {stats['updated']}, "
        f"Skipped: {stats['skipped']}, "
        f"Deleted: {stats['deleted']}, "
        f"Total chunks: {stats['total_chunks']}"
    )

    return {
        "success": True,
        "new_documents": stats["new"],
        "updated_documents": stats["updated"],
        "skipped_documents": stats["skipped"],
        "deleted_documents": stats["deleted"],
        "total_chunks": stats["total_chunks"]
    }