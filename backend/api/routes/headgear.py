"""Headgear: training session notes and daily focus."""

from __future__ import annotations

from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from api.routes.auth import get_current_user
from db import get_db
from db.models import TrainingSessionModel, User

router = APIRouter(tags=["headgear"])


class SessionCreate(BaseModel):
    session_date: str = Field(min_length=8, max_length=32, description="ISO date YYYY-MM-DD")
    focus: str = Field(min_length=1)
    sport: str | None = None
    graph_id: str | None = None


class SessionOut(BaseModel):
    id: str
    owner_id: int
    session_date: str
    focus: str
    sport: str | None = None
    graph_id: str | None = None
    created_at: str | None = None


def _to_out(m: TrainingSessionModel) -> SessionOut:
    return SessionOut(
        id=m.id,
        owner_id=m.owner_id,
        session_date=m.session_date,
        focus=m.focus,
        sport=m.sport,
        graph_id=m.graph_id,
        created_at=m.created_at.isoformat() if m.created_at else None,
    )


@router.get("/sessions", response_model=list[SessionOut], summary="List my sessions")
def list_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = (
        db.query(TrainingSessionModel)
        .filter(TrainingSessionModel.owner_id == current_user.id)
        .order_by(TrainingSessionModel.session_date.desc(), TrainingSessionModel.created_at.desc())
        .all()
    )
    return [_to_out(r) for r in rows]


@router.post("/sessions", response_model=SessionOut, summary="Log a session / focus")
def create_session(
    payload: SessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sid = str(uuid4())
    m = TrainingSessionModel(
        id=sid,
        owner_id=current_user.id,
        session_date=payload.session_date.strip()[:32],
        focus=payload.focus.strip(),
        sport=payload.sport,
        graph_id=payload.graph_id,
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    return _to_out(m)


@router.delete("/sessions/{session_id}", summary="Delete a session note")
def delete_session(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    m = db.query(TrainingSessionModel).filter(TrainingSessionModel.id == session_id).first()
    if not m or m.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    db.delete(m)
    db.commit()
    return {"ok": True}
