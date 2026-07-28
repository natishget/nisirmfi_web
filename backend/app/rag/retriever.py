from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.document_chunk import DocumentChunk


async def retrieve_chunks(
    db,
    query_embedding,
    limit: int = 10,
    max_distance: float = 0.65
):
    # Select both the chunk and the distance for filtering
    distance = DocumentChunk.embedding.cosine_distance(query_embedding).label("distance")
    stmt = (
        select(DocumentChunk, distance)
        .options(selectinload(DocumentChunk.document))
        .order_by(distance)
        .limit(limit)
    )

    result = await db.execute(stmt)
    rows = result.all()

    # Filter out chunks with low similarity (high cosine distance)
    filtered_chunks = []
    for chunk, dist in rows:
        if dist <= max_distance:
            chunk.distance = dist  # Store distance on chunk
            filtered_chunks.append(chunk)

    return filtered_chunks