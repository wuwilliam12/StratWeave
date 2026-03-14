from fastapi import APIRouter
from typing import List
from uuid import uuid4

from .models import Boxer

router = APIRouter(prefix="/boxers", tags=["boxers"])
boxers_db: List[Boxer] = []

@router.post("/")
def create_frame(boxer: Boxer):
    boxer.id = str(uuid4())
    boxers_db.append(boxer)
    return boxer

@router.get("/")
def get_boxers():
    return boxers_db