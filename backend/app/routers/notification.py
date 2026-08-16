from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user

from app.models.notification import Notification
from app.models.user import User


router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"]
)


# ============================================================
# GET USER NOTIFICATIONS
# ============================================================

@router.get("/")
def get_notifications(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == current_user["sub"]
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    user_id=user.id

    notifications = db.query(
        Notification
    ).filter(
        Notification.user_id == user.id
    ).order_by(
        Notification.id.desc()
    ).all()

    return notifications


# ============================================================
# UNREAD COUNT
# ============================================================

@router.get("/unread-count")
def get_unread_count(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == current_user["sub"]
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    count = db.query(
        Notification
    ).filter(
        Notification.user_id == user.id,
        Notification.is_read == False
    ).count()

    return {
        "unread_count": count
    }


# ============================================================
# MARK NOTIFICATION AS READ
# ============================================================

@router.put("/{notification_id}/read")
def mark_notification_read(
    notification_id: int,

    current_user=Depends(get_current_user),

    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == current_user["sub"]
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    notification = db.query(
        Notification
    ).filter(
        Notification.id == notification_id,
        Notification.user_id == user.id
    ).first()

    if notification is None:
        raise HTTPException(
            status_code=404,
            detail="Notification not found"
        )

    notification.is_read = True

    db.commit()

    db.refresh(notification)

    return {
        "message": "Notification marked as read"
    }
@router.post("/test")
def create_test_notification(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):

    email = current_user["sub"]

    user = db.query(User).filter(
        User.email == email
    ).first()

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    notification = Notification(
        user_id=user.id,
        report_id=None,
        title="Test Notification",
        message="Test notification - PaveSentinel AI",
        notification_type="success",
        is_read=False
    )

    db.add(notification)
    db.commit()
    db.refresh(notification)

    return {
        "message": "Test notification created",
        "notification_id": notification.id
    }