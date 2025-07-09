# backend/app/models/user.py
from sqlalchemy import Boolean, Column, Integer, String, DateTime, Enum, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.base_class import Base

class UserType(str, enum.Enum):
    PATIENT = "patient"
    DOCTOR = "doctor"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    user_type = Column(Enum(UserType), nullable=False, default=UserType.PATIENT)
    
    # Doctor-specific fields
    specialization = Column(String, nullable=True)
    license_number = Column(String, unique=True, nullable=True, index=True)
    years_experience = Column(Integer, nullable=True)
    rating = Column(Float, nullable=True, default=4.5)
    
    # Status fields
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    is_superuser = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships for appointments
    patient_appointments = relationship("Appointment", foreign_keys="Appointment.patient_id", back_populates="patient")
    doctor_appointments = relationship("Appointment", foreign_keys="Appointment.doctor_id", back_populates="doctor")