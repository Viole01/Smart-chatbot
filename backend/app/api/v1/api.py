# backend/app/api/v1/api.py (FastAPI version)
from fastapi import APIRouter
from .endpoints import auth, appointments, availability

api_router = APIRouter()

# Include routers
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(appointments.router, prefix="/appointments", tags=["appointments"])
api_router.include_router(availability.router, prefix="/availability", tags=["availability"])