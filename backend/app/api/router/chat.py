import logging

from app.rag.embeddings import generate_embedding
from app.rag.ingestion_service import ingest_documents
from app.rag.rag_service import retrieve_context
from fastapi import APIRouter, Depends, Request, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.rate_limit import web_rate_limiter

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

# testing route to check if the chat route is working fine or not.
from app.services.message_service import save_message
from app.models.message import MessageRole

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("", response_model=ChatResponse)
async def chat(
    http_request: Request,
    request: ChatRequest,
    db: AsyncSession = Depends(get_db)
):
    # Extract client IP for rate limiting
    client_ip = http_request.client.host if http_request.client else "unknown"
    if "x-forwarded-for" in http_request.headers:
        client_ip = http_request.headers["x-forwarded-for"].split(",")[0].strip()

    if not web_rate_limiter.is_allowed(client_ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests. Please try again later."
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

# @router.get("/{conversation_id}", response_model=ConversationResponse)
# async def chat(
#     conversation_id: str,
#     db: AsyncSession = Depends(get_db)
# ):
#     print("conversation_id", conversation_id)

#     messages =  await get_conversation_messages(
#         db,
#         conversation_id
#     )


#     return ConversationResponse(
#         conversation_id=conversation_id,
#         messages=[
#             MessageResponse(
#                 id=str(message.id),
#                 role=message.role.value,
#                 content=message.content
#             )
#             for message in messages
#         ]
#     )




# # testing route to check if the chat route is working fine or not api endpoint
# @router.post("/{conversation_id}/assistant-test")
# async def assistant_test(
#     conversation_id: str,
#     request: ChatRequest,
#     db: AsyncSession = Depends(get_db)
# ):
#     message = await save_message(
#         db=db,
#         conversation_id=conversation_id,
#         role=MessageRole.ASSISTANT,
#         content= request.message
#     )

#     return {
#         "message_id": str(message.id)
#     }

@router.post("/reindex")
async def reindex(
    db: AsyncSession = Depends(get_db)
):
    return await ingest_documents(db)


