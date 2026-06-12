from sqlalchemy import String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid
import enum

from app.models.base import Base


class MessageRole(str, enum.Enum):
    USER = "USER"
    ASSISTANT = "ASSISTANT"
    SYSTEM = "SYSTEM"


class Message(Base):
    __tablename__ = "messages"

    id = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    conversationId = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("conversations.id"),
        nullable=False
    )

    role = mapped_column(
        Enum(MessageRole, name="MessageRole", native_enum=True), 
        nullable=False
    )

    content = mapped_column(
        Text,
        nullable=False
    )

    createdAt = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    conversation = relationship(
        "Conversation",
        back_populates="messages"
    )