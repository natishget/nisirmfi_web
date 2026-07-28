import asyncio
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import AsyncSessionLocal
from app.core.logging_config import setup_logging
from app.rag.ingestion_service import ingest_documents

async def run():
    setup_logging()
    async with AsyncSessionLocal() as db:
        print("Starting ingestion service...")
        result = await ingest_documents(db)
        print("Ingestion result:", result)

if __name__ == "__main__":
    asyncio.run(run())
