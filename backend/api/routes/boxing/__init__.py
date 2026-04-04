from fastapi import APIRouter

from .action import router as action_router
from .bag import router as bag_router
from .boxer import router as boxer_router
from .state import router as state_router

boxing_router = APIRouter(prefix="/boxing", tags=["boxing"])

boxing_router.include_router(action_router)
boxing_router.include_router(bag_router)
boxing_router.include_router(boxer_router)
boxing_router.include_router(state_router)