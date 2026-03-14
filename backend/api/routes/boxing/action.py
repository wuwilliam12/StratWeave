from fastapi import APIRouter
from typing import List

from .models import BoxerAction

router = APIRouter(prefix="/actions", tags=["actions"])
moves_db: List[BoxerAction] = []

@router.get("/")
def get_moves():
    return moves_db