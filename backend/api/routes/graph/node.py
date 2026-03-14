from fastapi import APIRouter
from typing import List
from uuid import uuid4

from .models import Node

router = APIRouter(prefix="/nodes", tags=["nodes"])
nodes_db: List[Node] = []

@router.get("/",
    response_model=List[Node],
    summary="Get all nodes in the graph",
)
def get_nodes():
    """
    Get all nodes in the graph.
    """
    return nodes_db


@router.post("/",
    response_model=Node,
    summary="Create a new node in the graph",
)
def create_node(node: Node):
    """
    Create a new node in the graph.
    """
    if node.id is None:
        node.id = str(uuid4())
    nodes_db.append(node)
    return node


@router.delete("/",
    response_model=dict,
    summary="Clear all nodes in the graph",
)
def clear_nodes():
    """
    Clear all nodes in the graph.
    """
    nodes_db.clear()
    return {"ok": True}