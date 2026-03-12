from fastapi import APIRouter
from typing import List
from api.models.boxing.frame import BoxingFrame
from uuid import uuid4

router = APIRouter()
frames_db: List[BoxingFrame] = []

@router.post("/")
def create_frame(frame: BoxingFrame):
    frame.id = str(uuid4())
    frames_db.append(frame)
    return frame

@router.get("/")
def get_frames():
    return frames_db