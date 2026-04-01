"""
Boxing-specific bag routes.
Uses the generic bag router factory to provide bag management for boxing training items.
"""
from typing import List

from ...models.boxing.bag import BoxingBagItem
from ...models.boxing.bag_model import Bag
from ...routes.bags import create_bag_router

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
        entity_id="seed-jab",  # Maps to action_id
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

# Create boxing-specific router using the generic factory
router = create_bag_router(
    sport="boxing",
    bag_model=Bag,
    item_model=BoxingBagItem,
    bags_db=bags_db,
    items_db=bag_items_db,
)

# Legacy endpoints for backward compatibility (personal bag)
# These are kept to avoid breaking existing code during transition
@router.get("/", response_model=List[BoxingBagItem], summary="Get personal bag items (legacy)")
def get_personal_bag_items():
    """Legacy endpoint: get items from the default personal-bag."""
    return [item for item in bag_items_db if item.bag_id == "personal-bag"]

@router.post("/", response_model=BoxingBagItem, summary="Add item to personal bag (legacy)")
def create_personal_bag_item(item: BoxingBagItem):
    """Legacy endpoint: add item to the default personal-bag."""
    from uuid import uuid4
    if not item.id:
        item.id = str(uuid4())
    item.bag_id = "personal-bag"
    bag_items_db.append(item)
    return item

