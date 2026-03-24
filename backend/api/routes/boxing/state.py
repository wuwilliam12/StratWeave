from fastapi import APIRouter
from typing import List
from uuid import uuid4

from ...models.boxing.state import BoxingState

router = APIRouter(prefix="/states", tags=["states"])
states_db: List[BoxingState] = []

@router.post("/",
    response_model=BoxingState,
    summary="Create a new state",
)
def create_state(state: BoxingState):
    """
    Create a new state.
    """
    state.id = str(uuid4())
    states_db.append(state)
    return state

@router.get("/",
    response_model=List[BoxingState],
    summary="Get all states",
)
def get_states():
    """
    Get all states.
    """
    return states_db