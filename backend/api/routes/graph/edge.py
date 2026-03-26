from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List
from uuid import uuid4
from sqlalchemy.orm import Session

from api.models import Edge
from api.routes.auth import get_current_user
from db import get_db
from db.models import EdgeModel, GraphModel, User


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
    summary="Get all edges in a graph",
)
def get_edges(
    graph_id: str = Query(..., description="Graph ID to retrieve edges for"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get all edges in the graph from the database.
    """
    graph = db.query(GraphModel).filter(GraphModel.id == graph_id).first()
    if not graph:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Graph not found")
    if graph.owner_id != current_user.id and not graph.is_public:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    return [_to_pydantic(e) for e in db.query(EdgeModel).filter(EdgeModel.graph_id == graph_id).all()]


@router.post("/",
    response_model=Edge,
    summary="Create a new edge in the graph",
)
def create_edge(edge: Edge, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Create a new edge in the graph.
    """
    if not edge.graph_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="graph_id is required")

    graph = db.query(GraphModel).filter(GraphModel.id == edge.graph_id).first()
    if not graph:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Graph not found")
    if graph.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    eid = edge.id if (edge.id and edge.id != "") else str(uuid4())
    m = EdgeModel(
        id=eid,
        source=edge.source,
        target=edge.target,
        graph_id=edge.graph_id,
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
def clear_edges(
    graph_id: str = Query(..., description="Graph ID to clear"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Clear all edges in the graph.
    """
    graph = db.query(GraphModel).filter(GraphModel.id == graph_id).first()
    if not graph:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Graph not found")
    if graph.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    db.query(EdgeModel).filter(EdgeModel.graph_id == graph_id).delete()
    db.commit()
    return {"ok": True}
