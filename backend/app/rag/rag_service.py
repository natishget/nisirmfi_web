from app.rag.embeddings import generate_embedding
from app.rag.retriever import retrieve_chunks


async def retrieve_context(
    db,
    question: str
):
    query_embedding = await generate_embedding(
        question
    )

    chunks = await retrieve_chunks(
        db,
        query_embedding
    )

    context = "\n\n".join(
        chunk.chunkText
        for chunk in chunks
    )

    return context