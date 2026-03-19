"""
Sports infrastructure: registry and base types for multi-sport support.
Add new sports by registering them here and implementing the required models/routes.
"""
from enum import Enum


class Sport(str, Enum):
    """Supported sports. Extend when adding new sports."""
    BOXING = "boxing"
    # BASKETBALL = "basketball"
    # SOCCER = "soccer"


# Sport-specific entity IDs used by nodes:
# - boxing: action_id -> BoxerAction, boxer_id -> Boxer
# - basketball: action_id -> Play, player_id -> Player (future)
# - etc.
SPORT_ENTITY_KEYS = {
    Sport.BOXING: ("action_id", "boxer_id"),
    # Sport.BASKETBALL: ("play_id", "player_id"),
}
