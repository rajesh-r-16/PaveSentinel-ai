from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from pydantic import BaseModel


# ======================================
# User Registration Schema
# ======================================

class UserRegister(BaseModel):
    fullname: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: str


# ======================================
# User Login Schema
# ======================================

class UserLogin(BaseModel):
    email: EmailStr
    password: str


# ======================================
# User Response Schema
# ======================================

class UserResponse(BaseModel):
    id: int
    fullname: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True


# ======================================
# JWT Token Schema
# ======================================


class Token(BaseModel):
    access_token: str
    token_type: str

    role: str
    fullname: str
    email: str
    user_id: int


# ======================================
# Token Payload Schema
# ======================================

class TokenData(BaseModel):
    email: Optional[str] = None