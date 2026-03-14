from fastapi import APIRouter
from typing import List
from uuid import uuid4

from .models import Edge

router = APIRouter(prefix="/edges", tags=["edges"])
edges_db: List[Edge] = []
@router.post("/",
    response_model=Edge,
    summary="Create a new edge in the graph",
)
def create_edge(edge: Edge):
    """
    Create a new edge in the graph.
    """
    if edge.id is None:
        edge.id = str(uuid4())
    edges_db.append(edge)
    return edge


@router.delete("/",
    response_model=dict,
    summary="Clear all edges in the graph",
)
def clear_edges():
    """
    Clear all edges in the graph.
    """
    edges_db.clear()
    return {"ok": True}