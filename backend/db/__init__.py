"""
Database configuration: engine, session, and dependency.
Uses SQLite by default; set DATABASE_URL for PostgreSQL (e.g. postgresql://user:pass@localhost/stratweave).
"""
import os
from contextlib import contextmanager
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session, DeclarativeBase

from .models import Base, NodeModel, EdgeModel, User

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
    _migrate_add_node_columns()


def _migrate_add_node_columns():
    """Add newly introduced node/edge columns if they don't exist yet."""
    from sqlalchemy import text

    try:
        with engine.connect() as conn:
            if conn.dialect.name == "sqlite":
                r = conn.execute(text("PRAGMA table_info(nodes)"))
                node_cols = [row[1] for row in r.fetchall()]
                if node_cols:
                    if "sport" not in node_cols:
                        conn.execute(text("ALTER TABLE nodes ADD COLUMN sport VARCHAR(32)"))
                    if "parent_id" not in node_cols:
                        conn.execute(text("ALTER TABLE nodes ADD COLUMN parent_id VARCHAR(36)"))
                    if "graph_id" not in node_cols:
                        conn.execute(text("ALTER TABLE nodes ADD COLUMN graph_id VARCHAR(36)"))

                r = conn.execute(text("PRAGMA table_info(edges)"))
                edge_cols = [row[1] for row in r.fetchall()]
                if edge_cols and "graph_id" not in edge_cols:
                    conn.execute(text("ALTER TABLE edges ADD COLUMN graph_id VARCHAR(36)"))

                conn.commit()
    except Exception:
        pass  # Table may not exist yet or migration already applied


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
