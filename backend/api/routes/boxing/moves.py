from fastapi import APIRouter
from typing import List
from api.models.boxing.action import BoxerAction

router = APIRouter()
moves_db: List[BoxerAction] = []

@router.get("/")
def get_moves():
    return moves_db