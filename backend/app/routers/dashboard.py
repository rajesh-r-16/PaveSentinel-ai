from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from typing import Optional
from app.core.security import (
    get_current_user,
    require_role
)

from app.models.report import Report
from app.models.user import User
from datetime import datetime
from app.schemas.enums import ReportStatus
from fastapi import UploadFile, File
from sqlalchemy import func, extract
from app.models.notification import Notification

import os

from app.routers import notification

router = APIRouter(
    prefix="/dashboard",
    tags=["Official Dashboard"]
)
# =====================================================
# Citizen Dashboard Statistics
# =====================================================
@router.get("/my-stats")
def citizen_dashboard_stats(
    current_user=Depends(require_role("Citizen")),
    db: Session = Depends(get_db)
):

    print("CURRENT USER:", current_user)

    # JWT payload contains the user's email in "sub"
    email = current_user.get("sub")

    if not email:
        raise HTTPException(
            status_code=401,
            detail="User email not found in token"
        )

    print("CITIZEN EMAIL:", email)

    # Find citizen in database
    db_user = db.query(User).filter(
        User.email == email
    ).first()

    if db_user is None:
        raise HTTPException(
            status_code=404,
            detail="Citizen not found"
        )

    print("CITIZEN ID:", db_user.id)

    # Count only this citizen's reports
    total = db.query(Report).filter(
        Report.user_id == db_user.id
    ).count()

    pending = db.query(Report).filter(
        Report.user_id == db_user.id,
        Report.status == "Pending"
    ).count()

    verified = db.query(Report).filter(
        Report.user_id == db_user.id,
        Report.status == "Verified"
    ).count()

    progress = db.query(Report).filter(
        Report.user_id == db_user.id,
        Report.status == "In Progress"
    ).count()

    completed = db.query(Report).filter(
        Report.user_id == db_user.id,
        Report.status == "Completed"
    ).count()

    result = {
        "total_reports": total,
        "pending": pending,
        "verified": verified,
        "in_progress": progress,
        "completed": completed
    }

    print("CITIZEN STATS:", result)

    return result

@router.get("/stats")
def dashboard_stats(
    current_user=Depends(require_role("Official")),
    db: Session = Depends(get_db)
    
):

    total = db.query(Report).count()

    pending = db.query(Report).filter(
        Report.status == "Pending"
    ).count()

    verified = db.query(Report).filter(
        Report.status == "Verified"
    ).count()

    progress = db.query(Report).filter(
        Report.status == "In Progress"
    ).count()

    completed = db.query(Report).filter(
        Report.status == "Completed"
    ).count()

    return {

        "total_reports": total,

        "pending": pending,

        "verified": verified,

        "in_progress": progress,

        "completed": completed

    }
@router.get("/reports")
def get_all_reports(
    current_user=Depends(require_role("Official")),
    db: Session = Depends(get_db)
):

    reports = db.query(Report).all()

    response = []

    for report in reports:

        user = db.query(User).filter(
            User.id == report.user_id
        ).first()

        response.append({

            "report_id": report.id,

            "citizen_name": user.fullname if user else "Unknown",

            "citizen_email": user.email if user else "Unknown",

            "latitude": report.latitude,

            "longitude": report.longitude,

            "address": report.address,

            "description": report.description,

            "severity": report.severity,

            "status": report.status,

            "image": report.image,

            "repair_image": report.repair_image,

            "repair_image_uploaded_at": report.repair_image_uploaded_at

        })

    return response
@router.get("/search")
def search_reports(
    status: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    address: Optional[str] = Query(None),
    citizen_name: Optional[str] = Query(None),

    current_user=Depends(require_role("Official")),
    db: Session = Depends(get_db)
):

    reports = db.query(Report).all()

    results = []

    for report in reports:

        user = db.query(User).filter(
            User.id == report.user_id
        ).first()

        # Filter by Status
        if status:
            if report.status.lower() != status.lower():
                continue

        # Filter by Severity
        if severity:
            if report.severity.lower() != severity.lower():
                continue

        # Filter by Address
        if address:
            if address.lower() not in report.address.lower():
                continue

        # Filter by Citizen Name
        if citizen_name:
            if user is None:
                continue

            if citizen_name.lower() not in user.fullname.lower():
                continue

        results.append({

            "report_id": report.id,

            "citizen_name": user.fullname if user else "",

            "citizen_email": user.email if user else "",

            "address": report.address,

            "latitude": report.latitude,

            "longitude": report.longitude,

            "severity": report.severity,

            "status": report.status,

            "description": report.description,

            "image": report.image

        })

    return results
@router.get("/report/{report_id}")
def get_report_details(
    report_id: int,
    current_user=Depends(require_role("Official")),
    db: Session = Depends(get_db)
):

    report = db.query(Report).filter(
        Report.id == report_id
    ).first()

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    user = db.query(User).filter(
        User.id == report.user_id
    ).first()

    return {

        "report_id": report.id,

        "citizen": {

            "name": user.fullname if user else "",

            "email": user.email if user else "",

            "role": user.role if user else ""

        },

        "location": {

            "latitude": report.latitude,

            "longitude": report.longitude,

            "address": report.address

        },

        "complaint": {

            "description": report.description,

            "severity": report.severity,

            "status": report.status

        },

        "image_url": f"http://127.0.0.1:8000/{report.image}"

    }
@router.put("/verify/{report_id}")
def verify_report(

    report_id: int,

    severity: str,

    remarks: str,

    current_user=Depends(require_role("Official")),

    db: Session = Depends(get_db)

):

    report = db.query(Report).filter(
        Report.id == report_id
    ).first()

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    if report.status != "Pending":
        raise HTTPException(
            status_code=400,
            detail="Report already verified"
        )

    report.severity = severity

    report.status = "Verified"

    notification = Notification(
        user_id=report.user_id,
        report_id=report.id,
        title="Report Verified",
        message=f"Your report #{report.id} has been verified by an official.",
        notification_type="success",
        is_read=False
    )

    db.add(notification)

    report.verification_remarks = remarks

    report.verified_by = current_user["sub"]

    report.verified_at = datetime.utcnow()

    db.commit()

    db.refresh(report)

    return {

        "message": "Report verified successfully",

        "report": report

    }
@router.put("/assign/{report_id}")
def assign_engineer(

    report_id: int,

    engineer_name: str,

    current_user=Depends(require_role("Official")),

    db: Session = Depends(get_db)

):

    report = db.query(Report).filter(
        Report.id == report_id
    ).first()

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    if report.status != "Verified":
        raise HTTPException(
            status_code=400,
            detail="Report must be Verified before assignment"
        )

    report.assigned_engineer = engineer_name

    report.assigned_at = datetime.utcnow()

    report.status = "In Progress"

    notification = Notification(
        user_id=report.user_id,
        report_id=report.id,
        title="Engineer Assigned",
        message=f"An engineer has been assigned to your report #{report.id}. Repair work is now in progress.",
        notification_type="info",
        is_read=False
    )

    db.add(notification)

    db.commit()

    db.refresh(report)

    return {

        "message": "Engineer assigned successfully",

        "report": {

            "report_id": report.id,

            "assigned_engineer": report.assigned_engineer,

            "assigned_at": report.assigned_at,

            "status": report.status

        }

    }
@router.put("/status/{report_id}")
def update_repair_status(

    report_id: int,

    status: ReportStatus,

    remarks: str,

    current_user=Depends(require_role("Official")),

    db: Session = Depends(get_db)

):

    report = db.query(Report).filter(
        Report.id == report_id
    ).first()

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    

    report.status = status.value

    if status.value == "Completed":

        report.completed_at = datetime.utcnow()

        report.completion_remarks = remarks

        notification = Notification(
            user_id=report.user_id,
            report_id=report.id,
            title="Report Completed",
            message=f"Your report #{report.id} has been completed.",
            notification_type="success",
            is_read=False
        )

        db.add(notification)

    db.commit()

    db.refresh(report)

    return {

        "message": "Status updated successfully",

        "report": {

            "id": report.id,

            "status": report.status,

            "completion_remarks": report.completion_remarks,

            "completed_at": report.completed_at

        }

    }
@router.put("/repair-photo/{report_id}")
def upload_repair_photo(
    report_id: int,
    image: UploadFile = File(...),
    current_user=Depends(require_role("Official")),
    db: Session = Depends(get_db)
):

    report = db.query(Report).filter(
        Report.id == report_id
    ).first()

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    if report.status != "Completed":
        raise HTTPException(
            status_code=400,
            detail="Repair must be completed before uploading photo"
        )

    # Create repair upload directory
    os.makedirs(
        "uploads/repair",
        exist_ok=True
    )

    # Get file extension
    extension = os.path.splitext(
        image.filename
    )[1]

    # Create unique filename
    filename = f"repair_{report_id}_{datetime.utcnow().timestamp()}{extension}"

    filepath = os.path.join(
        "uploads",
        "repair",
        filename
    )

    # Save file
    with open(filepath, "wb") as file:

        file.write(
            image.file.read()
        )

    # Save path in database
    report.repair_image = filepath

    report.repair_image_uploaded_at = datetime.utcnow()

    notification = Notification(
        user_id=report.user_id,
        report_id=report.id,
        title="Repair Photo Uploaded",
        message=f"A repaired-road photo is now available for your report #{report.id}.",
        notification_type="success"
    )

    db.add(notification)

    db.commit()

    db.refresh(report)

    return {
        "message": "Repair photo uploaded successfully",
        "report_id": report.id,
        "repair_image": f"http://127.0.0.1:8000/{filepath}"
    }

@router.get("/analytics")
def dashboard_analytics(
    current_user=Depends(require_role("Official")),
    db: Session = Depends(get_db)
):

    total = db.query(Report).count()

    pending = db.query(Report).filter(
        Report.status == "Pending"
    ).count()

    verified = db.query(Report).filter(
        Report.status == "Verified"
    ).count()

    progress = db.query(Report).filter(
        Report.status == "In Progress"
    ).count()

    completed = db.query(Report).filter(
        Report.status == "Completed"
    ).count()

    low = db.query(Report).filter(
        Report.severity == "Low"
    ).count()

    medium = db.query(Report).filter(
        Report.severity == "Medium"
    ).count()

    high = db.query(Report).filter(
        Report.severity == "High"
    ).count()

    locations = []

    reports = db.query(Report).all()

    for report in reports:

        locations.append({

            "id": report.id,

            "latitude": report.latitude,

            "longitude": report.longitude,

            "address": report.address,

            "status": report.status,

            "severity": report.severity

        })

    return {

        "cards": {

            "total_reports": total,

            "pending": pending,

            "verified": verified,

            "in_progress": progress,

            "completed": completed

        },

        "severity": {

            "low": low,

            "medium": medium,

            "high": high

        },

        "map": locations

    }

@router.get("/ai-analytics")
def ai_dashboard(
    current_user=Depends(require_role("Official")),
    db: Session = Depends(get_db)
):

    total_reports = db.query(Report).count()

    detected_reports = db.query(Report).filter(
        Report.ai_detected == "True"
    ).count()

    avg_confidence = db.query(
        func.avg(Report.ai_confidence)
    ).scalar()

    high = db.query(Report).filter(
        Report.severity == "High"
    ).count()

    medium = db.query(Report).filter(
        Report.severity == "Medium"
    ).count()

    low = db.query(Report).filter(
        Report.severity == "Low"
    ).count()

    critical = db.query(Report).filter(
        Report.priority_level == "Critical"
    ).count()

    high_priority = db.query(Report).filter(
        Report.priority_level == "High"
    ).count()

    medium_priority = db.query(Report).filter(
        Report.priority_level == "Medium"
    ).count()

    low_priority = db.query(Report).filter(
        Report.priority_level == "Low"
    ).count()

    reports = db.query(Report).all()

    map_data = []

    for report in reports:

        map_data.append({

            "id": report.id,

            "latitude": report.latitude,

            "longitude": report.longitude,

            "severity": report.severity,

            "priority": report.priority_level,

            "confidence": report.ai_confidence,

            "address": report.address

        })

    return {

        "summary": {

            "total_reports": total_reports,

            "ai_detected": detected_reports,

            "average_confidence": round(avg_confidence or 0, 2)

        },

        "severity": {

            "low": low,

            "medium": medium,

            "high": high

        },

        "priority": {

            "critical": critical,

            "high": high_priority,

            "medium": medium_priority,

            "low": low_priority

        },

        "map": map_data

    }