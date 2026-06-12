from sqlalchemy.ext.asyncio import AsyncSession

from app.models.message import (
    Message,
    MessageRole
)

from app.models.conversation import Conversation
from datetime import datetime

from app.models.visitor import Visitor

async def save_message(
    db: AsyncSession,
    conversation_id,
    role: MessageRole,
    content: str
):
    # 1. Create the new message
    message = Message(
        conversationId=conversation_id,
        role=role,
        content=content
    )
    db.add(message)

    # 2. Fetch and update the conversation
    conversation = await db.get(Conversation, conversation_id)
    if conversation:
        # Match the existing naive timestamp columns in PostgreSQL.
        conversation.lastMessageAt = datetime.utcnow()

    # 3. Commit everything to the database at once
    await db.commit()
    
    # 4. Safely get the new data without triggering a lazy-load crash
    # If your model autofills IDs or timestamps on creation, 
    # reading the attribute directly is safer in async than db.refresh().
    return message