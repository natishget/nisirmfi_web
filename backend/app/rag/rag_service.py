import logging
import re

from app.rag.embeddings import generate_embedding
from app.rag.retriever import retrieve_chunks
from app.llm.gemini import client as gemini_client

logger = logging.getLogger(__name__)

# Ethiopic Unicode block range (Amharic, Tigrinya, Ge'ez, etc.)
_ETHIOPIC_PATTERN = re.compile(r'[\u1200-\u137F\u1380-\u139F\u2D80-\u2DDF]')


def _is_amharic(text: str) -> bool:
    """
    Check if the text contains a significant proportion of Ethiopic characters.
    Returns True if at least 20% of non-whitespace characters are Ethiopic.
    """
    non_space = text.replace(" ", "")
    if not non_space:
        return False
    ethiopic_count = len(_ETHIOPIC_PATTERN.findall(non_space))
    return (ethiopic_count / len(non_space)) > 0.2


async def _translate_to_english(amharic_text: str) -> str | None:
    """
    Use Gemini to translate an Amharic query to English for better retrieval.
    Returns the English translation, or None if translation fails.
    """
    try:
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=(
                f"Translate the following Amharic text to English. "
                f"Return ONLY the English translation, nothing else.\n\n"
                f"{amharic_text}"
            )
        )
        translation = response.text.strip() if response.text else None
        if translation:
            logger.info(f"Amharic query translated: '{amharic_text}' → '{translation}'")
        return translation
    except Exception as e:
        logger.warning(f"Amharic translation failed: {e}")
        return None


def _merge_chunks(primary: list, secondary: list) -> list:
    """
    Merge two lists of chunks, deduplicating by chunk ID.
    Primary results take priority (appear first).
    """
    seen_ids = set()
    merged = []

    for chunk in primary:
        chunk_id = chunk.id
        if chunk_id not in seen_ids:
            seen_ids.add(chunk_id)
            merged.append(chunk)

    for chunk in secondary:
        chunk_id = chunk.id
        if chunk_id not in seen_ids:
            seen_ids.add(chunk_id)
            merged.append(chunk)

    return merged


def _format_chunks(chunks: list) -> str:
    """Format retrieved chunks into a structured context string."""
    if not chunks:
        return "No relevant company information found."

    # Group chunks by document
    grouped = {}
    for chunk in chunks:
        doc = chunk.document
        if not doc:
            continue
        doc_id = doc.id
        if doc_id not in grouped:
            grouped[doc_id] = {
                "title": doc.title,
                "url": doc.fileName,
                "source": doc.source,
                "chunks": []
            }
        grouped[doc_id]["chunks"].append(chunk)

    # Format the grouped context to include URL references clearly
    formatted_docs = []
    for doc_id, doc_info in grouped.items():
        # Sort chunks by chunkIndex to preserve logical document flow
        doc_info["chunks"].sort(key=lambda c: c.chunkIndex)
        
        chunks_joined = "\n[...]\n".join(c.chunkText for c in doc_info["chunks"])
        
        if doc_info["source"] == "website":
            source_citation = f"Website URL: {doc_info['url']}"
        else:
            source_citation = f"Internal Document: {doc_info['title']}"

        formatted_docs.append(
            f"Source Title: {doc_info['title']}\n"
            f"Source Location: {source_citation}\n"
            f"Content:\n{chunks_joined}"
        )

    return "\n\n---\n\n".join(formatted_docs)


async def retrieve_context(
    db,
    question: str
):
    """
    Retrieve relevant context from the knowledge base.

    For Amharic queries, performs bilingual retrieval:
    1. Search with the original Amharic query embedding
    2. Translate query to English and search again
    3. Merge and deduplicate results

    This ensures English-language website content is still retrievable
    when users ask questions in Amharic.
    """
    try:
        query_embedding = await generate_embedding(question)
    except Exception as e:
        logger.error(f"Embedding generation failed for query: {e}", exc_info=True)
        return "No relevant company information found."

    # Primary retrieval with original query
    chunks = await retrieve_chunks(
        db,
        query_embedding,
        limit=10,
        max_distance=0.65
    )

    # Bilingual retrieval for Amharic queries
    if _is_amharic(question):
        logger.info("Amharic query detected — performing bilingual retrieval")
        translation = await _translate_to_english(question)

        if translation:
            try:
                translated_embedding = await generate_embedding(translation)
                english_chunks = await retrieve_chunks(
                    db,
                    translated_embedding,
                    limit=10,
                    max_distance=0.65
                )
                chunks = _merge_chunks(chunks, english_chunks)
                logger.info(
                    f"Bilingual retrieval: {len(chunks)} total chunks "
                    f"after merging"
                )
            except Exception as e:
                logger.warning(
                    f"English translation retrieval failed: {e}. "
                    f"Using Amharic-only results."
                )

    return _format_chunks(chunks)