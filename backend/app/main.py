from contextlib import asynccontextmanager

from fastapi import FastAPI
from app.api.router.chat import router as chat_router
from fastapi.middleware.cors import CORSMiddleware

from contextlib import asynccontextmanager

from app.rag.embeddings import generate_embedding


@asynccontextmanager
async def lifespan(app):

    embedding = await generate_embedding(
        "test"
    )

    print(
        "Embedding Dimension:",
        len(embedding)
    )

    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://192.168.137.193:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    chat_router,
    prefix="/chat",
    tags=["Chat"]
)

@app.get("/")
async def root():
    return {"message": "AI backend running"}
