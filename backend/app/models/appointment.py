# backend/app/models/appointment.py
from sqlalchemy import Boolean, Column, Integer, String, DateTime, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

from app.db.base_class import Base

class AppointmentStatus(str, enum.Enum):
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"
    NO_SHOW = "no_show"
    AVAILABLE = "available"

class AppointmentUrgency(str, enum.Enum):
    ROUTINE = "routine"
    URGENT = "urgent"
    EMERGENCY = "emergency"

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Keys
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Nullable for availability slots
    doctor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Appointment Details
    appointment_datetime = Column(DateTime, nullable=False)
    duration = Column(Integer, default=30)  # Duration in minutes
    symptoms = Column(Text, nullable=True)
    diagnosis = Column(Text, nullable=True)
    prescription = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    
    # Patient Demographics (collected during booking)
    patient_age = Column(Integer, nullable=True)
    patient_gender = Column(String(10), nullable=True)
    
    # Status and Classification
    status = Column(Enum(AppointmentStatus), default=AppointmentStatus.CONFIRMED)
    urgency = Column(Enum(AppointmentUrgency), default=AppointmentUrgency.ROUTINE)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    patient = relationship("User", foreign_keys=[patient_id], back_populates="patient_appointments")
    doctor = relationship("User", foreign_keys=[doctor_id], back_populates="doctor_appointments")