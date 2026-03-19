from pydantic import BaseModel
from typing import List, Optional

# Basic boxer model
class Boxer(BaseModel):
    # Descriptors
    id: str | None = None

    # Physical stats
    speed: int = 0
    power: int = 0
    reach: int = 0
    height: int = 0
    weight: int = 0
    reaction_time: int = 0

    # General Details/Preferences
    style: str | None # Othrodox, Southpaw, Switch
    archetype: str | None # Swammer, slugger, out-boxer, boxer-puncher, etc.
    regional_style: str | None # Soviet, Cuban, American, Mexican, etc.