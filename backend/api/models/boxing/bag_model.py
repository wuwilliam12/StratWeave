"""
Boxing-specific bag model.
Wrapper around generic BagMetadata for consistency with boxing routes.
"""
from ..common.bag import BagMetadata


# Boxing bags are just generic bags with sport="boxing"
class Bag(BagMetadata):
    """
    Boxing training bag metadata.
    Extends generic BagMetadata with boxing context.
    """
    
    class Config:
        json_schema_extra = {
            "example": {
                "id": "personal-bag",
                "name": "My Personal Bag",
                "description": "Default personal training bag",
                "owner_id": "user-1",
                "is_public": False,
                "sport": "boxing",
                "created_at": "2026-03-28"
            }
        }
