"""Tape: film-study links, tags, and notes."""

from __future__ import annotations

from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from api.routes.auth import get_current_user
from db import get_db
from db.models import TapeEntryModel, User

router = APIRouter(tags=["tape"])


class TapeCreate(BaseModel):
    title: str = Field(min_length=1, max_length=300)
    url: str = Field(min_length=1)
    sport: str | None = None
    tags: list[str] | None = None
    notes: str | None = None


class TapeUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=300)
    url: str | None = Field(None, min_length=1)
    sport: str | None = None
    tags: list[str] | None = None
    notes: str | None = None


class TapeOut(BaseModel):
    id: str
    owner_id: int
    title: str
    url: str
    sport: str | None = None
    tags: list[str] = []
    notes: str | None = None
    created_at: str | None = None
    updated_at: str | None = None


def _to_out(m: TapeEntryModel) -> TapeOut:
    return TapeOut(
        id=m.id,
        owner_id=m.owner_id,
        title=m.title,
        url=m.url,
        sport=m.sport,
        tags=m.tags if m.tags is not None else [],
        notes=m.notes,
        created_at=m.created_at.isoformat() if m.created_at else None,
        updated_at=m.updated_at.isoformat() if m.updated_at else None,
    )


@router.get("/", response_model=list[TapeOut], summary="List my tape entries")
def list_tape(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = (
        db.query(TapeEntryModel)
        .filter(TapeEntryModel.owner_id == current_user.id)
        .order_by(TapeEntryModel.updated_at.desc())
        .all()
    )
    return [_to_out(r) for r in rows]


@router.post("/", response_model=TapeOut, summary="Create tape entry")
def create_tape(
    payload: TapeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    tid = str(uuid4())
    m = TapeEntryModel(
        id=tid,
        owner_id=current_user.id,
        title=payload.title.strip(),
        url=payload.url.strip(),
        sport=payload.sport,
        tags=payload.tags,
        notes=payload.notes,
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    return _to_out(m)


@router.get("/{tape_id}", response_model=TapeOut, summary="Get tape entry")
def get_tape(
    tape_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    m = db.query(TapeEntryModel).filter(TapeEntryModel.id == tape_id).first()
    if not m or m.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    return _to_out(m)


@router.put("/{tape_id}", response_model=TapeOut, summary="Update tape entry")
def update_tape(
    tape_id: str,
    payload: TapeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    m = db.query(TapeEntryModel).filter(TapeEntryModel.id == tape_id).first()
    if not m or m.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    data = payload.model_dump(exclude_unset=True)
    if "title" in data and data["title"] is not None:
        m.title = data["title"].strip()
    if "url" in data and data["url"] is not None:
        m.url = data["url"].strip()
    for field in ("sport", "tags", "notes"):
        if field in data:
            setattr(m, field, data[field])
    db.commit()
    db.refresh(m)
    return _to_out(m)


@router.delete("/{tape_id}", summary="Delete tape entry")
def delete_tape(
    tape_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    m = db.query(TapeEntryModel).filter(TapeEntryModel.id == tape_id).first()
    if not m or m.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    db.delete(m)
    db.commit()
    return {"ok": True}
