from fastapi import APIRouter
from typing import List
from uuid import uuid4

from ...models.boxing.action import BoxerAction

router = APIRouter(prefix="/actions", tags=["actions"])

# Seeded/default actions
actions_db: List[BoxerAction] = [
    BoxerAction(id="seed-jab", name="Jab", lead_hand="left"),
    BoxerAction(id="seed-cross", name="Cross", rear_hand="right"),
    BoxerAction(id="seed-hook", name="Left hook", lead_hand="left"),
]

@router.post("/",
    response_model=BoxerAction,
    summary="Create a new action",
)
def create_action(action: BoxerAction):
    """
    Create a new action.
    """
    if not action.id:
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