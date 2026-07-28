from contextlib import asynccontextmanager
import asyncio
import logging

from fastapi import FastAPI
from app.api.router.chat import router as chat_router
from app.api.router.telegram import router as telegram_router
from app.api.router import telegram

from fastapi.middleware.cors import CORSMiddleware

from app.core.logging_config import setup_logging
from app.rag.embeddings import generate_embedding

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize structured logging before anything else
    setup_logging()

    # --- Existing Startup Logic ---
    embedding = await generate_embedding("test")
    logger.info(f"Embedding Dimension: {len(embedding)}")

    logger.info("Starting background services...")
    bot_task = asyncio.create_task(telegram.run_telegram_bot())

    yield  # FastAPI starts accepting HTTP requests here

    # --- Shutdown Logic ---
    logger.info("Shutting down background tasks...")
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

