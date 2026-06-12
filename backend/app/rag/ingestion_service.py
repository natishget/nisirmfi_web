from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete

from app.models.document import Document
from app.models.document_chunk import DocumentChunk

from app.rag.document_loader import (
    load_markdown_documents
)

from app.rag.chunker import (
    chunk_text
)

from app.rag.embeddings import (
    generate_embedding
)

from app.models.document import DocumentStatus


async def ingest_documents(
    db: AsyncSession
):
    """
    Rebuilds the knowledge base from markdown files.

    Steps:
    1. Delete existing chunks/documents
    2. Load markdown files
    3. Chunk text
    4. Generate embeddings
    5. Save to database
    """

    # Delete old chunks first
    await db.execute(
        delete(DocumentChunk)
    )

    # Delete documents
    await db.execute(
        delete(Document)
    )

    await db.commit()

    documents = load_markdown_documents()

    total_documents = 0
    total_chunks = 0

    for doc in documents:

        document = Document(
            title=doc["filename"],
            fileName=doc["filename"],
            source="markdown",
            contentType="text/markdown",
            status=DocumentStatus.READY
        )

        db.add(document)

        # Required to get document.id before commit
        await db.flush()

        chunks = chunk_text(
            doc["content"]
        )

        print( f"Processing {doc['filename']} " f"({len(chunks)} chunks)" )         

        for index, chunk in enumerate(chunks):
            print( f"Stored chunk {index}" )
            try:

                embedding = await generate_embedding(
                    chunk
                )

                chunk_record = DocumentChunk(
                    documentId=document.id,
                    chunkIndex=index,  # <--- ADD THIS LINE HERE
                    chunkText=chunk,
                    embedding=embedding,
                    metadata={
                        "source": doc["filename"],
                        "chunk_number": index
                    }
                )

                db.add(chunk_record)

            except Exception as e:

                print(
                    f"Embedding failed for "
                    f"{doc['filename']} "
                    f"chunk {index}: {str(e)}"
                )
                total_chunks += 1

    await db.commit()

    return {
        "success": True,
        "documents": total_documents,
        "chunks": total_chunks
    }