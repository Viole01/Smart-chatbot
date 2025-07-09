# backend/setup_database.py
"""
Run this script to set up the complete database for the appointment system
"""

def main():
    print("🚀 Setting up MedConnect Database...")
    
    try:
        # Import and run database initialization
        from app.db.init_db import create_tables, add_missing_columns, init_db
        from app.db.session import SessionLocal
        
        print("📋 Step 1: Creating database tables...")
        create_tables()
        
        print("📋 Step 2: Adding missing columns...")
        add_missing_columns()
        
        print("📋 Step 3: Adding sample data...")
        db = SessionLocal()
        try:
            init_db(db)
        finally:
            db.close()
        
        print("✅ Database setup completed successfully!")
        print("\n📝 Sample accounts created:")
        print("  Admin: admin@medconnect.com / admin123")
        print("  Patient: patient@medconnect.com / patient123")
        print("  Doctor: dr.sarah@medconnect.com / doctor123")
        print("  Doctor: dr.michael@medconnect.com / doctor123")
        print("  Doctor: dr.emily@medconnect.com / doctor123")
        print("  Doctor: dr.james@medconnect.com / doctor123")
        print("  Doctor: dr.lisa@medconnect.com / doctor123")
        print("\n🎉 Your appointment booking system is ready!")
        
    except Exception as e:
        print(f"❌ Error setting up database: {e}")
        print("\n💡 Make sure your database server is running and connection details are correct.")

if __name__ == "__main__":
    main()