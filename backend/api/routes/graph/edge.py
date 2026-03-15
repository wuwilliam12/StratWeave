from fastapi import APIRouter, Depends
from typing import List
from uuid import uuid4
from sqlalchemy.orm import Session

from api.models import Edge
from db import get_db
from db.models import EdgeModel


def _to_pydantic(m: EdgeModel) -> Edge:
    return Edge(
        id=m.id,
        source=m.source,
        target=m.target,
        label=m.label or "",
        probability=m.probability,
        stamina_cost=m.stamina_cost,
    )


router = APIRouter(prefix="/edges", tags=["edges"])


@router.get("/",
    response_model=List[Edge],
    summary="Get all edges in the graph",
)
def get_edges(db: Session = Depends(get_db)):
    """
    Get all edges in the graph from the database.
    """
    return [_to_pydantic(e) for e in db.query(EdgeModel).all()]


@router.post("/",
    response_model=Edge,
    summary="Create a new edge in the graph",
)
def create_edge(edge: Edge, db: Session = Depends(get_db)):
    """
    Create a new edge in the graph.
    """
    eid = edge.id if (edge.id and edge.id != "") else str(uuid4())
    m = EdgeModel(
        id=eid,
        source=edge.source,
        target=edge.target,
        label=edge.label or "",
        probability=edge.probability,
        stamina_cost=edge.stamina_cost,
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    return _to_pydantic(m)


@router.delete("/",
    response_model=dict,
    summary="Clear all edges in the graph",
)
def clear_edges(db: Session = Depends(get_db)):
    """
    Clear all edges in the graph.
    """
    db.query(EdgeModel).delete()
    db.commit()
    return {"ok": True}
