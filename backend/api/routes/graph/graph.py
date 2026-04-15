from fastapi import APIRouter, Depends, Query, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from uuid import uuid4

from api.models import Edge, Node
from api.models.sports import Sport
from api.models.sports.registry import get_resolver
from api.routes.auth import get_current_user
from db import get_db
from db.models import NodeModel, EdgeModel, GraphModel, User


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


class GraphCreate(BaseModel):
    name: str
    description: str | None = None
    is_public: bool = False
    nodes: list[Node] = []
    edges: list[Edge] = []


class GraphSummary(BaseModel):
    id: str
    name: str
    description: str | None = None
    owner_id: int
    is_public: bool


class GraphResponse(GraphSummary):
    nodes: list[Node]
    edges: list[Edge]

def _node_to_pydantic(m: NodeModel) -> Node:
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
    if node.athlete_id:
        enriched.boxer = resolver.resolve_athlete(node.athlete_id)
    return enriched


@router.get("/",
    response_model=list[GraphSummary],
    summary="List graphs for the current user",
)
def list_graphs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    include_public: bool = Query(False, description="Include public graphs from other users"),
):
    query = db.query(GraphModel).filter(GraphModel.owner_id == current_user.id)
    if include_public:
        query = query.union_all(db.query(GraphModel).filter(GraphModel.is_public == True))
    graphs = query.all()
    # filter duplicates in case the current user includes own public graphs
    unique = {g.id: g for g in graphs}.values()
    return [GraphSummary(
        id=g.id,
        name=g.name,
        description=g.description,
        owner_id=g.owner_id,
        is_public=g.is_public,
    ) for g in unique]


@router.post("/",
    response_model=GraphResponse,
    summary="Create a user-owned graph with nodes and edges",
)
def create_graph(
    payload: GraphCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    graph_id = str(uuid4())
    graph = GraphModel(
        id=graph_id,
        name=payload.name,
        description=payload.description,
        owner_id=current_user.id,
        is_public=payload.is_public,
    )
    db.add(graph)
    for n in payload.nodes:
        nid = n.id if (n.id and n.id != "") else str(uuid4())
        db.add(NodeModel(
            id=nid,
            strategy_id=n.strategy_id,
            graph_id=graph_id,
            parent_id=n.parent_id,
            label=n.label,
            sport=getattr(n, "sport", None),
            action_id=n.action_id,
            athlete_id=n.athlete_id,
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
            graph_id=graph_id,
            label=e.label or "",
            probability=e.probability,
            stamina_cost=e.stamina_cost,
        ))
    db.commit()
    return GraphResponse(
        id=graph.id,
        name=graph.name,
        description=graph.description,
        owner_id=graph.owner_id,
        is_public=graph.is_public,
        nodes=[_node_to_pydantic(n) for n in db.query(NodeModel).filter(NodeModel.graph_id == graph_id).all()],
        edges=[_edge_to_pydantic(e) for e in db.query(EdgeModel).filter(EdgeModel.graph_id == graph_id).all()],
    )


@router.get("/{graph_id}",
    response_model=GraphPayload,
    summary="Get nodes and edges for a graph",
)
def get_graph(
    graph_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    enrich: bool = Query(False, description="Resolve action/boxer data for nodes"),
):
    graph = db.query(GraphModel).filter(GraphModel.id == graph_id).first()
    if not graph:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Graph not found")
    if graph.owner_id != current_user.id and not graph.is_public:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this graph")

    nodes = db.query(NodeModel).filter(NodeModel.graph_id == graph_id).all()
    edges = db.query(EdgeModel).filter(EdgeModel.graph_id == graph_id).all()
    pydantic_nodes = [_node_to_pydantic(n) for n in nodes]
    pydantic_edges = [_edge_to_pydantic(e) for e in edges]
    if enrich:
        return GraphPayloadEnriched(nodes=[_enrich_node(n) for n in pydantic_nodes], edges=pydantic_edges)
    return GraphPayload(nodes=pydantic_nodes, edges=pydantic_edges)


@router.put("/{graph_id}",
    response_model=GraphPayload,
    summary="Update a graph (replace nodes and edges)",
)
def update_graph(
    graph_id: str,
    payload: GraphCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    graph = db.query(GraphModel).filter(GraphModel.id == graph_id).first()
    if not graph:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Graph not found")
    if graph.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    graph.name = payload.name
    graph.description = payload.description
    graph.is_public = payload.is_public

    db.query(NodeModel).filter(NodeModel.graph_id == graph_id).delete()
    db.query(EdgeModel).filter(EdgeModel.graph_id == graph_id).delete()

    for n in payload.nodes:
        nid = n.id if (n.id and n.id != "") else str(uuid4())
        db.add(NodeModel(
            id=nid,
            strategy_id=n.strategy_id,
            graph_id=graph_id,
            parent_id=n.parent_id,
            label=n.label,
            sport=getattr(n, "sport", None),
            action_id=n.action_id,
            athlete_id=n.athlete_id,
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
            graph_id=graph_id,
            label=e.label or "",
            probability=e.probability,
            stamina_cost=e.stamina_cost,
        ))
    db.commit()

    nodes = db.query(NodeModel).filter(NodeModel.graph_id == graph_id).all()
    edges = db.query(EdgeModel).filter(EdgeModel.graph_id == graph_id).all()
    return GraphPayload(nodes=[_node_to_pydantic(n) for n in nodes], edges=[_edge_to_pydantic(e) for e in edges])


@router.delete("/{graph_id}", response_model=dict, summary="Delete a graph")
def delete_graph(
    graph_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    graph = db.query(GraphModel).filter(GraphModel.id == graph_id).first()
    if not graph:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Graph not found")
    if graph.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    db.query(NodeModel).filter(NodeModel.graph_id == graph_id).delete()
    db.query(EdgeModel).filter(EdgeModel.graph_id == graph_id).delete()
    db.delete(graph)
    db.commit()
    return {"ok": True}
