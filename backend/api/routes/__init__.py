from fastapi import APIRouter

from .blueprints import blueprints_router
from .boxing import boxing_router
from .graph import graph_router

api_router = APIRouter()

api_router.include_router(blueprints_router)
api_router.include_router(boxing_router)
api_router.include_router(graph_router)
