# backend/app/crud/crud_appointment.py
from typing import List, Optional
from datetime import datetime, date
from sqlalchemy.orm import Session
from sqlalchemy import and_

from app.models.appointment import Appointment, AppointmentStatus
from app.models.user import User

class CRUDAppointment:
    def create(self, db: Session, *, obj_in: dict) -> Appointment:
        """Create a new appointment"""
        db_obj = Appointment(**obj_in)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get(self, db: Session, id: int) -> Optional[Appointment]:
        """Get appointment by ID"""
        return db.query(Appointment).filter(Appointment.id == id).first()

    def get_patient_appointments(self, db: Session, *, patient_id: int) -> List[Appointment]:
        """Get all appointments for a patient"""
        return db.query(Appointment).filter(
            Appointment.patient_id == patient_id
        ).order_by(Appointment.appointment_datetime.desc()).all()

    def get_doctor_appointments(self, db: Session, *, doctor_id: int) -> List[Appointment]:
        """Get all appointments for a doctor"""
        return db.query(Appointment).filter(
            Appointment.doctor_id == doctor_id
        ).order_by(Appointment.appointment_datetime.asc()).all()

    def get_doctor_appointments_by_date(self, db: Session, *, doctor_id: int, date: date) -> List[Appointment]:
        """Get doctor's appointments for a specific date"""
        start_datetime = datetime.combine(date, datetime.min.time())
        end_datetime = datetime.combine(date, datetime.max.time())
        
        return db.query(Appointment).filter(
            and_(
                Appointment.doctor_id == doctor_id,
                Appointment.appointment_datetime >= start_datetime,
                Appointment.appointment_datetime <= end_datetime,
                Appointment.status == AppointmentStatus.CONFIRMED
            )
        ).all()

    def get_appointment_by_datetime(self, db: Session, *, doctor_id: int, appointment_datetime: datetime) -> Optional[Appointment]:
        """Check if a specific datetime slot is already booked"""
        return db.query(Appointment).filter(
            and_(
                Appointment.doctor_id == doctor_id,
                Appointment.appointment_datetime == appointment_datetime,
                Appointment.status == AppointmentStatus.CONFIRMED
            )
        ).first()

    def update(self, db: Session, *, db_obj: Appointment, obj_in: dict) -> Appointment:
        """Update an appointment"""
        for field, value in obj_in.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def delete(self, db: Session, *, id: int) -> Appointment:
        """Delete an appointment"""
        obj = db.query(Appointment).get(id)
        db.delete(obj)
        db.commit()
        return obj

appointment = CRUDAppointment()