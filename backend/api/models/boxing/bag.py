from pydantic import BaseModel
from typing import Optional

# Bag item represents a learned tool/spare weapon in the user training bag
class BoxingBagItem(BaseModel):
    id: str | None = None
    name: str
    description: Optional[str] = None
    action_id: Optional[str] = None
    bag_id: str  # ID of the bag this item belongs to
    group: Optional[str] = None
    source: Optional[str] = None  # e.g. "training camp", "coach session"
    reference_url: Optional[str] = None  # e.g. YouTube tutorial link for the move
    mastery: Optional[str] = "novice"  # e.g. novice/intermediate/master
    learned_at: Optional[str] = None  # ISO date string
