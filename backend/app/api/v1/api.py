# backend/app/api/v1/api.py
from fastapi import APIRouter
from app.api.v1.endpoints import auth
from app.api.v1.endpoints import appointments

api_router = APIRouter()

# Include auth endpoints
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(appointments.router, prefix="/appointments", tags=["appointments"])

# Add other routers here as you build them
# api_router.include_router(users.router, prefix="/users", tags=["users"])
# api_router.include_router(patients.router, prefix="/patients", tags=["patients"])
# api_router.include_router(doctors.router, prefix="/doctors", tags=["doctors"])