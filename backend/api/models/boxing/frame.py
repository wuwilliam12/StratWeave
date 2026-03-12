from pydantic import BaseModel
from typing import List, Optional
from api.models.boxing.enums import FootworkState

# ActionFrame/State for Boxing
class BoxingFrame(BaseModel):
    # What boxer state a move is executed from
    lead_hand: str | None
    rear_hand: str | None

    footwork_state: FootworkState | None = None
    head_posture: str | None
    torso_lean: float = 0

    guard_state: str | None
    stance: str = "orthodox"   # orthodox, southpaw
    stance_angle: float = 45.0 # degrees relative to opponent (how bladed/squared up stance is)
    weight_distribution: float = 0.55 # relative to front foot (how heavy on front foot)
    stance_width: float = 0 # how wide stance is (narrow to extremely wide)
    distance: Optional[str] = None

    # Potential stored in current stance
    load: float = 0 # how rotate hips are to left/right/how much weight store on left/right
    forward_momentum: float = 0 # how much forward momentum is