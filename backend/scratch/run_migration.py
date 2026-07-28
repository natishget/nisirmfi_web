import asyncio
import os
import sys
from sqlalchemy import text

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import engine

async def run_migration():
    print("Running migration to add contentHash column...")
    async with engine.begin() as conn:
        await conn.execute(text('ALTER TABLE documents ADD COLUMN IF NOT EXISTS "contentHash" VARCHAR;'))
    print("Migration completed successfully!")

if __name__ == "__main__":
    asyncio.run(run_migration())
