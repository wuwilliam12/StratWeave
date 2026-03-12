from pydantic import BaseModel

class BoxingEdge(BaseModel):
    id: str | None = None
    source_frame_id: str
    target_frame_id: str

    move_id: str

    probability: float = 1.0
    stamina_cost: float = 0