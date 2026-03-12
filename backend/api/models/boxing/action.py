from pydantic import BaseModel

# Moves/Actions Boxer Can Do
class BoxerAction(BaseModel):
    name: str

    lead_hand: str | None = None
    rear_hand: str | None = None
    footwork: str | None = None
    head_movement: str | None = None

    stamina_cost: float = 0
    base_time: float = 0.2