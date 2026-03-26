# User-Owned Graphs API Documentation

## Overview
Users can now create, manage, and own graphs. All graph operations are tied to the authenticated user.

---

## Endpoints

### Graph Management

#### `POST /api/graph/`
**Create a new graph with nodes and edges**

Request body:
```json
{
  "name": "Boxing Strategy: Jabbing Combinations",
  "description": "A detailed strategy graph for jab-heavy combinations",
  "is_public": false,
  "nodes": [
    {
      "id": "node-1",
      "label": "Opening Stance",
      "graph_id": "graph-id",
      "node_type": "strategy",
      "position_x": 100,
      "position_y": 100
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "node-1",
      "target": "node-2",
      "graph_id": "graph-id",
      "label": "leads to",
      "probability": 0.9
    }
  ]
}
```

Response: `GraphResponse` with id, name, owner_id, nodes, edges

---

#### `GET /api/graph/`
**List all graphs owned by the current user (with optional public graphs)**

Query parameters:
- `include_public` (bool, default=false): Include public graphs from other users

Response: List of `GraphSummary` objects with id, name, description, owner_id, is_public

---

#### `GET /api/graph/{graph_id}`
**Fetch a specific graph with all its nodes and edges**

Query parameters:
- `enrich` (bool, default=false): Resolve action/boxer data for nodes (requires sport resolver)

Response: `GraphPayload` with nodes and edges lists

Authorization: User must own the graph or it must be public

---

#### `PUT /api/graph/{graph_id}`
**Update a graph (replace nodes and edges entirely)**

Request body: Same structure as POST (graph create)

Response: `GraphPayload` with updated nodes and edges

Authorization: User must own the graph

---

#### `DELETE /api/graph/{graph_id}`
**Delete a graph and all its nodes/edges**

Response: `{"ok": true}`

Authorization: User must own the graph

---

### Nodes (Graph-Scoped)

#### `GET /api/graph/nodes/`
**Get all nodes in a specific graph**

Query parameters:
- `graph_id` (string, required): The graph ID

Response: List of `Node` objects

---

#### `POST /api/graph/nodes/`
**Create a new node in a graph**

Request body: `Node` with `graph_id` field set

Response: Created `Node` object

Requirements:
- `graph_id` must be present in the request
- User must own the graph

---

#### `DELETE /api/graph/nodes/`
**Clear all nodes in a graph**

Query parameters:
- `graph_id` (string, required): The graph ID

Response: `{"ok": true}`

Authorization: User must own the graph

---

### Edges (Graph-Scoped)

#### `GET /api/graph/edges/`
**Get all edges in a specific graph**

Query parameters:
- `graph_id` (string, required): The graph ID

Response: List of `Edge` objects

---

#### `POST /api/graph/edges/`
**Create a new edge in a graph**

Request body: `Edge` with `graph_id` field set

Response: Created `Edge` object

Requirements:
- `graph_id` must be present in the request
- User must own the graph

---

#### `DELETE /api/graph/edges/`
**Clear all edges in a graph**

Query parameters:
- `graph_id` (string, required): The graph ID

Response: `{"ok": true}`

Authorization: User must own the graph

---

## Models

### Node
```
{
  "id": str (uuid),
  "strategy_id": str | None,
  "graph_id": str,
  "parent_id": str | None,
  "label": str,
  "sport": str | None,
  "action_id": str | None,
  "athlete_id": str | None,
  "position_x": float,
  "position_y": float,
  "node_type": str
}
```

### Edge
```
{
  "id": str (uuid),
  "source": str,
  "target": str,
  "graph_id": str,
  "label": str,
  "probability": float (default 1.0),
  "stamina_cost": float (default 0)
}
```

### GraphSummary
```
{
  "id": str,
  "name": str,
  "description": str | None,
  "owner_id": int,
  "is_public": bool
}
```

### GraphResponse
```
{
  "id": str,
  "name": str,
  "description": str | None,
  "owner_id": int,
  "is_public": bool,
  "nodes": [Node],
  "edges": [Edge]
}
```

---

## Authentication
All endpoints require a valid JWT token in the `Authorization: Bearer <token>` header.
Token obtained via `POST /api/auth/token` after login.

---

## Authorization Rules
- **Own graphs**: User can read/write/delete only their own graphs
- **Public graphs**: Any authenticated user can read public graphs
- **Node/Edge creation**: Requires ownership of the parent graph

---

## Database Schema

**GraphModel** table:
- `id` (PK, str)
- `name` (str)
- `description` (str | NULL)
- `owner_id` (FK -> users.id)
- `is_public` (bool)
- `created_at` (datetime)
- `updated_at` (datetime)

**NodeModel** fields added:
- `graph_id` (str | NULL) - foreign reference to graph

**EdgeModel** fields added:
- `graph_id` (str | NULL) - foreign reference to graph

---

## Usage Example (TypeScript/Fetch)

```typescript
// Create a new graph
const response = await fetch("http://localhost:8000/api/graph/", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: "My Strategy",
    description: "A personal strategy",
    is_public: false,
    nodes: [],
    edges: []
  })
});
const graph = await response.json();

// Fetch the graph
const getResponse = await fetch(`http://localhost:8000/api/graph/${graph.id}`, {
  headers: { "Authorization": `Bearer ${token}` }
});
const graphData = await getResponse.json();

// List user's graphs
const listResponse = await fetch("http://localhost:8000/api/graph/?include_public=false", {
  headers: { "Authorization": `Bearer ${token}` }
});
const userGraphs = await listResponse.json();
```
