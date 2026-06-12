import uuid
from datetime import datetime
from enum import Enum  # This is Python's native Enum

# 1. Added Boolean and SQLEnum (aliased to avoid naming conflict)
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, ARRAY, Boolean, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import mapped_column, relationship

from app.models.base import Base

class NewsStatus(Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    ARCHIVED = "ARCHIVED"

class News(Base):
    __tablename__ = "news"

    id = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    title = mapped_column(String, nullable=False)
    category = mapped_column(String, nullable=False)
    
    # 2. Used the aliased SQLEnum here
    status = mapped_column(
    SQLEnum(NewsStatus, native_enum=False, values_callable=lambda x: [e.value for e in x]), 
    nullable=False, 
    default=NewsStatus.DRAFT
)
    
    summary = mapped_column(String, nullable=False)
    publishedDate = mapped_column(DateTime, nullable=False)
    readTime = mapped_column(Integer, nullable=False)
    imageUrl = mapped_column(String, nullable=False)
    
    # 3. This now uses SQLAlchemy's Boolean
    isFeatured = mapped_column(Boolean, nullable=False)
    
    createdAt = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updatedAt = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )