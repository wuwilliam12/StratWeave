"""
Boxing-specific resolver: resolves action_id and boxer_id to BoxerAction and Boxer.
Uses in-memory stores from boxing routes (shared process).
"""
from api.models.sports import Sport
from api.models.sports.registry import SportResolver, register_resolver
from api.routes.boxing.action import actions_db
from api.routes.boxing.boxer import boxers_db


class BoxingResolver(SportResolver):
    def resolve_action(self, action_id: str) -> dict | None:
        for a in actions_db:
            if getattr(a, "id", None) == action_id:
                return a.model_dump()
        return None

    def resolve_athlete(self, athlete_id: str) -> dict | None:
        for b in boxers_db:
            if getattr(b, "id", None) == athlete_id:
                return b.model_dump()
        return None


# Register on import
register_resolver(Sport.BOXING, BoxingResolver())
