"""
Database configuration: engine, session, and dependency.
Uses SQLite by default; set DATABASE_URL for PostgreSQL (e.g. postgresql://user:pass@localhost/stratweave).
"""
import os
from contextlib import contextmanager
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session, DeclarativeBase

from .models import Base, NodeModel, EdgeModel

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./stratweave.db",
)
# SQLite needs connect_args for same-thread writes when used with FastAPI
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=os.getenv("SQL_ECHO", "").lower() in ("1", "true"),
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def create_tables():
    """Create all tables. Call on app startup."""
    Base.metadata.create_all(bind=engine)


def get_db():
    """FastAPI dependency: yield a DB session and close it after the request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@contextmanager
def session_scope():
    """Optional programmatic context manager for scripts or non-request usage."""
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
