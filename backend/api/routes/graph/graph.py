from fastapi import APIRouter
from pydantic import BaseModel
from uuid import uuid4

from api.models.graph import Edge, Node
from .node import nodes_db
from .edge import edges_db

class GraphPayload(BaseModel):
    nodes: list[Node]
    edges: list[Edge]

router = APIRouter(prefix="/graph", tags=["graph"])

@router.get("/",
    response_model=GraphPayload,
    summary="Get the full graph (nodes + edges)",
)
def get_graph():
    """
    Get the full graph (nodes + edges).
    """
    return GraphPayload(nodes=nodes_db, edges=edges_db)

@router.post("/",
    response_model=GraphPayload,
    summary="Save the full graph (nodes + edges)",
)
def save_graph(payload: GraphPayload):
    """
    Replace the full graph with the payload.
    Assigns ids to nodes/edges that lack them.
    """
    nodes_db.clear()
    edges_db.clear()
    id_map = {}  # old id -> new id for nodes that get new uuids
    for n in payload.nodes:
        if n.id is None or n.id == "":
            n.id = str(uuid4())
        else:
            id_map[n.id] = n.id
        nodes_db.append(n)
    for e in payload.edges:
        if e.id is None or e.id == "":
            e.id = str(uuid4())
        # Keep source/target (they reference node ids)
        edges_db.append(e)
    return GraphPayload(nodes=list(nodes_db), edges=list(edges_db))
