from pydantic import BaseModel


class Node(BaseModel):
    id: str | None = None
    strategy_id: str | None = None
    label: str

    sport: str | None = None  # Sport context
    action_id: str | None = None
    # TODO: change to general actor/athlete
    boxer_id: str | None = None

    position_x: float = 0
    position_y: float = 0

    node_type: str