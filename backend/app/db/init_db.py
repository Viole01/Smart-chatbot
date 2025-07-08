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

def create_tables():
    """
    Create all database tables
    """
    from app.db.session import engine
    from app.models import user  # Import all models here
    
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