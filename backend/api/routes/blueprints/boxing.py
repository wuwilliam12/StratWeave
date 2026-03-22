from fastapi import APIRouter, HTTPException

from api.models.blueprints import BoxingBlueprint

from .boxing_catalog import BOXING_BLUEPRINT_LIBRARY


router = APIRouter(prefix="/boxing", tags=["blueprints"])


@router.get("/", response_model=list[BoxingBlueprint], summary="List boxing blueprints")
def list_boxing_blueprints():
    """Return starter boxing blueprints organized by fighting style."""
    return BOXING_BLUEPRINT_LIBRARY


@router.get(
    "/{blueprint_slug}",
    response_model=BoxingBlueprint,
    summary="Get a single boxing blueprint",
)
def get_boxing_blueprint(blueprint_slug: str):
    """Return one boxing blueprint by slug."""
    for blueprint in BOXING_BLUEPRINT_LIBRARY:
        if blueprint.slug == blueprint_slug:
            return blueprint
    raise HTTPException(status_code=404, detail="Boxing blueprint not found")
