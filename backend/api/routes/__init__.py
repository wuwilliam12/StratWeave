from fastapi import APIRouter

from .auth import router as auth_router
from .blueprints import blueprints_router
from .boxing import boxing_router
from .graph import graph_router
from .tape import router as tape_router
from .headgear import router as headgear_router
from .ai_statweaver import router as ai_statweaver_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(blueprints_router)
api_router.include_router(boxing_router)
api_router.include_router(graph_router)
api_router.include_router(tape_router, prefix="/tape")
api_router.include_router(headgear_router, prefix="/headgear")
api_router.include_router(ai_statweaver_router, prefix="/ai")
