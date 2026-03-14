from fastapi import APIRouter
from typing import List
from uuid import uuid4

from .models import BoxingState

router = APIRouter(prefix="/states", tags=["states"])
states_db: List[BoxingState] = []

@router.post("/")
def create_frame(state: BoxingState):
    state.id = str(uuid4())
    states_db.append(state)
    return state

@router.get("/")
def get_states():
    return states_db