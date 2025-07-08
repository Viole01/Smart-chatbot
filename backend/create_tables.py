# backend/create_tables.py
"""
Simplified database table creation script
"""
import sys
import os

# Add the backend directory to Python path so we can import our app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine, Base
from sqlalchemy import text

def create_tables():
    """
    Create all database tables
    
    This function:
    1. Imports all our model classes (User, etc.)
    2. Uses SQLAlchemy to create the actual tables in PostgreSQL
    3. Creates tables like: users, patients, doctors, etc.
    """
    print("📋 Creating database tables...")
    
    # Import all models to ensure they are registered with SQLAlchemy
    from app.models import user  # This registers the User model
    
    # Create all tables defined in our models
    # Base.metadata contains information about all our table definitions
    # create_all() creates the actual tables in the database
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")

def test_connection():
    """
    Test if we can connect to the database
    
    This function:
    1. Tries to connect to PostgreSQL
    2. Runs a simple test query
    3. Returns True if successful, False if failed
    """
    try:
        db = SessionLocal()
        # Try to execute a simple query (SELECT 1 just returns the number 1)
        result = db.execute(text("SELECT 1")).fetchone()
        db.close()
        print("✅ Database connection successful!")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

if __name__ == "__main__":
    """
    Main execution flow:
    1. Test database connection
    2. Create tables if connection works
    """
    print("🏥 Smart Chatbot Database Setup")
    print("=" * 30)
    
    # Test connection first
    if test_connection():
        # Create tables
        create_tables()
        
        print("\n✅ Database setup completed successfully!")
        print("\nWhat was created:")
        print("1. Database tables in your PostgreSQL database")
        print("2. Ready to use with existing users")
        
        print("\nNext steps:")
        print("1. Start your FastAPI backend: uvicorn app.main:app --reload")
        print("2. Start your React frontend: npm start")
        print("3. Visit http://localhost:3000 to test your application")
    else:
        print("\n❌ Database setup failed!")
        print("\nTroubleshooting:")
        print("1. Make sure PostgreSQL is running")
        print("2. Check your DATABASE_URL in .env file")
        print("3. Verify database and user exist in PostgreSQL")