# backend/app/api/v1/endpoints/availability.py
from datetime import datetime, timedelta, date, time
from typing import Any, List, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.api import deps
from app.models.user import UserType, User
from app.models.appointment import Appointment, AppointmentStatus

router = APIRouter()

# Pydantic models for request/response
class TimeSlot(BaseModel):
    id: Optional[int] = None
    time: str
    duration: int
    isBooked: bool = False
    patientId: Optional[int] = None

class AvailabilityRequest(BaseModel):
    date: str  # YYYY-MM-DD format
    slots: List[TimeSlot]

class AvailabilityResponse(BaseModel):
    success: bool
    message: str
    availability: Optional[Dict[str, List[TimeSlot]]] = None

class DoctorPublicInfo(BaseModel):
    id: int
    full_name: str
    specialization: str
    experience: Optional[str] = None
    rating: Optional[float] = None
    license_number: Optional[str] = None

@router.get("/doctor/availability", response_model=AvailabilityResponse)
def get_doctor_availability(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Get doctor's availability schedule
    """
    # Ensure only doctors can access their availability
    if current_user.user_type is not UserType.DOCTOR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only doctors can access availability settings"
        )
    
    try:
        # Get next 30 days of availability
        start_date = datetime.now().date()
        end_date = start_date + timedelta(days=30)
        
        # Get existing appointments to determine availability
        appointments = db.query(Appointment).filter(
            Appointment.doctor_id == current_user.id,
            Appointment.appointment_datetime >= datetime.combine(start_date, time.min),
            Appointment.appointment_datetime <= datetime.combine(end_date, time.max),
            Appointment.status == AppointmentStatus.CONFIRMED
        ).all()
        
        # Create availability dictionary
        availability_dict = {}
        
        # Generate available slots for each day
        for day_offset in range(30):
            current_date = start_date + timedelta(days=day_offset)
            date_key = current_date.strftime('%Y-%m-%d')
            
            # Skip weekends for now (can be customized later)
            if current_date.weekday() < 5:  # Monday = 0, Friday = 4
                # Generate default time slots (9 AM to 5 PM, 30-minute intervals)
                daily_slots = []
                start_hour = 9
                end_hour = 17
                
                current_time = datetime.combine(current_date, time(start_hour, 0))
                end_time = datetime.combine(current_date, time(end_hour, 0))
                
                slot_id = 1
                while current_time < end_time:
                    time_str = current_time.strftime('%H:%M')
                    
                    # Check if this slot is booked
                    is_booked = any(
                        apt.appointment_datetime.date() == current_date and
                        apt.appointment_datetime.time() == current_time.time()
                        for apt in appointments
                    )
                    
                    # Find patient ID if booked
                    patient_id = None
                    if is_booked:
                        booked_apt = next(
                            (apt for apt in appointments 
                             if apt.appointment_datetime.date() == current_date and
                             apt.appointment_datetime.time() == current_time.time()),
                            None
                        )
                        if booked_apt and booked_apt.patient_id:
                            patient_id = booked_apt.patient_id
                    
                    daily_slots.append(TimeSlot(
                        id=int(f"{current_date.strftime('%Y%m%d')}{slot_id:02d}"),
                        time=time_str,
                        duration=30,
                        isBooked=is_booked,
                        patientId=patient_id
                    ))
                    
                    current_time += timedelta(minutes=30)
                    slot_id += 1
                
                availability_dict[date_key] = daily_slots
        
        return AvailabilityResponse(
            success=True,
            message="Availability retrieved successfully",
            availability=availability_dict
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving availability: {str(e)}"
        )

@router.post("/doctor/availability", response_model=AvailabilityResponse)
def save_doctor_availability(
    request: AvailabilityRequest,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Save doctor's availability slots
    """
    # Ensure only doctors can save their availability
    if current_user.user_type is not UserType.DOCTOR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only doctors can save availability"
        )
    
    try:
        # Parse the date
        availability_date = datetime.strptime(request.date, '%Y-%m-%d').date()
        
        # For now, we'll store availability as appointments with special status
        # In a production app, you might want a separate availability table
        
        # Remove existing "availability" appointments for this date
        existing_availability = db.query(Appointment).filter(
            Appointment.doctor_id == current_user.id,
            Appointment.appointment_datetime >= datetime.combine(availability_date, time.min),
            Appointment.appointment_datetime < datetime.combine(availability_date + timedelta(days=1), time.min),
            Appointment.status == AppointmentStatus.AVAILABLE
        ).all()
        
        for apt in existing_availability:
            db.delete(apt)
        
        # Create new availability slots
        for slot in request.slots:
            if not slot.isBooked:  # Only create availability for non-booked slots
                slot_time = datetime.strptime(slot.time, '%H:%M').time()
                slot_datetime = datetime.combine(availability_date, slot_time)
                
                # Create availability entry
                availability_appointment = Appointment(
                    doctor_id=current_user.id,
                    patient_id=None,
                    appointment_datetime=slot_datetime,
                    duration=slot.duration,
                    status=AppointmentStatus.AVAILABLE,
                    symptoms="AVAILABILITY_SLOT"  # Marker to identify availability slots
                )
                
                db.add(availability_appointment)
        
        db.commit()
        
        return AvailabilityResponse(
            success=True,
            message="Availability saved successfully"
        )
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date format. Use YYYY-MM-DD"
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving availability: {str(e)}"
        )

@router.get("/doctor/{doctor_id}/availability")
def get_doctor_public_availability(
    doctor_id: int,
    date: Optional[str] = None,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Get a doctor's public availability (for patients to view)
    """
    # Verify doctor exists
    doctor = db.query(User).filter(
        User.id == doctor_id,
        User.user_type == UserType.DOCTOR,
        User.is_active == True
    ).first()
    
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )
    
    try:
        # Get availability for next 7 days from specified date or today
        start_date = datetime.now().date()
        if date:
            start_date = datetime.strptime(date, '%Y-%m-%d').date()
        
        end_date = start_date + timedelta(days=7)
        
        # Get confirmed appointments (booked slots)
        booked_appointments = db.query(Appointment).filter(
            Appointment.doctor_id == doctor_id,
            Appointment.appointment_datetime >= datetime.combine(start_date, time.min),
            Appointment.appointment_datetime <= datetime.combine(end_date, time.max),
            Appointment.status == AppointmentStatus.CONFIRMED
        ).all()
        
        # Generate availability
        availability_dict = {}
        
        for day_offset in range(7):
            current_date = start_date + timedelta(days=day_offset)
            date_key = current_date.strftime('%Y-%m-%d')
            
            # Skip weekends
            if current_date.weekday() < 5:
                available_slots = []
                
                # Generate time slots (9 AM to 5 PM)
                start_hour = 9
                end_hour = 17
                
                current_time = datetime.combine(current_date, time(start_hour, 0))
                end_time = datetime.combine(current_date, time(end_hour, 0))
                
                slot_id = 1
                while current_time < end_time:
                    # Check if this slot is booked
                    is_booked = any(
                        apt.appointment_datetime == current_time
                        for apt in booked_appointments
                    )
                    
                    if not is_booked:  # Only return available slots
                        available_slots.append({
                            'id': int(f"{current_date.strftime('%Y%m%d')}{slot_id:02d}"),
                            'time': current_time.strftime('%H:%M'),
                            'duration': 30,
                            'isBooked': False,
                            'patientId': None
                        })
                    
                    current_time += timedelta(minutes=30)
                    slot_id += 1
                
                if available_slots:  # Only include days with available slots
                    availability_dict[date_key] = available_slots
        
        return {
            'success': True,
            'availability': availability_dict
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving doctor availability: {str(e)}"
        )

@router.get("/doctors/by-specialty/{specialty}")
def get_doctors_by_specialty(
    specialty: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Any:
    """
    Get doctors by specialty with their basic info
    """
    try:
        # Query doctors by specialty
        doctors_query = db.query(User).filter(
            User.user_type == UserType.DOCTOR,
            User.is_active == True,
            User.is_verified == True
        )
        
        if specialty.lower() != "general practice":
            doctors_query = doctors_query.filter(
                User.specialization.ilike(f"%{specialty}%")
            )
        
        doctors = doctors_query.all()
        
        # If no specialists found, get general practitioners
        if not doctors and specialty.lower() != "general practice":
            doctors = db.query(User).filter(
                User.user_type == UserType.DOCTOR,
                User.is_active == True,
                User.is_verified == True,
                User.specialization.ilike("%general%")
            ).all()
        
        # Format doctor information
        doctors_list = []
        for doctor in doctors:
            # Get basic info based on your User model
            doctor_info = DoctorPublicInfo(
                id=doctor.id,
                full_name=doctor.full_name,
                specialization=doctor.specialization or 'General Practice',
                experience=f"{doctor.years_experience or 5} years",
                rating=doctor.rating or 4.5,
                license_number=doctor.license_number or 'N/A'
            )
            doctors_list.append(doctor_info)
        
        return {
            'success': True,
            'doctors': doctors_list
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving doctors: {str(e)}"
        )