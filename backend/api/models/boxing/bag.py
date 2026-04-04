from typing import Optional
from ..common.bag import TrainingItem


# Boxing-specific convenience alias
# Maps boxing terminology to generic TrainingItem
class BoxingBagItem(TrainingItem):
    """
    Boxing-specific training item (technique, combination, footwork, etc).
    Inherits from generic TrainingItem and provides boxing-specific defaults.
    
    In a boxing context:
    - item_type: "technique", "combination", "footwork", etc.
    - entity_id maps to action_id (e.g., "seed-jab")
    - group categorizes by training focus (e.g., "Weekly Focus", "Fight Camp")
    """
    
    # Boxing convenience: support "action_id" as alias for "entity_id"
    @property
    def action_id(self) -> Optional[str]:
        return self.entity_id
    
    @action_id.setter
    def action_id(self, value: Optional[str]):
        self.entity_id = value
    
    class Config:
        # Allow schema to recognize action_id for backward compatibility
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "id": "bag-1",
                "name": "Double Jab to Cross",
                "action_id": "seed-jab",
                "bag_id": "personal-bag",
                "group": "Weekly Focus",
                "source": "CoachSession",
                "mastery": "intermediate",
                "learned_at": "2026-03-27"
            }
        }
