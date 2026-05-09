"""StatWeaver v0: heuristic graph suggestions (no external LLM required)."""

from __future__ import annotations

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from api.routes.auth import get_current_user
from db.models import User

router = APIRouter(tags=["ai"])


class GraphSuggestRequest(BaseModel):
    sport: str = Field(default="boxing")
    mode: str = Field(default="state", description="state or action")
    nodes: list[dict] = Field(default_factory=list)
    edges: list[dict] = Field(default_factory=list)


class GraphSuggestResponse(BaseModel):
    summary: str
    suggestions: list[str]
    coverage_score: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0,
        description="Rough score: 1 - (issues / max(nodes,1))",
    )


def _node_meta(node: dict) -> tuple[str, str | None]:
    data = node.get("data") if isinstance(node.get("data"), dict) else {}
    label = (
        data.get("label")
        or node.get("label")
        or node.get("id")
        or "node"
    )
    if not isinstance(label, str):
        label = str(label)
    nt = data.get("nodeType") or node.get("nodeType")
    return label.strip() or "Untitled", nt if isinstance(nt, str) else None


@router.post(
    "/graph-suggest",
    response_model=GraphSuggestResponse,
    summary="StatWeaver: suggest tactical improvements",
)
def graph_suggest(
    payload: GraphSuggestRequest,
    _user: User = Depends(get_current_user),
) -> GraphSuggestResponse:
    nodes = [n for n in payload.nodes if isinstance(n, dict)]
    edges = [e for e in payload.edges if isinstance(e, dict)]

    outgoing: dict[str, int] = {}
    for e in edges:
        src = e.get("source")
        if isinstance(src, str):
            outgoing[src] = outgoing.get(src, 0) + 1

    issues: list[str] = []

    for node in nodes:
        nid = node.get("id")
        if not isinstance(nid, str):
            continue
        label, nt = _node_meta(node)
        oc = outgoing.get(nid, 0)
        if oc == 0:
            issues.append(
                f'Dead end: "{label}" has no outgoing transition — add a response or exit.'
            )
        if nt == "decision" and oc < 2:
            issues.append(
                f'Weak branch: decision "{label}" should have at least two labeled exits (if/then).'
            )
        if nt == "state" and oc == 0:
            issues.append(
                f'State "{label}" has no defined reaction — link to an action or decision.'
            )

    # Simple predictability: long linear chains of only "action" nodes
    action_only = sum(
        1
        for n in nodes
        if isinstance(n.get("id"), str) and _node_meta(n)[1] == "action"
    )
    if len(nodes) >= 4 and action_only >= len(nodes) - 1 and payload.mode == "action":
        issues.append(
            "Flow is almost all actions — consider adding state nodes in State mode to "
            "encode range, pressure, and triggers (clearer coaching language)."
        )

    max_nodes = max(len(nodes), 1)
    score = max(0.0, 1.0 - min(len(issues), max_nodes) / max_nodes)

    summary = (
        f"StatWeaver ({payload.sport}, {payload.mode} mode): "
        f"{len(issues)} observation(s) on {len(nodes)} nodes / {len(edges)} edges."
    )
    if not issues:
        summary += " No obvious coverage gaps detected — refine edge labels for contingencies."

    return GraphSuggestResponse(
        summary=summary,
        suggestions=issues[:16],
        coverage_score=round(score, 3),
    )
