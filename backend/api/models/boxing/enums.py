from enum import Enum

# Enum for defualt footwork state
class FootworkState(str, Enum):
    PLANTED = "planted"
    ON_TOES = "on_toes"
    BOUNCING = "bouncing"