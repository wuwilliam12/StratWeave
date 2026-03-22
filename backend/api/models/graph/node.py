from pydantic import BaseModel


class Node(BaseModel):
    # Categorization
    id: str | None = None
    strategy_id: str | None = None
    parent_id: str | None = None
    label: str

    # Sport context
    sport: str | None = None

    # Resolved later
    action_id: str | None = None
    athlete_id: str | None = None

    position_x: float = 0
    position_y: float = 0

    node_type: str
