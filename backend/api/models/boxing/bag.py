from typing import Any, Optional

from pydantic import ConfigDict, model_validator

from ..common.bag import TrainingItem


class BoxingBagItem(TrainingItem):
    """
    Boxing-specific training item (technique, combination, footwork, etc).
    Request bodies may use `action_id`; it is normalized to `entity_id`.
    """

    model_config = ConfigDict(populate_by_name=True)

    @model_validator(mode="before")
    @classmethod
    def normalize_action_id(cls, data: Any) -> Any:
        if isinstance(data, dict):
            aid = data.get("action_id")
            if aid and not data.get("entity_id"):
                return {**data, "entity_id": aid}
        return data

    @property
    def action_id(self) -> Optional[str]:
        return self.entity_id
