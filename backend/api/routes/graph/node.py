from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List
from uuid import uuid4
from sqlalchemy.orm import Session

from api.models import Node
from api.routes.auth import get_current_user
from db import get_db
from db.models import NodeModel, GraphModel, User


def _to_pydantic(m: NodeModel) -> Node:
    return Node(
        id=m.id,
        strategy_id=m.strategy_id,
        graph_id=m.graph_id,
        parent_id=m.parent_id,
        label=m.label,
        sport=getattr(m, "sport", None),
        action_id=m.action_id,
        athlete_id=m.athlete_id,
        position_x=m.position_x,
        position_y=m.position_y,
        node_type=m.node_type or "strategy",
    )


router = APIRouter(prefix="/nodes", tags=["nodes"])


@router.get("/",
    response_model=List[Node],
    summary="Get all nodes in a graph",
)
def get_nodes(
    graph_id: str = Query(..., description="Graph ID to retrieve nodes for"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get all nodes in the graph from the database.
    """
    graph = db.query(GraphModel).filter(GraphModel.id == graph_id).first()
    if not graph:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Graph not found")
    if graph.owner_id != current_user.id and not graph.is_public:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    return [_to_pydantic(n) for n in db.query(NodeModel).filter(NodeModel.graph_id == graph_id).all()]


@router.post("/",
    response_model=Node,
    summary="Create a new node in the graph",
)
def create_node(node: Node, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Create a new node in the graph.
    """
    if not node.graph_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="graph_id is required")

    graph = db.query(GraphModel).filter(GraphModel.id == node.graph_id).first()
    if not graph:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Graph not found")
    if graph.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    nid = node.id if (node.id and node.id != "") else str(uuid4())
    m = NodeModel(
        id=nid,
        strategy_id=node.strategy_id,
        graph_id=node.graph_id,
        parent_id=node.parent_id,
        label=node.label,
        sport=getattr(node, "sport", None),
        action_id=node.action_id,
        athlete_id=node.athlete_id,
        position_x=node.position_x,
        position_y=node.position_y,
        node_type=getattr(node, "node_type", None) or "strategy",
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    return _to_pydantic(m)


@router.delete("/",
    response_model=dict,
    summary="Clear all nodes in the graph",
)
def clear_nodes(
    graph_id: str = Query(..., description="Graph ID to clear"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Clear all nodes in the graph.
    """
    graph = db.query(GraphModel).filter(GraphModel.id == graph_id).first()
    if not graph:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Graph not found")
    if graph.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    db.query(NodeModel).filter(NodeModel.graph_id == graph_id).delete()
    db.commit()
    return {"ok": True}
