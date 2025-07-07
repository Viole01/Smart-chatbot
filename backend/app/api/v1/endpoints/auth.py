# backend/app/api/v1/endpoints/auth.py
from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.api import deps
from app.core import security
from app.core.config import settings
from app.crud.crud_user import user as crud_user
from app.schemas.auth import Token, UserLogin, UserRegister
from app.schemas.user import User, UserCreate
from app.models.user import UserType

router = APIRouter()

@router.post("/register", response_model=Token)
def register(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserRegister,
) -> Any:
    """
    Register new user
    """
    # Check if user already exists
    user = crud_user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system."
        )
    
    # Create user data
    user_create = UserCreate(
        email=user_in.email,
        password=user_in.password,
        full_name=user_in.full_name,
        phone=user_in.phone,
        user_type=user_in.user_type,
        specialization=user_in.specialization if user_in.user_type == UserType.DOCTOR else None,
        license_number=user_in.license_number if user_in.user_type == UserType.DOCTOR else None,
        is_active=True,
        is_verified=user_in.user_type != UserType.DOCTOR  # Doctors need manual verification
    )
    
    # Create user
    user = crud_user.create(db, obj_in=user_create)
    
    # Generate tokens
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        user.id, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/login", response_model=Token)
def login(
    *,
    db: Session = Depends(deps.get_db),
    user_credentials: UserLogin
) -> Any:
    """
    Login endpoint - authenticate user and return access token
    """
    user = crud_user.authenticate(
        db, email=user_credentials.email, password=user_credentials.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    elif not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    elif not user.is_verified and user.user_type == UserType.DOCTOR:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Doctor account pending verification"
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        user.id, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

# Alternative login endpoint using OAuth2PasswordRequestForm (standard approach)
@router.post("/login/oauth", response_model=Token)
def login_oauth(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = crud_user.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    elif not user.is_verified and user.user_type == UserType.DOCTOR:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Doctor account pending verification"
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        user.id, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/logout")
def logout(
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Logout user (in a real app, you'd blacklist the token)
    """
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=User)
def read_users_me(
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get current user
    """
    return current_user

@router.post("/refresh", response_model=Token)
def refresh_token(
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Refresh access token
    """
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        current_user.id, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": current_user
    }