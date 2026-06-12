from sqlalchemy import DateTime, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import mapped_column
from datetime import datetime
import uuid

from app.models.base import Base


class Visitor(Base):
    __tablename__ = "visitors"

    id = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )

    name = mapped_column(String, nullable=True)

    createdAt = mapped_column(
        DateTime,
        default=datetime.utcnow
    )
