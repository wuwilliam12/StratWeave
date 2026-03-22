from pydantic import BaseModel


class BoxingBlueprintScenario(BaseModel):
    id: str
    title: str
    summary: str


class BoxingBlueprint(BaseModel):
    id: str
    slug: str
    name: str
    style: str
    summary: str
    description: str
    scenarios: list[BoxingBlueprintScenario]
