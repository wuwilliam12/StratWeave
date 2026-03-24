from fastapi import APIRouter
from typing import List
from uuid import uuid4

from ...models.boxing.boxer import Boxer

router = APIRouter(prefix="/boxers", tags=["boxers"])
boxers_db: List[Boxer] = []

@router.post("/",
    response_model=Boxer,
    summary="Create a new boxer",
)
def create_boxer(boxer: Boxer):
    """
    Create a new boxer.
    """
    if not boxer.id:
        boxer.id = str(uuid4())
    boxers_db.append(boxer)
    return boxer

@router.get("/",
    response_model=List[Boxer],
    summary="Get all boxers",
)
def get_boxers():
    """
    Get all boxers.
    """
    return boxers_db