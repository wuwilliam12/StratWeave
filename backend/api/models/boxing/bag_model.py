from pydantic import BaseModel
from typing import Optional

class Bag(BaseModel):
    id: Optional[str] = None
    name: str
    description: Optional[str] = None
    owner_id: str
    is_public: bool = False
    created_at: Optional[str] = None
