# backend/app/schemas/user.py
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr
from app.models.user import UserType

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    user_type: UserType
    specialization: Optional[str] = None
    license_number: Optional[str] = None
    is_active: bool = True
    is_verified: bool = False

class UserCreate(UserBase):
    password: str
    # Add the missing fields
    years_experience: Optional[int] = None
    rating: Optional[float] = None

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    specialization: Optional[str] = None
    license_number: Optional[str] = None
    years_experience: Optional[int] = None
    rating: Optional[float] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None

class User(UserBase):
    id: int
    years_experience: Optional[int] = None
    rating: Optional[float] = None
    is_superuser: bool = False
    # Fix: Change these to datetime objects instead of strings
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True