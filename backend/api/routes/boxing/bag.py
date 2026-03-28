from fastapi import APIRouter, HTTPException
from typing import List
from uuid import uuid4
from datetime import datetime

from ...models.boxing.bag import BoxingBagItem
from ...models.boxing.bag_model import Bag

router = APIRouter(prefix="/bag", tags=["bag"])

# In-memory databases (replace with real DB later)
bags_db: List[Bag] = [
    Bag(
        id="personal-bag",
        name="My Personal Bag",
        description="Default personal training bag",
        owner_id="user-1",  # Assuming a default user
        is_public=False,
        created_at="2026-03-28",
    ),
    Bag(
        id="ali-study",
        name="Muhammad Ali Film Study",
        description="Techniques and strategies from Muhammad Ali's fights",
        owner_id="user-2",
        is_public=True,
        created_at="2026-03-27",
    ),
]

bag_items_db: List[BoxingBagItem] = [
    BoxingBagItem(
        id="bag-1",
        name="Double Jab to Cross",
        description="Fundamental working combination drilled this week.",
        action_id="seed-jab",
        bag_id="personal-bag",
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
        bag_id="personal-bag",
        group="Fight Camp",
        source="GamePlan",
        reference_url="https://www.youtube.com/watch?v=example",
        mastery="novice",
        learned_at="2026-03-25",
    ),
    BoxingBagItem(
        id="bag-3",
        name="Ali's Footwork",
        description="The legendary footwork that made Ali untouchable",
        bag_id="ali-study",
        group="Movement",
        source="Film Study",
        reference_url="https://www.youtube.com/watch?v=ali-footwork",
        mastery="advanced",
        learned_at="2026-03-26",
    ),
]

@router.get("/bags/", response_model=List[Bag], summary="Get all public bags")
def get_public_bags():
    return [bag for bag in bags_db if bag.is_public]

@router.get("/bags/{bag_id}", response_model=Bag, summary="Get a specific bag")
def get_bag(bag_id: str):
    bag = next((b for b in bags_db if b.id == bag_id), None)
    if not bag:
        raise HTTPException(status_code=404, detail="Bag not found")
    return bag

@router.post("/bags/", response_model=Bag, summary="Create a new bag")
def create_bag(bag: Bag):
    if not bag.id:
        bag.id = str(uuid4())
    if not bag.created_at:
        bag.created_at = datetime.now().isoformat()
    bags_db.append(bag)
    return bag

@router.get("/bags/{bag_id}/items/", response_model=List[BoxingBagItem], summary="Get items in a bag")
def get_bag_items(bag_id: str):
    return [item for item in bag_items_db if item.bag_id == bag_id]

@router.post("/bags/{bag_id}/items/", response_model=BoxingBagItem, summary="Add an item to a bag")
def create_bag_item(bag_id: str, item: BoxingBagItem):
    # Check if bag exists
    bag = next((b for b in bags_db if b.id == bag_id), None)
    if not bag:
        raise HTTPException(status_code=404, detail="Bag not found")
    
    if not item.id:
        item.id = str(uuid4())
    item.bag_id = bag_id
    bag_items_db.append(item)
    return item

# Legacy endpoints for backward compatibility (personal bag)
@router.get("/", response_model=List[BoxingBagItem], summary="Get personal bag items (legacy)")
def get_personal_bag_items():
    return get_bag_items("personal-bag")

@router.post("/", response_model=BoxingBagItem, summary="Add item to personal bag (legacy)")
def create_personal_bag_item(item: BoxingBagItem):
    return create_bag_item("personal-bag", item)
