import logging

from app.rag.embeddings import generate_embedding
from app.rag.ingestion_service import ingest_documents
from app.rag.rag_service import retrieve_context
from fastapi import APIRouter, Depends, Request, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.rate_limit import web_rate_limiter
from app.core.config import settings
from app.services.router_service import is_amharic_local

from app.schemas.chat import (
    ChatRequest,
    ChatResponse,
    ConversationResponse,
    MessageResponse
)

from app.services.conversation_service import (
    get_conversation_messages
)

from app.core.database import get_db

from app.services.chat_service import process_user_message

from app.services.message_service import save_message
from app.models.message import MessageRole

logger = logging.getLogger(__name__)

router = APIRouter()


def get_client_ip(request: Request) -> str:
    client_ip = request.client.host if request.client else "unknown"
    if settings.TRUSTED_PROXIES:
        # Check if trusted proxies is configured
        proxies = [ip.strip() for ip in settings.TRUSTED_PROXIES.split(",") if ip.strip()]
        if proxies:
            if "x-forwarded-for" in request.headers:
                client_ip = request.headers["x-forwarded-for"].split(",")[0].strip()
            elif "x-real-ip" in request.headers:
                client_ip = request.headers["x-real-ip"].strip()
    return client_ip


@router.post("", response_model=ChatResponse)
async def chat(
    http_request: Request,
    request: ChatRequest,
    db: AsyncSession = Depends(get_db)
):
    # Extract client IP for rate limiting
    client_ip = get_client_ip(http_request)

    # Enforce rate limit immediately before any expensive operations
    if not web_rate_limiter.is_allowed(client_ip):
        is_amh = is_amharic_local(request.message)
        if is_amh:
            response_msg = "የ10 መልእክት ገደብዎ ላይ ደርሰዋል። የቻትቦት መዳረሻዎ ከ24 ሰዓታት በኋላ እንደገና ይጀምራል።"
        else:
            response_msg = "You have reached your 10-message limit. Your chatbot access will reset after 24 hours."
        return ChatResponse(
            response=response_msg,
            conversation_id=request.conversation_id or ""
        )

    logger.info(f"Chat request — conversation: {request.conversation_id}")

    result = await process_user_message(
        db=db,
        message_text=request.message,
        conversation_id=request.conversation_id
    )

    return ChatResponse(
        response=result["response"],
        conversation_id=str(
            result["conversation_id"]
        )
    )

@router.get("/search-test")
async def test_search(
    q: str,
    db: AsyncSession = Depends(get_db)
):
    context = await retrieve_context(
        db,
        q
    )

    return {
        "context": context
    }

@router.post("/reindex")
async def reindex(
    db: AsyncSession = Depends(get_db)
):
    return await ingest_documents(db)
