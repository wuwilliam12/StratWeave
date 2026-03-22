from fastapi import APIRouter, HTTPException

from api.models.blueprints import BlueprintStyle

from .catalog import BLUEPRINT_STYLE_LIBRARY


router = APIRouter(prefix="/styles", tags=["blueprints"])


@router.get("/", response_model=list[BlueprintStyle], summary="List blueprint styles")
def list_blueprint_styles():
    """Return scaffolded blueprint style presets for frontend builders."""
    return BLUEPRINT_STYLE_LIBRARY


@router.get(
    "/{style_slug}",
    response_model=BlueprintStyle,
    summary="Get a single blueprint style",
)
def get_blueprint_style(style_slug: str):
    """Return one style preset by slug."""
    for style in BLUEPRINT_STYLE_LIBRARY:
        if style.slug == style_slug:
            return style
    raise HTTPException(status_code=404, detail="Blueprint style not found")
