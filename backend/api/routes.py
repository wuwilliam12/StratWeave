from fastapi import APIRouter
from models import Move
from typing import List

router = APIRouter()

# In-memory "database"
moves_db: List[Move] = []

@router.post("/moves")
def create_move(move: Move):
    moves_db.append(move)
    return move

@router.get("/moves")
def get_moves():
    return moves_db