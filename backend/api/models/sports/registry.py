"""
Registry for sport-specific resolvers. Used by graph API to enrich nodes
with resolved action/athlete data.
"""
from typing import Any, Callable, Protocol

from . import Sport


class SportResolver(Protocol):
    """Resolves node entity IDs to full model data for a given sport."""

    def resolve_action(self, action_id: str) -> dict[str, Any] | None:
        """Resolve action_id to action data (e.g. BoxerAction)."""
        ...

    def resolve_athlete(self, athlete_id: str) -> dict[str, Any] | None:
        """Resolve athlete_id (e.g. boxer_id) to athlete data."""
        ...


_resolvers: dict[Sport, SportResolver] = {}


def register_resolver(sport: Sport, resolver: SportResolver) -> None:
    """Register a resolver for a sport."""
    _resolvers[sport] = resolver


def get_resolver(sport: Sport) -> SportResolver | None:
    """Get the resolver for a sport, if registered."""
    return _resolvers.get(sport)
