# backend/app/schemas/user.py
from typing import Optional
from pydantic import BaseModel, EmailStr, validator
from datetime import datetime
from app.models.user import UserType

# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    user_type: Optional[UserType] = UserType.PATIENT
    specialization: Optional[str] = None
    license_number: Optional[str] = None
    is_active: Optional[bool] = True
    is_verified: Optional[bool] = False

# Properties to receive via API on creation
class UserCreate(UserBase):
    email: EmailStr
    password: str
    full_name: str
    phone: str
    user_type: UserType
    
    @validator('phone')
    def validate_phone(cls, v, values):
        user_type = values.get('user_type')
        if user_type in [UserType.PATIENT, UserType.DOCTOR] and not v:
            raise ValueError('Phone number is required for patients and doctors')
        return v
    
    @validator('specialization')
    def validate_specialization(cls, v, values):
        user_type = values.get('user_type')
        if user_type == UserType.DOCTOR and not v:
            raise ValueError('Specialization is required for doctors')
        return v
    
    @validator('license_number')
    def validate_license_number(cls, v, values):
        user_type = values.get('user_type')
        if user_type == UserType.DOCTOR and not v:
            raise ValueError('License number is required for doctors')
        return v

# Properties to receive via API on update
class UserUpdate(UserBase):
    password: Optional[str] = None

# Properties to return via API
class User(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Properties stored in DB
class UserInDB(User):
    hashed_password: str