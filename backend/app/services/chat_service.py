from multiprocessing import context

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


async def process_user_message(
    db,
    message_text: str,
    conversation_id: str | None = None
):
    if not conversation_id:
        conversation = await create_conversation(db)

        conversation_id = conversation.id

    else:
        conversation = await db.get(
            Conversation,
            conversation_id
        )

        if not conversation:
            conversation = await create_conversation(db)

            conversation_id = conversation.id

    

    await save_message(
        db=db,
        conversation_id=conversation_id,
        role=MessageRole.USER,
        content=message_text
    )

    messages = await get_recent_messages(
    db,
    conversation_id
)
    history = build_conversation_history(
    messages
)
    
    intent = detect_intent(
    message_text
)
    
    company_context = await build_company_context(
    db,
    intent
)
    
    context = await retrieve_context(
    db,
    message_text
)
    
    prompt = build_prompt(
    company_context,
    context,
    message_text
)
    
    print("\n=== RAG CONTEXT ===")
    print(context)
    print("====================================================\n")
    print("\n=== PROMPT ===")
    print(prompt)
    print("====================================================\n")

    
   

    ai_response = await generate_response(
        history,
        prompt
    )

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