# backend/app/db/init_db.py
from sqlalchemy.orm import Session
from app.crud.crud_user import user as crud_user
from app.schemas.user import UserCreate
from app.models.user import UserType
from app.db.session import SessionLocal

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
        },
        {
            "email": "dr.james@medconnect.com",
            "password": "doctor123", 
            "full_name": "Dr. James Wilson",
            "phone": "+1234567893",
            "specialization": "Orthopedics",
            "license_number": "MD12348",
            "years_experience": 12,
            "rating": 4.6
        },
        {
            "email": "dr.lisa@medconnect.com",
            "password": "doctor123", 
            "full_name": "Dr. Lisa Thompson",
            "phone": "+1234567894",
            "specialization": "Neurology",
            "license_number": "MD12349",
            "years_experience": 15,
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

    # Create sample patient for testing
    sample_patient = crud_user.get_by_email(db, email="patient@medconnect.com")
    if not sample_patient:
        patient_user_in = UserCreate(
            email="patient@medconnect.com",
            password="patient123",
            full_name="John Doe",
            phone="+1234567895",
            user_type=UserType.PATIENT,
            is_active=True,
            is_verified=True
        )
        patient_user = crud_user.create(db, obj_in=patient_user_in)
        print(f"Created sample patient: {patient_user.email}")

def create_tables():
    """
    Create all database tables
    """
    from app.db.session import engine
    # Import ALL models here to ensure they are registered with SQLAlchemy
    from app.models import user, appointment
    
    # Import Base to create tables
    from app.db.session import Base
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")
    
    # List all created tables for verification
    from sqlalchemy import inspect
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"Created tables: {', '.join(tables)}")

def add_missing_columns():
    """
    Add any missing columns to existing tables
    """
    from sqlalchemy import text
    from app.db.session import engine
    
    with engine.connect() as conn:
        try:
            # Add patient demographics to appointments if not exists
            try:
                conn.execute(text("ALTER TABLE appointments ADD COLUMN patient_age INTEGER"))
                print("✅ Added patient_age column to appointments")
            except Exception as e:
                if "already exists" in str(e).lower() or "duplicate column" in str(e).lower():
                    print("✅ patient_age column already exists")
                else:
                    print(f"❌ Error adding patient_age: {e}")
            
            try:
                conn.execute(text("ALTER TABLE appointments ADD COLUMN patient_gender VARCHAR(10)"))
                print("✅ Added patient_gender column to appointments")
            except Exception as e:
                if "already exists" in str(e).lower() or "duplicate column" in str(e).lower():
                    print("✅ patient_gender column already exists")
                else:
                    print(f"❌ Error adding patient_gender: {e}")
            
            # Commit the changes
            conn.commit()
            print("✅ Database schema updated successfully!")
            
        except Exception as e:
            print(f"❌ Error updating database schema: {e}")
            conn.rollback()

if __name__ == "__main__":
    # Create tables first
    create_tables()
    
    # Add any missing columns
    add_missing_columns()
    
    # Initialize sample data
    db = SessionLocal()
    try:
        init_db(db)
        print("✅ Database initialization completed!")
    finally:
        db.close()