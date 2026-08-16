from fastapi import APIRouter, HTTPException
from fastapi import Depends
from fastapi import UploadFile
from fastapi import File
from fastapi import Query

from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import get_db

from app.models.report import Report
from app.models.notification import Notification
from app.schemas.report import ReportCreate
from app.core.security import get_current_user
from app.models.user import User
from ai.services.detect_pothole import detect_pothole
from ai.services.ai_report import generate_ai_report
from ai.services.priority import calculate_priority
import os

router = APIRouter(
    prefix="/report",
    tags=["Citizen Report"]
)


@router.post("/create")
async def create_report(
    
    report: ReportCreate = Depends(ReportCreate.as_form),

    image: UploadFile = File(...),

    db: Session = Depends(get_db),

    current_user=Depends(get_current_user)


):
    email = current_user.get("sub")

    db_user = db.query(User).filter(
        User.email == email
    ).first()

    if db_user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    allowed_types = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp"
    ]

    if image.content_type not in allowed_types:

        raise HTTPException(
            status_code=400,
            detail="Only JPG, JPEG, PNG and WEBP images are allowed"
        )
    MAX_FILE_SIZE = 10 * 1024 * 1024

    file_content = await image.read()

    if len(file_content) > MAX_FILE_SIZE:

        raise HTTPException(
            status_code=400,
            detail="Image size must be less than 10 MB"
        )
    
    os.makedirs("uploads", exist_ok=True)

    filename = image.filename

    unique_filename = (
        f"{db_user.id}_"
        f"{int(datetime.utcnow().timestamp())}_"
        f"{filename}"
    )

    filepath = os.path.join(
        "uploads",
        unique_filename
    )


    with open(filepath, "wb") as file:

        file.write(file_content)

    ai_result = detect_pothole(filepath)

    ai_summary = generate_ai_report(ai_result)

    priority = calculate_priority(ai_result)
    

    new_report = Report(
        user_id=db_user.id,

        image=filepath,

        latitude=report.latitude,

        longitude=report.longitude,

        address=report.address,

        description=report.description,

        severity=ai_result["severity"],

        status="Pending",

        ai_detected=str(ai_result["detected"]),

        ai_confidence=ai_result["confidence"],

        ai_detection_count=ai_result["count"],

        ai_output_image=ai_result["output_image"],

        ai_model="YOLOv8",

        ai_summary=ai_summary,

        priority_score=priority["score"],

        priority_level=priority["level"],

        repair_recommendation=priority["recommendation"],

        estimated_repair_time=priority["repair_time"]
        

    )

    db.add(new_report)

    db.commit()

    db.refresh(new_report)

    notification = Notification(

        user_id=db_user.id,

        title="Report Submitted",

        message=(
            f"Your pothole report "
            f"#{new_report.id} was submitted successfully."
        ),

        notification_type="success",

        is_read=False
    )

    db.add(notification)

    db.commit()

    return {

    "message": "Report Submitted Successfully",

    "report_id": new_report.id,

    "ai": {

        "detected": ai_result["detected"],

        "count": ai_result["count"],

        "confidence": ai_result["confidence"],

        "severity": ai_result["severity"],

        "summary": ai_summary,

        "priority": {

            "score": priority["score"],

            "level": priority["level"],

            "recommendation": priority["recommendation"],

            "estimated_repair_time": priority["repair_time"]

        },

        "output_image": ai_result["output_image"]

    }

}
@router.get("/map")
def get_map_reports(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    reports = db.query(Report).all()

    response = []

    for report in reports:

        response.append({

            "id": report.id,

            "latitude": report.latitude,

            "longitude": report.longitude,

            "address": report.address,

            "description": report.description,

            

            "severity": report.severity,

            "status": report.status

        })

    return response
@router.get("/my-reports")
def get_my_reports(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # Make sure only Citizens can access this endpoint
    if current_user.get("role") != "Citizen":
        raise HTTPException(
            status_code=403,
            detail="Citizen access required"
        )

    # Get email from JWT
    email = current_user.get("sub")

    if not email:
        raise HTTPException(
            status_code=401,
            detail="User email not found in token"
        )

    # Find the logged-in user
    db_user = db.query(User).filter(
        User.email == email
    ).first()

    if db_user is None:
        raise HTTPException(
            status_code=404,
            detail="Citizen not found"
        )

    # Get reports belonging to this citizen
    reports = db.query(Report).filter(
        Report.user_id == db_user.id
    ).order_by(
        Report.id.desc()
    ).all()

    return [
        {
            "id": report.id,
            "latitude": report.latitude,
            "longitude": report.longitude,
            "address": report.address,
            "description": report.description,
            "severity": report.severity,
            "status": report.status,
            "image": report.image,
            "repair_image": report.repair_image,
            "repair_image_uploaded_at": report.repair_image_uploaded_at
        }
        for report in reports
    ]
@router.get("/search")
def search_reports(

    address: str | None = Query(None),

    status: str | None = Query(None),

    severity: str | None = Query(None),

    priority: str | None = Query(None),

    current_user=Depends(get_current_user),

    db: Session =Depends(get_db)

):
    db_user = db.query(User).filter(
        User.email == current_user["sub"]
    ).first()

    query = db.query(Report).filter(
        Report.user_id == db_user.id
    )

    if address:

        query = query.filter(

            Report.address.ilike(f"%{address}%")

    )
    if status:

        query = query.filter(

            Report.status == status

    )
    if severity:

        query = query.filter(

            Report.severity == severity

    )
    if priority:

        query = query.filter(

            Report.priority_level == priority

    )
    return query.order_by(
        Report.id.desc()
    ).all()

@router.get("/{report_id}")
def get_report_details(
    report_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # Find logged-in user
    db_user = db.query(User).filter(
        User.email == current_user["sub"]
    ).first()

    if db_user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Find report
    report = db.query(Report).filter(
        Report.id == report_id,
        Report.user_id == db_user.id
    ).first()

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    return report
@router.put("/{report_id}")
def update_report(

    report_id: int,

    report: ReportCreate,

    current_user=Depends(get_current_user),

    db: Session = Depends(get_db)

):

    # Find logged in user
    db_user = db.query(User).filter(
        User.email == current_user["sub"]
    ).first()

    if db_user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Find report
    db_report = db.query(Report).filter(
        Report.id == report_id,
        Report.user_id == db_user.id
    ).first()

    if db_report is None:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    # Allow update only if status is Pending
    if db_report.status != "Pending":
        raise HTTPException(
            status_code=400,
            detail="Only Pending reports can be updated"
        )

    db_report.latitude = report.latitude
    db_report.longitude = report.longitude
    db_report.address = report.address
    db_report.description = report.description

    db.commit()
    db.refresh(db_report)

    return {
        "message": "Report updated successfully",
        "report": db_report
    }
@router.delete("/{report_id}")
def delete_report(
    report_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # Find logged-in user
    db_user = db.query(User).filter(
        User.email == current_user["sub"]
    ).first()

    if db_user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Find report
    report = db.query(Report).filter(
        Report.id == report_id,
        Report.user_id == db_user.id
    ).first()

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Report not found"
        )

    # Allow delete only if Pending
    if report.status != "Pending":
        raise HTTPException(
            status_code=400,
            detail="Only Pending reports can be deleted"
        )

    db.delete(report)
    db.commit()

    return {
        "message": "Report deleted successfully"
    }
