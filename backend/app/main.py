from contextlib import asynccontextmanager
import asyncio

from fastapi import FastAPI
from app.api.router.chat import router as chat_router
from app.api.router.telegram import router as telegram_router
from app.api.router import telegram

from fastapi.middleware.cors import CORSMiddleware

from contextlib import asynccontextmanager

from app.rag.embeddings import generate_embedding


@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Existing Startup Logic ---
    embedding = await generate_embedding("test")
    print("Embedding Dimension:", len(embedding))

    print("Starting background services...")
    bot_task = asyncio.create_task(telegram.run_telegram_bot())

    yield  # FastAPI starts accepting HTTP requests here

    # --- Shutdown Logic ---
    print("Shutting down background tasks...")
    bot_task.cancel()
    try:
        await bot_task
    except asyncio.CancelledError:
        pass


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    chat_router,
    prefix="/chat",
    tags=["Chat"]
)

app.include_router(telegram_router)

@app.get("/")
async def root():
    return {"message": "AI backend running"}
