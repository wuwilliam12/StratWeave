from fastapi import APIRouter
from typing import List
from api.models.boxing.edge import BoxingEdge
from uuid import uuid4

router = APIRouter()
edges_db: List[BoxingEdge] = []

@router.post("/")
def create_edge(edge: BoxingEdge):
    edge.id = str(uuid4())
    edges_db.append(edge)
    return edge

@router.get("/")
def get_edges():
    return edge_db