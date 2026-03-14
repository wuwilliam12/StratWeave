from pydantic import BaseModel

class Edge(BaseModel):
    id: str | None = None
    source_state_id: str | None = None
    target_state_id: str | None = None

    move_id: str

    probability: float = 1.0
    stamina_cost: float = 0