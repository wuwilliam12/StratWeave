from pydantic import BaseModel


class BlueprintStyleToken(BaseModel):
    name: str
    value: str
    usage: str


class BlueprintStyle(BaseModel):
    id: str
    slug: str
    name: str
    summary: str
    description: str
    intended_for: list[str]
    recommended_node_types: list[str]
    tokens: list[BlueprintStyleToken]
    notes: list[str]
