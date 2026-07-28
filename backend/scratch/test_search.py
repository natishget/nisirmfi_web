import asyncio
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import AsyncSessionLocal
from app.rag.embeddings import generate_embedding
from app.rag.retriever import retrieve_chunks

async def test_search():
    query = "loan products"
    print(f"Generating embedding for query: '{query}'...")
    emb = await generate_embedding(query)
    
    async with AsyncSessionLocal() as db:
        print("Retrieving chunks...")
        chunks = await retrieve_chunks(db, emb, limit=10, max_distance=1.0)
        print(f"Total chunks found: {len(chunks)}")
        
        for idx, chunk in enumerate(chunks):
            doc = chunk.document
            title = doc.title if doc else "None"
            url = doc.fileName if doc else "None"
            source = doc.source if doc else "None"
            dist = getattr(chunk, 'distance', None)
            
            # Use ascii-friendly output to prevent cp1252 error
            safe_title = title.encode('ascii', errors='replace').decode('ascii')
            safe_text = chunk.chunkText[:150].replace('\n', ' ').encode('ascii', errors='replace').decode('ascii')
            
            print(f"{idx+1}. Dist={dist:.4f} | Source={source} | Title={safe_title} | URL={url}")
            print(f"   Text: {safe_text}...")

if __name__ == "__main__":
    asyncio.run(test_search())
