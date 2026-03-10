from pydantic import BaseModel
from typing import List, Optional

# General Move/Action Model
class Move(BaseModel):
    id: int
    name: str
    aliases: List[str] = []
    description: Optional[str] = None
    counters: List[int] = []
    sport: str
    category: Optional[str] = None
    meta: Dict[str, Any] = {}

# Sport Specific Moves (basic extra metadata)
# Boxing Related Models
class LeadHandAction():
    type: Optional[str] = None

class RearHandAction():
    type: Optional[str] = None

class Footwork():
    type: Optional[str] = None

class BoxingMove(Move):
    punch_type: Optional[str] = None
    stance_required: Optional[str] = None
