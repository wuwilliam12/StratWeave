from pydantic import BaseModel

class Edge(BaseModel):
    id: str | None = None
    source: str  # source node id
    target: str  # target node id
    label: str = ""  # e.g. "counters", "leads to"
    probability: float = 1.0
    stamina_cost: float = 0