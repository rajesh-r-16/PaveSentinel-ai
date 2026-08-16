from sqlalchemy import Column, Integer, String, Boolean, DateTime
from app.core.database import Base
from datetime import datetime


class Notification(Base):

    __tablename__ = "notifications"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        nullable=False
    )

    report_id = Column(
        Integer,
        nullable=True
    )

    title = Column(
        String,
        nullable=True
    )

    message = Column(
        String,
        nullable=False
    )

    notification_type = Column(
        String,
        nullable=True
    )

    is_read = Column(
        Boolean,
        default=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )