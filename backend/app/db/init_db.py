# backend/app/db/init_db.py
from sqlalchemy.orm import Session
from app.crud.crud_user import user as crud_user
from app.schemas.user import UserCreate
from app.models.user import UserType
from app.db.session import SessionLocal
from app.core.config import settings

def init_db(db: Session) -> None:
    """
    Initialize database with default data
    """
    # Create default admin user
    admin_user = crud_user.get_by_email(db, email="admin@medconnect.com")
    if not admin_user:
        admin_user_in = UserCreate(
            email="admin@medconnect.com",
            password="admin123",  # Change this in production!
            full_name="System Administrator",
            user_type=UserType.ADMIN,
            is_active=True,
            is_verified=True
        )
        admin_user = crud_user.create(db, obj_in=admin_user_in)
        print(f"Created admin user: {admin_user.email}")

    # Create some sample doctors for testing
    sample_doctors = [
        {
            "email": "dr.sarah@medconnect.com",
            "password": "doctor123",
            "full_name": "Dr. Sarah Johnson",
            "phone": "+1234567890",
            "specialization": "Cardiology",
            "license_number": "MD12345",
            "years_experience": 10,
            "rating": 4.8
        },
        {
            "email": "dr.michael@medconnect.com", 
            "password": "doctor123",
            "full_name": "Dr. Michael Chen",
            "phone": "+1234567891",
            "specialization": "General Practice",
            "license_number": "MD12346",
            "years_experience": 8,
            "rating": 4.7
        },
        {
            "email": "dr.emily@medconnect.com",
            "password": "doctor123", 
            "full_name": "Dr. Emily Rodriguez",
            "phone": "+1234567892",
            "specialization": "Dermatology",
            "license_number": "MD12347",
            "years_experience": 6,
            "rating": 4.9
        }
    ]

    for doctor_data in sample_doctors:
        existing_doctor = crud_user.get_by_email(db, email=doctor_data["email"])
        if not existing_doctor:
            doctor_user_in = UserCreate(
                email=doctor_data["email"],
                password=doctor_data["password"],
                full_name=doctor_data["full_name"],
                phone=doctor_data["phone"],
                user_type=UserType.DOCTOR,
                specialization=doctor_data["specialization"],
                license_number=doctor_data["license_number"],
                years_experience=doctor_data["years_experience"],
                rating=doctor_data["rating"],
                is_active=True,
                is_verified=True
            )
            doctor_user = crud_user.create(db, obj_in=doctor_user_in)
            print(f"Created doctor: {doctor_user.email}")

def create_tables():
    """
    Create all database tables
    """
    from app.db.session import engine
    from app.models import user, appointment  # Import ALL models here
    
    # Import all models to ensure they are registered
    from app.db.session import Base
    
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    # Create tables and initialize data
    create_tables()
    
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()