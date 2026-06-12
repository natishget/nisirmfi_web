from sqlalchemy import Text, JSON, Integer, ForeignKey
from sqlalchemy.orm import mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from pgvector.sqlalchemy import Vector

import uuid

from app.models.base import Base


class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    documentId = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("documents.id"),
        nullable=False
    )

    chunkIndex = mapped_column(
        Integer,
        nullable=False
    )

    chunkText = mapped_column(
        Text,
        nullable=False
    )

    embedding = mapped_column(
        Vector(3072),
        nullable=False
    )

    chunkMetadata = mapped_column(
    "metadata",
    JSON,
    nullable=True
    )

    document = relationship(
        "Document",
        back_populates="chunks"
    )