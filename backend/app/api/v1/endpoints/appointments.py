# backend/app/api/v1/endpoints/appointments.py
from datetime import datetime, timedelta
from typing import Any, List, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.api import deps
from app.models.user import UserType, User
from app.models.appointment import Appointment, AppointmentStatus, AppointmentUrgency

router = APIRouter()

# Pydantic models for request/response
class SymptomAnalysisRequest(BaseModel):
    symptoms: str

class SymptomAnalysisResponse(BaseModel):
    urgency: str
    specialty: str
    recommendations: List[str]
    confidence: float

class DoctorAvailability(BaseModel):
    doctor_id: int
    doctor_name: str
    specialty: str
    experience: str
    rating: float
    available_slots: List[dict]

class AppointmentBookingRequest(BaseModel):
    doctor_id: int
    appointment_date: str
    appointment_time: str
    duration: int = 30
    symptoms: str
    urgency: str = "routine"

class AppointmentResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    appointment_datetime: datetime
    duration: int
    symptoms: str
    status: str
    urgency: str
    doctor_name: str
    patient_name: str
    
    class Config:
        from_attributes = True

class AppointmentListResponse(BaseModel):
    appointments: List[AppointmentResponse]

@router.post("/analyze-symptoms", response_model=SymptomAnalysisResponse)
def analyze_symptoms(
    request: SymptomAnalysisRequest,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Analyze patient symptoms using AI and return urgency and recommended specialty
    """
    # Ensure only patients can analyze symptoms
    if current_user.user_type is not UserType.PATIENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can analyze symptoms"
        )
    
    # Simple keyword-based analysis (replace with real AI/ML model)
    symptoms_lower = request.symptoms.lower()
    
    # Determine urgency
    urgent_keywords = ["chest pain", "severe pain", "difficulty breathing", "blood", "emergency", "heart attack"]
    emergency_keywords = ["unconscious", "not breathing", "stroke", "overdose"]
    
    if any(keyword in symptoms_lower for keyword in emergency_keywords):
        urgency = "emergency"
    elif any(keyword in symptoms_lower for keyword in urgent_keywords):
        urgency = "urgent"
    else:
        urgency = "routine"
    
    # Determine specialty
    specialty_mapping = {
        "heart": "Cardiology",
        "chest": "Cardiology", 
        "cardiac": "Cardiology",
        "skin": "Dermatology",
        "rash": "Dermatology",
        "acne": "Dermatology",
        "bone": "Orthopedics",
        "joint": "Orthopedics",
        "fracture": "Orthopedics",
        "mental": "Psychiatry",
        "anxiety": "Psychiatry",
        "depression": "Psychiatry",
        "eye": "Ophthalmology",
        "vision": "Ophthalmology",
        "ear": "ENT",
        "throat": "ENT",
        "nose": "ENT"
    }
    
    specialty = "General Practice"  # default
    for keyword, spec in specialty_mapping.items():
        if keyword in symptoms_lower:
            specialty = spec
            break
    
    # Generate recommendations based on urgency
    if urgency == "emergency":
        recommendations = [
            "This appears to be an emergency case - please seek immediate medical attention",
            "Consider visiting the emergency room or calling emergency services",
            "If available, I'll help you find urgent care options"
        ]
    elif urgency == "urgent":
        recommendations = [
            f"Based on your symptoms, this appears to be an urgent case",
            f"I recommend consulting with a {specialty} specialist as soon as possible",
            "I'll help you find the earliest available appointments"
        ]
    else:
        recommendations = [
            f"Based on your symptoms, this appears to be a routine consultation",
            f"I recommend consulting with a {specialty} specialist",
            "I'll help you find convenient appointment times"
        ]
    
    return SymptomAnalysisResponse(
        urgency=urgency,
        specialty=specialty,
        recommendations=recommendations,
        confidence=0.85  # Mock confidence score
    )

@router.get("/available-doctors", response_model=List[DoctorAvailability])
def get_available_doctors(
    specialty: str = "General Practice",
    date: Optional[str] = None,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Get list of available doctors for a given specialty and date
    """
    # Get doctors by specialty
    doctors_query = db.query(User).filter(
        User.user_type == UserType.DOCTOR,
        User.is_active == True,
        User.is_verified == True
    )
    
    if specialty != "General Practice":
        doctors_query = doctors_query.filter(User.specialization == specialty)
    
    doctors = doctors_query.all()
    
    if not doctors:
        # Fallback to general practitioners
        doctors = db.query(User).filter(
            User.user_type == UserType.DOCTOR,
            User.is_active == True,
            User.is_verified == True
        ).all()
    
    available_doctors = []
    
    for doctor in doctors:
        # Get doctor's availability for the next 7 days
        available_slots = get_doctor_availability(db, doctor.id, date)
        
        if available_slots:  # Only include doctors with available slots
            # Fix the type issues here
            years_exp = getattr(doctor, 'years_experience', None)
            rating = getattr(doctor, 'rating', None)
            
            available_doctors.append(DoctorAvailability(
                doctor_id=doctor.id,
                doctor_name=doctor.full_name,
                specialty=doctor.specialization or "General Practice",
                experience=f"{years_exp or 5} years",
                rating=rating or 4.5,
                available_slots=available_slots
            ))
    
    return available_doctors

def get_doctor_availability(db: Session, doctor_id: int, target_date: Optional[str] = None) -> List[dict]:
    """
    Get available time slots for a doctor
    """
    base_date = datetime.now().date() if not target_date else datetime.strptime(target_date, "%Y-%m-%d").date()
    
    available_slots = []
    
    # Generate slots for next 7 days
    for day_offset in range(7):
        current_date = base_date + timedelta(days=day_offset)
        
        # Skip weekends (simple logic)
        if current_date.weekday() >= 5:
            continue
            
        # Mock time slots (9 AM to 5 PM)
        time_slots = [
            "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
            "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
        ]
        
        # Check existing appointments
        start_datetime = datetime.combine(current_date, datetime.min.time())
        end_datetime = datetime.combine(current_date + timedelta(days=1), datetime.min.time())
        
        existing_appointments = db.query(Appointment).filter(
            Appointment.doctor_id == doctor_id,
            Appointment.appointment_datetime >= start_datetime,
            Appointment.appointment_datetime < end_datetime,
            Appointment.status == AppointmentStatus.CONFIRMED
        ).all()
        
        booked_times = [apt.appointment_datetime.strftime("%I:%M %p") for apt in existing_appointments]
        
        # Add available slots
        for time_slot in time_slots:
            if time_slot not in booked_times:
                available_slots.append({
                    "date": current_date.strftime("%Y-%m-%d"),
                    "time": time_slot,
                    "duration": "30 min"
                })
                
        # Limit to max 6 slots to keep response manageable
        if len(available_slots) >= 6:
            break
    
    return available_slots[:6]

@router.post("/book-appointment")
def book_appointment(
    request: AppointmentBookingRequest,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Book an appointment with a doctor
    """
    # Ensure only patients can book appointments
    if current_user.user_type is not UserType.PATIENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only patients can book appointments"
        )
    
    # Validate doctor exists and is active
    doctor = db.query(User).filter(
        User.id == request.doctor_id,
        User.user_type == UserType.DOCTOR,
        User.is_active == True
    ).first()
    
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found or inactive"
        )
    
    # Parse appointment datetime
    try:
        appointment_datetime = datetime.strptime(
            f"{request.appointment_date} {request.appointment_time}", 
            "%Y-%m-%d %I:%M %p"
        )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date or time format"
        )
    
    # Check if slot is still available
    existing_appointment = db.query(Appointment).filter(
        Appointment.doctor_id == request.doctor_id,
        Appointment.appointment_datetime == appointment_datetime,
        Appointment.status == AppointmentStatus.CONFIRMED
    ).first()
    
    if existing_appointment:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Time slot is no longer available"
        )
    
    # Create appointment
    appointment = Appointment(
        patient_id=current_user.id,
        doctor_id=request.doctor_id,
        appointment_datetime=appointment_datetime,
        duration=request.duration,
        symptoms=request.symptoms,
        urgency=AppointmentUrgency(request.urgency),
        status=AppointmentStatus.CONFIRMED
    )
    
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    
    # TODO: Send confirmation email/SMS
    # TODO: Add to doctor's calendar
    # TODO: Send notification to doctor
    
    return {
        "message": "Appointment booked successfully",
        "appointment_id": appointment.id,
        "appointment_datetime": appointment.appointment_datetime.isoformat(),
        "doctor_name": doctor.full_name,
        "confirmation_code": f"APT{appointment.id:06d}"
    }

@router.get("/my-appointments", response_model=AppointmentListResponse)
def get_my_appointments(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Get current user's appointments
    """
    if current_user.user_type is UserType.PATIENT:
        appointments = db.query(Appointment).filter(
            Appointment.patient_id == current_user.id
        ).order_by(Appointment.appointment_datetime.desc()).all()
    elif current_user.user_type is UserType.DOCTOR:
        appointments = db.query(Appointment).filter(
            Appointment.doctor_id == current_user.id
        ).order_by(Appointment.appointment_datetime.asc()).all()
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Convert to response format
    appointment_responses = []
    for appointment in appointments:
        # Get doctor and patient info
        doctor = db.query(User).filter(User.id == appointment.doctor_id).first()
        patient = db.query(User).filter(User.id == appointment.patient_id).first()
        
        appointment_responses.append(AppointmentResponse(
            id=appointment.id,
            patient_id=appointment.patient_id,
            doctor_id=appointment.doctor_id,
            appointment_datetime=appointment.appointment_datetime,
            duration=appointment.duration,
            symptoms=appointment.symptoms or "",
            status=appointment.status.value,
            urgency=appointment.urgency.value,
            doctor_name=doctor.full_name if doctor else "Unknown",
            patient_name=patient.full_name if patient else "Unknown"
        ))
    
    return AppointmentListResponse(appointments=appointment_responses)

@router.put("/appointments/{appointment_id}/cancel")
def cancel_appointment(
    appointment_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Cancel an appointment
    """
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )
    
    # Check permissions - Fixed the logic here
    if (current_user.user_type == UserType.PATIENT and appointment.patient_id != current_user.id) or \
       (current_user.user_type == UserType.DOCTOR and appointment.doctor_id != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only cancel your own appointments"
        )
    
    # Update appointment status
    appointment.status = AppointmentStatus.CANCELLED
    db.commit()
    
    return {"message": "Appointment cancelled successfully"}