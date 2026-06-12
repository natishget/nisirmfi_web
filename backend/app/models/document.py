from datetime import datetime
import enum
import uuid

from sqlalchemy import String, DateTime, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import mapped_column, relationship, Mapped

from app.models.base import Base


class DocumentStatus(str, enum.Enum):
    PROCESSING = "PROCESSING"
    READY = "READY"
    FAILED = "FAILED"

class Document(Base):
    __tablename__ = "documents"

    id = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    title = mapped_column(
        String,
        nullable=False
    )

    fileName = mapped_column(
        String,
        nullable=False
    )

    source = mapped_column(
        String,
        nullable=True
    )

    sourceType = mapped_column(
        String,
        nullable=True
    )

    contentType = mapped_column(
        String,
        nullable=True
    )

    status: Mapped[DocumentStatus] = mapped_column(
        SQLEnum(DocumentStatus, name="DocumentStatus", native_enum=True),
        default=DocumentStatus.PROCESSING
    )

    createdAt = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    updatedAt = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    chunks = relationship(
        "DocumentChunk",
        back_populates="document",
        cascade="all, delete-orphan"
    )