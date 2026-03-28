from fastapi import APIRouter
from typing import List
from uuid import uuid4

from ...models.boxing.bag import BoxingBagItem

router = APIRouter(prefix="/bag", tags=["bag"])

bag_db: List[BoxingBagItem] = [
    BoxingBagItem(
        id="bag-1",
        name="Double Jab to Cross",
        description="Fundamental working combination drilled this week.",
        action_id="seed-jab",
        group="Weekly Focus",
        source="CoachSession",
        reference_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        mastery="intermediate",
        learned_at="2026-03-27",
    ),
    BoxingBagItem(
        id="bag-2",
        name="Counter Hook after Slip",
        description="Fight camp concept for counter gameplan.",
        group="Fight Camp",
        source="GamePlan",
        reference_url="https://www.youtube.com/watch?v=example",
        mastery="novice",
        learned_at="2026-03-25",
    ),
]

@router.post("/", response_model=BoxingBagItem, summary="Add a bag item")
def create_bag_item(item: BoxingBagItem):
    if not item.id:
        item.id = str(uuid4())
    bag_db.append(item)
    return item

@router.get("/", response_model=List[BoxingBagItem], summary="Get bag items")
def get_bag_items():
    return bag_db
