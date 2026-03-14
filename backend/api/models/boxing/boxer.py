from pydantic import BaseModel
from typing import List, Optional

# Basic boxer model
class Boxer(BaseModel):
    # Physical stats
    speed: int = 0
    power: int = 0
    reach: int = 0
    height: int = 0
    reaction_time: int = 0

    style: str | None