from fastapi import APIRouter, Depends

from app.core.security import get_current_user

router = APIRouter(
    prefix="/protected",
    tags=["Protected"]
)

@router.get("/profile")
def profile(current_user=Depends(get_current_user)):

    return {
        "message": "Welcome",
        "user": current_user
    }