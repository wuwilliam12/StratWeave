"""
Generic bag system models - sport-agnostic.

A "Training Bag" (or "Toolkit") is a collection of items that a user has learned,
categorized and tracked for mastery. This structure works for any sport:
- Boxing: techniques, combinations, footwork
- Basketball: plays, shooting techniques, defensive strategies
- Soccer: formations, passing patterns, set pieces
- etc.

The models here are generic enough to support any sport's learning items.
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BagMetadata(BaseModel):
    """Common metadata for bags across all sports."""
    id: Optional[str] = None
    name: str
    description: Optional[str] = None
    owner_id: str
    is_public: bool = False
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    sport: Optional[str] = None  # e.g., "boxing", "basketball" - informational


class TrainingItem(BaseModel):
    """
    Generic training item for any sport.
    Represents a learned technique, play, move, strategy, etc.
    """
    id: Optional[str] = None
    name: str
    description: Optional[str] = None
    
    # Sport-specific reference (action_id for boxing, play_id for basketball, etc.)
    item_type: Optional[str] = None  # e.g., "technique", "play", "strategy"
    entity_id: Optional[str] = None   # Sport-specific: action_id, play_id, etc.
    
    bag_id: Optional[str] = None  # ID of the bag this item belongs to
    group: Optional[str] = None   # Categorization (e.g., "Weekly Focus", "Movement")
    source: Optional[str] = None  # Where learned (e.g., "coach session", "film study")
    reference_url: Optional[str] = None  # Tutorial or reference link
    
    # Tracking progression
    mastery: Optional[str] = "novice"  # novice, intermediate, advanced
    learned_at: Optional[str] = None   # ISO date string
    last_practiced: Optional[str] = None  # ISO date string
    
    # Custom fields for extensibility
    tags: Optional[list[str]] = []  # e.g., ["counter", "footwork", "defense"]
    notes: Optional[dict] = {}  # Sport-specific extra data


class TrainingBag(BagMetadata):
    """
    Complete training bag with metadata and items.
    Combines BagMetadata with optional list of items.
    """
    items: Optional[list[TrainingItem]] = []
