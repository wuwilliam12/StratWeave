"""
Boxing-specific bag model.
Wrapper around generic BagMetadata for consistency with boxing routes.
"""
from pydantic import ConfigDict

from ..common.bag import BagMetadata


class Bag(BagMetadata):
    """Boxing training bag metadata."""

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "personal-bag",
                "name": "My Personal Bag",
                "description": "Default personal training bag",
                "owner_id": 1,
                "is_public": False,
                "sport": "boxing",
                "created_at": "2026-03-28",
            }
        }
    )
