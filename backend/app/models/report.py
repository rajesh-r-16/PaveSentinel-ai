from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import DateTime
from datetime import datetime

from app.core.database import Base


class Report(Base):

    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    image = Column(String)

    latitude = Column(Float)

    longitude = Column(Float)

    address = Column(String)

    severity = Column(String)

    status = Column(String)

    description = Column(String)

    verified_by = Column(String)

    verification_remarks = Column(String)

    verified_at = Column(DateTime)

    assigned_engineer = Column(String)

    assigned_at = Column(DateTime)

    completion_remarks = Column(String)

    completed_at = Column(DateTime)

    repair_image = Column(
        String,
        nullable=True
    )

    repair_image_uploaded_at = Column(
        DateTime,
        nullable=True
    )


    ai_detected = Column(String)

    ai_confidence = Column(Float)

    ai_detection_count = Column(Integer)

    ai_output_image = Column(String)

    ai_model = Column(String)

    ai_summary = Column(String)

    priority_score = Column(Integer)

    priority_level = Column(String)

    repair_recommendation = Column(String)

    estimated_repair_time = Column(String)
    
    user = relationship("User")