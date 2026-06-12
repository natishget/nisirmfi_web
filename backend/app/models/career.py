import uuid
from datetime import datetime

# 1. Fixed the typo in sqlalchemy and added DateTime and ARRAY
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import mapped_column, relationship

from app.models.base import Base


class Career(Base):
    __tablename__ = "careers"

    id = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    title = mapped_column(String, nullable=False)
    department = mapped_column(String, nullable=False)
    location = mapped_column(String, nullable=False)
    type = mapped_column(String, nullable=False)
    purpose = mapped_column(String, nullable=False)
    
    # 2. Fixed String[] to ARRAY(String)
    responsibilities = mapped_column(ARRAY(String), nullable=False)
    qualification = mapped_column(ARRAY(String), nullable=False)
    salary = mapped_column(String, nullable=False)
    benefits = mapped_column(ARRAY(String), nullable=False)
    
    # 3. These will now work since DateTime is imported
    postDate = mapped_column(DateTime, nullable=False)
    endDate = mapped_column(DateTime, nullable=False)
    
    createdAt = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updatedAt = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )