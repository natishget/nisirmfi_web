import logging

from app.services.context_service import build_company_context
from app.services.intent_service import detect_intent
from app.services.message_service import save_message
from app.services.conversation_service import (
    create_conversation
)

from app.rag.rag_service import retrieve_context

from app.models.message import MessageRole
from app.models.conversation import Conversation

from app.llm.gemini import generate_response

from app.services.conversation_service import (
    get_recent_messages
)

from app.llm.prompt_builder import (
    build_conversation_history,
    build_prompt
)

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
    # If a deterministic UUID was passed in, use it. Otherwise, let DB default handle it.
    new_conversation = Conversation(
        id=conversation_id if conversation_id else None,
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
    try:
        if not conversation_id:
            logger.info("No conversation_id provided, creating new conversation")
            conversation = await create_conversation(db)
            conversation_id = conversation.id
        else:
            # 1. Check if this deterministic UUID already exists in the DB
            conversation = await db.get(Conversation, conversation_id)

            # 2. If it does NOT exist, create it using our Telegram UUID
            if not conversation:
                logger.info(
                    f"Conversation not found for ID: {conversation_id}. "
                    f"Creating new one."
                )
                conversation = await create_conversation(
                    db,
                    conversation_id
                )
                conversation_id = conversation.id

        await save_message(
            db=db,
            conversation_id=conversation_id,
            role=MessageRole.USER,
            content=message_text
        )

        messages = await get_recent_messages(db, conversation_id)
        history = build_conversation_history(messages)
        
        intent = detect_intent(message_text)
        logger.debug(f"Detected intent: {intent}")
        
        company_context = await build_company_context(db, intent)
        
        context = await retrieve_context(db, message_text)
        
        prompt = build_prompt(company_context, context, message_text)
        
        logger.debug(f"RAG context length: {len(context)} chars")

        ai_response = await generate_response(history, prompt)

        await save_message(
            db=db,
            conversation_id=conversation_id,
            role=MessageRole.ASSISTANT,
            content=ai_response
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
        # Still try to return a conversation_id if we have one
        return {
            "conversation_id": conversation_id or "",
            "response": FALLBACK_ERROR_RESPONSE
        }