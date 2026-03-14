from fastapi import APIRouter
from typing import List

from .models import BoxerAction

router = APIRouter(prefix="/actions", tags=["actions"])
actions_db: List[BoxerAction] = []

@router.post("/",
    response_model=BoxerAction,
    summary="Create a new action",
)
def create_action(action: BoxerAction):
    """
    Create a new action.
    """
    action.id = str(uuid4())
    actions_db.append(action)
    return action

@router.get("/",
    response_model=List[BoxerAction],
    summary="Get all actions",
)
def get_actions():
    """
    Get all actions.
    """
    return actions_db