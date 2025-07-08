# backend/create_tables.py
"""
Script to create database tables and initial data
"""
import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine, Base
from app.models.user import User, UserType
from app.core.security import get_password_hash

def create_tables():
    """Create all database tables"""
    print("Creating database tables...")
    
    # Import all models to ensure they are registered
    from app.models import user
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created successfully!")

def create_admin_user():
    """Create default admin user"""
    db = SessionLocal()
    try:
        # Check if admin user already exists
        admin_user = db.query(User).filter(User.email == "admin@medconnect.com").first()
        
        if not admin_user:
            # Create admin user
            admin_user = User(
                email="admin@medconnect.com",
                hashed_password=get_password_hash("admin123"),
                full_name="System Administrator",
                user_type=UserType.ADMIN,
                is_active=True,
                is_verified=True,
                is_superuser=True
            )
            db.add(admin_user)
            db.commit()
            print("✓ Admin user created:")
            print(f"  Email: admin@medconnect.com")
            print(f"  Password: admin123")
            print("  ⚠️  Please change the password in production!")
        else:
            print("✓ Admin user already exists")
            
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()

def test_connection():
    """Test database connection"""
    try:
        db = SessionLocal()
        # Try to execute a simple query
        result = db.execute("SELECT 1").fetchone()
        db.close()
        print("✓ Database connection successful!")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

if __name__ == "__main__":
    print("🏥 MedConnect Database Setup")
    print("=" * 30)
    
    # Test connection first
    if test_connection():
        # Create tables
        create_tables()
        
        # Create admin user
        create_admin_user()
        
        print("\n✅ Database setup completed successfully!")
        print("\nNext steps:")
        print("1. Start your FastAPI backend: uvicorn app.main:app --reload")
        print("2. Start your React frontend: npm run start")
        print("3. Visit http://localhost:3000 to test your application")
    else:
        print("\n❌ Database setup failed!")
        print("\nTroubleshooting:")
        print("1. Make sure PostgreSQL is running")
        print("2. Check your DATABASE_URL in .env file")
        print("3. Verify database and user exist in PostgreSQL")