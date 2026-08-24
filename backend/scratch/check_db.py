import asyncio
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import select
from app.core.database import AsyncSessionLocal
from app.models.document import Document
from app.models.document_chunk import DocumentChunk


async def check_db():
    async with AsyncSessionLocal() as db:
        # Get count of documents by source
        result = await db.execute(select(Document))
        documents = result.scalars().all()
        print(f"Total documents in database: {len(documents)}")
        
        sources = {}
        for doc in documents:
            sources[doc.source] = sources.get(doc.source, 0) + 1
            print(f"- Doc: ID={doc.id}, Title={doc.title}, Source={doc.source}, URL/File={doc.fileName}, Hash={doc.contentHash}, Status={doc.status}")
            
            # Count chunks for this doc
            chunks_result = await db.execute(
                select(DocumentChunk).where(DocumentChunk.documentId == doc.id)
            )
            chunks = chunks_result.scalars().all()
            print(f"  -> Has {len(chunks)} chunks")
            if chunks:
                print(f"  -> First chunk preview: {chunks[0].chunkText[:100]}...")

        print("\nSummary by source:")
        for source, count in sources.items():
            print(f"- {source}: {count} documents")

if __name__ == "__main__":
    asyncio.run(check_db())
