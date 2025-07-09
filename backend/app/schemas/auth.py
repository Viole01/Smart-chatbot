# backend/app/schemas/auth.py
from typing import Optional
from pydantic import BaseModel, EmailStr, validator
from app.models.user import UserType
from app.schemas.user import User

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    user_type: UserType  # <- CHANGED: Made this REQUIRED instead of Optional
    
    class Config:
        # Allow the schema to be used in FastAPI
        from_attributes = True

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: str
    user_type: UserType
    specialization: Optional[str] = None
    license_number: Optional[str] = None
    
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

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class TokenPayload(BaseModel):
    sub: Optional[int] = None