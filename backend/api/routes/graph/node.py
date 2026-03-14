from fastapi import APIRouter
from typing import List
from uuid import uuid4

from .models import Node

router = APIRouter(prefix="/nodes", tags=["nodes"])
nodes_db: List[Node] = []

@router.post("/")
def create_node(node: Node):
    node.id = str(uuid4())
    nodes_db.append(node)
    return node

@router.get("/")
def get_nodes():
    return nodes_db