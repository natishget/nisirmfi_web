from sqlalchemy.ext.asyncio import AsyncSession
from app.models.conversation import Conversation
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload 
import uuid

from app.models.message import Message


async def create_conversation(
    db: AsyncSession,
    title: str | None = None
):
    conversation = Conversation(
        title=title
    )

    db.add(conversation)

    await db.commit()
    await db.refresh(conversation)

    return conversation

async def get_conversation_messages(
    db: AsyncSession,
    conversation_id: uuid.UUID
):
    stmt = (select (Conversation).where(
        Conversation.id == conversation_id
    ) .options(selectinload(Conversation.messages))
    )
    conversation = await db.execute(stmt)

    conversation = conversation.scalar_one_or_none()

    if not conversation:
        return []

    messages = conversation.messages

    return messages



async def get_recent_messages(
    db: AsyncSession,
    conversation_id: uuid.UUID,
    limit: int = 20
):
    stmt = (
        select(Message)
        .where(
            Message.conversationId == conversation_id
        )
        .order_by(Message.createdAt.desc())
        .limit(limit)
    )

    result = await db.execute(stmt)

    messages = result.scalars().all()

    return list(reversed(messages))