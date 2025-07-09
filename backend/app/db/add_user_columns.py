# backend/app/db/add_user_columns.py
from sqlalchemy import text
from app.db.session import engine

def add_missing_user_columns():
    """
    Add missing columns to the users table
    """
    with engine.connect() as conn:
        try:
            # Check if columns exist and add them if they don't
            
            # Add years_experience column
            try:
                conn.execute(text("ALTER TABLE users ADD COLUMN years_experience INTEGER"))
                print("✅ Added years_experience column")
            except Exception as e:
                if "already exists" in str(e):
                    print("✅ years_experience column already exists")
                else:
                    print(f"❌ Error adding years_experience: {e}")
            
            # Add rating column
            try:
                conn.execute(text("ALTER TABLE users ADD COLUMN rating REAL"))
                print("✅ Added rating column")
            except Exception as e:
                if "already exists" in str(e):
                    print("✅ rating column already exists")
                else:
                    print(f"❌ Error adding rating: {e}")
            
            # Commit the changes
            conn.commit()
            print("✅ Database schema updated successfully!")
            
        except Exception as e:
            print(f"❌ Error updating database schema: {e}")
            conn.rollback()

if __name__ == "__main__":
    add_missing_user_columns()