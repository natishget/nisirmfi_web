from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from app.models.base import Base


class Conversation(Base):
    __tablename__ = "conversations"

    id = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    chatUserId = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("visitors.id"),
        nullable=True
    )

    title = mapped_column(String, nullable=True)

    createdAt = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    updatedAt = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    lastMessageAt = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    messages = relationship(
        "Message",
        back_populates="conversation",
        cascade="all, delete"
    )