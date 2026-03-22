from fastapi import APIRouter

from .boxing import router as boxing_router
from .style import router as style_router


blueprints_router = APIRouter(prefix="/blueprints", tags=["blueprints"])

blueprints_router.include_router(boxing_router)
blueprints_router.include_router(style_router)
