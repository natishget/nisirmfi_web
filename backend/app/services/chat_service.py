import logging
import time
import uuid

from app.services.context_service import build_company_context
from app.services.intent_service import detect_intent
from app.services.message_service import save_message
from app.services.router_service import route_message_local
from app.rag.rag_service import retrieve_context
from app.models.message import MessageRole
from app.models.conversation import Conversation
from app.llm.gemini import generate_response
from app.services.conversation_service import get_recent_messages
from app.llm.prompt_builder import build_conversation_history, build_prompt
from app.core.config import settings

logger = logging.getLogger(__name__)

FALLBACK_ERROR_RESPONSE = (
    "I'm sorry, I encountered an issue while processing your request. "
    "Please try again shortly."
)


async def create_conversation(db, conversation_id: str | None = None):
    logger.info(
        f"Creating conversation — "
        f"ID: {conversation_id or '(auto-generated)'}"
    )
    
    new_uuid = uuid.UUID(conversation_id) if conversation_id else uuid.uuid4()
    
    new_conversation = Conversation(
        id=new_uuid,
    )
    
    db.add(new_conversation)
    await db.commit()
    await db.refresh(new_conversation)
    logger.info(f"Conversation created: {new_conversation.id}")
    return new_conversation


async def process_user_message(
    db,
    message_text: str,
    conversation_id: str | None = None
):
    start_time = time.time()
    try:
        # 1. Session Resolution
        if not conversation_id:
            logger.info("No conversation_id provided, creating new conversation")
            conversation = await create_conversation(db)
            conversation_id = str(conversation.id)
        else:
            # Check if this deterministic UUID already exists in the DB
            conversation_uuid = uuid.UUID(conversation_id)
            conversation = await db.get(Conversation, conversation_uuid)

            # If it does NOT exist, create it
            if not conversation:
                logger.info(
                    f"Conversation not found for ID: {conversation_id}. "
                    f"Creating new one."
                )
                conversation = await create_conversation(
                    db,
                    conversation_id
                )
                conversation_id = str(conversation.id)

        # 2. Save User Message to Database
        await save_message(
            db=db,
            conversation_id=conversation_id,
            role=MessageRole.USER,
            content=message_text
        )

        # 3. Local Message Routing (Greeting & Out of Scope Check)
        local_response = route_message_local(message_text)
        if local_response is not None:
            # Save local response to Database
            await save_message(
                db=db,
                conversation_id=conversation_id,
                role=MessageRole.ASSISTANT,
                content=local_response
            )
            duration_ms = int((time.time() - start_time) * 1000)
            logger.info(
                f"classification=LOCAL_ROUTED gemini_called=false "
                f"history_messages=0 duration_ms={duration_ms}"
            )
            return {
                "conversation_id": conversation_id,
                "response": local_response
            }

        # 4. Standard RAG & LLM Pipeline for legitimate queries
        messages = await get_recent_messages(db, uuid.UUID(conversation_id), limit=settings.HISTORY_MAX_MESSAGES)
        history = build_conversation_history(messages)
        
        # Local intent detection
        intent = detect_intent(message_text)
        
        # Build targeted context
        company_context = await build_company_context(db, intent)
        context = await retrieve_context(db, message_text)
        
        # Format Gemini Prompt
        prompt = build_prompt(company_context, context)
        
        # LLM Synthesis
        ai_response = await generate_response(history, prompt)

        # Save Assistant response to Database
        await save_message(
            db=db,
            conversation_id=conversation_id,
            role=MessageRole.ASSISTANT,
            content=ai_response
        )

        duration_ms = int((time.time() - start_time) * 1000)
        logger.info(
            f"classification=COMPANY intent={intent.value} "
            f"rag_chunks={len(context)} context_chars={len(context)} "
            f"history_messages={len(messages) - 1} gemini_called=true "
            f"duration_ms={duration_ms}"
        )

        return {
            "conversation_id": conversation_id,
            "response": ai_response
        }

    except Exception as e:
        logger.error(
            f"Error processing message for conversation "
            f"{conversation_id}: {e}",
            exc_info=True
        )
        return {
            "conversation_id": conversation_id or "",
            "response": FALLBACK_ERROR_RESPONSE
        }