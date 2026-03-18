from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from uuid import uuid4

from api.models import Edge, Node
from api.models.sports import Sport
from api.models.sports.registry import get_resolver
from db import get_db
from db.models import NodeModel, EdgeModel


class NodeEnriched(Node):
    """Node with resolved sport entities (action, boxer for boxing)."""
    action: dict | None = None
    boxer: dict | None = None


class GraphPayload(BaseModel):
    nodes: list[Node]
    edges: list[Edge]


class GraphPayloadEnriched(BaseModel):
    nodes: list[NodeEnriched]
    edges: list[Edge]


def _node_to_pydantic(m: NodeModel) -> Node:
    return Node(
        id=m.id,
        strategy_id=m.strategy_id,
        label=m.label,
        sport=getattr(m, "sport", None),
        action_id=m.action_id,
        boxer_id=m.boxer_id,
        position_x=m.position_x,
        position_y=m.position_y,
        node_type=m.node_type or "strategy",
    )


def _edge_to_pydantic(m: EdgeModel) -> Edge:
    return Edge(
        id=m.id,
        source=m.source,
        target=m.target,
        label=m.label or "",
        probability=m.probability,
        stamina_cost=m.stamina_cost,
    )


router = APIRouter(tags=["graph"])  # Mounted at /graph by parent


def _enrich_node(node: Node) -> NodeEnriched:
    """Resolve action_id/boxer_id to full data when sport resolver exists."""
    enriched = NodeEnriched(
        **node.model_dump(),
        action=None,
        boxer=None,
    )
    sport = (node.sport or "boxing").lower()
    try:
        sport_enum = Sport(sport)
    except ValueError:
        return enriched
    resolver = get_resolver(sport_enum)
    if not resolver:
        return enriched
    if node.action_id:
        enriched.action = resolver.resolve_action(node.action_id)
    if node.boxer_id:
        enriched.boxer = resolver.resolve_athlete(node.boxer_id)
    return enriched


@router.get("/",
    response_model=GraphPayload | GraphPayloadEnriched,
    summary="Get the full graph (nodes + edges)",
)
def get_graph(
    db: Session = Depends(get_db),
    enrich: bool = Query(False, description="Resolve action/boxer data for nodes"),
):
    """Get the full graph (nodes + edges) from the database."""
    nodes = db.query(NodeModel).all()
    edges = db.query(EdgeModel).all()
    pydantic_nodes = [_node_to_pydantic(n) for n in nodes]
    pydantic_edges = [_edge_to_pydantic(e) for e in edges]
    if enrich:
        return GraphPayloadEnriched(
            nodes=[_enrich_node(n) for n in pydantic_nodes],
            edges=pydantic_edges,
        )
    return GraphPayload(nodes=pydantic_nodes, edges=pydantic_edges)


@router.post("/",
    response_model=GraphPayload,
    summary="Save the full graph (nodes + edges)",
)
def save_graph(payload: GraphPayload, db: Session = Depends(get_db)):
    """
    Replace the full graph with the payload.
    Assigns ids to nodes/edges that lack them.
    """
    db.query(EdgeModel).delete()
    db.query(NodeModel).delete()
    db.commit()

    for n in payload.nodes:
        nid = n.id if (n.id and n.id != "") else str(uuid4())
        db.add(NodeModel(
            id=nid,
            strategy_id=n.strategy_id,
            label=n.label,
            sport=getattr(n, "sport", None),
            action_id=n.action_id,
            boxer_id=n.boxer_id,
            position_x=n.position_x,
            position_y=n.position_y,
            node_type=getattr(n, "node_type", None) or "strategy",
        ))
    for e in payload.edges:
        eid = e.id if (e.id and e.id != "") else str(uuid4())
        db.add(EdgeModel(
            id=eid,
            source=e.source,
            target=e.target,
            label=e.label or "",
            probability=e.probability,
            stamina_cost=e.stamina_cost,
        ))
    db.commit()

    nodes = db.query(NodeModel).all()
    edges = db.query(EdgeModel).all()
    return GraphPayload(
        nodes=[_node_to_pydantic(n) for n in nodes],
        edges=[_edge_to_pydantic(e) for e in edges],
    )
