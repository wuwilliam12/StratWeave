from fastapi import APIRouter

from .node import router as node_router
from .edge import router as edge_router

graph_router = APIRouter(prefix="/graph", tags=["graph"])

graph_router.include_router(node_router)
graph_router.include_router(edge_router)