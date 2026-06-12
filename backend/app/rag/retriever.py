from sqlalchemy import select

from app.models.document_chunk import DocumentChunk


async def retrieve_chunks(
    db,
    query_embedding,
    limit: int = 5
):
    stmt = (
        select(DocumentChunk)
        .order_by(
            DocumentChunk.embedding.cosine_distance(
                query_embedding
            )
        )
        .limit(limit)
    )

    result = await db.execute(stmt)

    return result.scalars().all()