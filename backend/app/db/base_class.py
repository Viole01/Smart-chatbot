# backend/app/db/base_class.py
# This file exists for compatibility - imports Base from session.py

from app.db.session import Base

# Re-export Base so other files can import from here if needed
__all__ = ["Base"]