from fastapi import APIRouter, Depends
from typing import List
from uuid import uuid4
from sqlalchemy.orm import Session

from api.models import Node
from db import get_db
from db.models import NodeModel


def _to_pydantic(m: NodeModel) -> Node:
    return Node(
        id=m.id,
        strategy_id=m.strategy_id,
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
    summary="Get all nodes in the graph",
)
def get_nodes(db: Session = Depends(get_db)):
    """
    Get all nodes in the graph from the database.
    """
    return [_to_pydantic(n) for n in db.query(NodeModel).all()]


@router.post("/",
    response_model=Node,
    summary="Create a new node in the graph",
)
def create_node(node: Node, db: Session = Depends(get_db)):
    """
    Create a new node in the graph.
    """
    nid = node.id if (node.id and node.id != "") else str(uuid4())
    m = NodeModel(
        id=nid,
        strategy_id=node.strategy_id,
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
def clear_nodes(db: Session = Depends(get_db)):
    """
    Clear all nodes in the graph.
    """
    db.query(NodeModel).delete()
    db.commit()
    return {"ok": True}
