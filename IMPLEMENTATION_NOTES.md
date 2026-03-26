# User-Owned Graphs Implementation Summary

## Overview
Implemented a complete framework for users to create, store, and manage their own graphs. This includes database schema updates, API endpoints with user authentication, and a frontend client library.

## Backend Changes

### Database Models (`db/models.py`)
- **Added `GraphModel`**: Core table for storing user-created graphs
  - Fields: `id`, `name`, `description`, `owner_id` (FK to users), `is_public`, `created_at`, `updated_at`
  - Links to `NodeModel` and `EdgeModel` via `graph_id` field

- **Updated `NodeModel`**: Added `graph_id` field to associate nodes with specific graphs

- **Updated `EdgeModel`**: Added `graph_id` field to associate edges with specific graphs

### API Routes (`api/routes/graph/`)

#### Graph endpoints (`graph.py`)
- `POST /api/graph/`
  - Create a new graph with optional nodes and edges
  - Requires: JWT authentication
  - Response: Full `GraphResponse` with graph metadata and content

- `GET /api/graph/`
  - List all user-owned graphs
  - Optional: Include public graphs from other users
  - Response: Array of `GraphSummary` objects

- `GET /api/graph/{graph_id}`
  - Fetch a specific graph with all nodes and edges
  - Authorization: Owner or public graphs
  - Optional: Enrich nodes with resolved action/athlete data

- `PUT /api/graph/{graph_id}`
  - Update graph metadata and replace nodes/edges
  - Authorization: Owner only

- `DELETE /api/graph/{graph_id}`
  - Delete a graph and all associated nodes/edges
  - Authorization: Owner only

#### Node endpoints (`node.py`) - Now scoped to graphs
- `GET /api/graph/nodes/?graph_id=...`
  - Fetch nodes for a specific graph
  
- `POST /api/graph/nodes/`
  - Create node in a graph (requires `graph_id` in payload)

- `DELETE /api/graph/nodes/?graph_id=...`
  - Clear all nodes in a graph

#### Edge endpoints (`edge.py`) - Now scoped to graphs
- `GET /api/graph/edges/?graph_id=...`
  - Fetch edges for a specific graph
  
- `POST /api/graph/edges/`
  - Create edge in a graph (requires `graph_id` in payload)

- `DELETE /api/graph/edges/?graph_id=...`
  - Clear all edges in a graph

### Authentication & Authorization
- All graph operations require valid JWT token from `/api/auth/token`
- User can only modify/delete their own graphs
- Public graphs are readable by all authenticated users
- Graph ownership enforced by `owner_id` checks

### Data Models (Pydantic)
- `GraphCreate`: Input model for creating/updating graphs
- `GraphSummary`: Lightweight graph metadata
- `GraphResponse`: Full graph with nodes and edges
- Updated `Node` and `Edge` models with `graph_id` field

---

## Frontend Changes

### API Client Library (`lib/graphApi.ts`)
TypeScript client with full type definitions and helper functions:

**Type Definitions:**
- `Node`, `Edge`, `GraphSummary`, `GraphResponse`, `GraphCreate`

**Functions:**
- `listGraphs(includePublic?)`: Fetch user's graphs
- `createGraph(payload)`: Create new graph
- `getGraph(graphId, enrich?)`: Fetch specific graph
- `updateGraph(graphId, payload)`: Update graph
- `deleteGraph(graphId)`: Delete graph
- `getGraphNodes(graphId)`: Get nodes
- `createNode(node)`: Add node
- `getGraphEdges(graphId)`: Get edges
- `createEdge(edge)`: Add edge
- `clearGraphNodes(graphId)`: Remove all nodes
- `clearGraphEdges(graphId)`: Remove all edges

**Features:**
- Automatic JWT token retrieval from localStorage
- Error handling with descriptive messages
- Base URL configurable via `NEXT_PUBLIC_API_URL` env var

### React Context (`contexts/GraphContext.tsx`)
Global state management for graphs:

**State:**
- `graphs`: Array of user's graph summaries
- `currentGraph`: Currently open/edited graph
- `loading`: Operation status
- `error`: Error message storage

**Methods:**
- `fetchGraphs(includePublic?)`: Refresh graph list
- `createNewGraph(payload)`: Create and add to list
- `openGraph(graphId)`: Load graph for editing
- `saveGraph(payload)`: Update current graph
- `removeGraph(graphId)`: Delete from list and state
- `clearError()`: Clear error messages

**Hook:** `useGraph()` for easy consumption in components

---

## Architecture Overview

```
User (Frontend)
    ↓
React Context (GraphContext)
    ↓
API Client (graphApi.ts)
    ↓ [HTTP Fetch + JWT]
Backend FastAPI Routes
    ↓
SQLAlchemy ORM (db/models.py)
    ↓
SQLite/PostgreSQL Database
    - graphs table (owner_id FK)
    - nodes table (graph_id FK)
    - edges table (graph_id FK)
    - users table
```

---

## Database Migration

Script auto-runs on app startup (`db/__init__.py`):
- Adds `graph_id` column to existing `nodes` table
- Adds `graph_id` column to existing `edges` table
- Creates new `graphs` table with owner/public metadata

SQLite safe migrations with existence checks.

---

## Security Features

1. **JWT Authentication**: All endpoints require valid token
2. **Ownership Validation**: Users can only read/modify their own graphs
3. **Public Graph Access**: Authenticated users can read public graphs
4. **Scope Isolation**: Node/Edge operations filtered by graph ownership

---

## Next Steps for Frontend Integration

1. **Wrap root layout with `GraphProvider`**
   ```tsx
   import { GraphProvider } from "@/contexts/GraphContext";
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           <GraphProvider>{children}</GraphProvider>
         </body>
       </html>
     );
   }
   ```

2. **Add graph list page** showing user's graphs with create/delete/open actions

3. **Integrate GraphContext in graph editor** for loading/saving operations

4. **Add graph settings modal** for name, description, public/private toggle

---

## Testing the Endpoints

### Create a graph
```bash
curl -X POST http://localhost:8000/api/graph/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Boxing Strategy",
    "description": "A test strategy",
    "is_public": false,
    "nodes": [],
    "edges": []
  }'
```

### List user's graphs
```bash
curl http://localhost:8000/api/graph/ \
  -H "Authorization: Bearer <token>"
```

### Get a graph
```bash
curl http://localhost:8000/api/graph/{graph_id} \
  -H "Authorization: Bearer <token>"
```

---

## Files Modified/Created

### Backend
-  `db/models.py` - Added GraphModel, updated Node/Edge
-  `db/__init__.py` - Updated migration logic
-  `api/models/graph/node.py` - Added graph_id field
-  `api/routes/graph/graph.py` - New user-aware endpoints
-  `api/routes/graph/node.py` - Graph-scoped node operations
-  `api/routes/graph/edge.py` - Graph-scoped edge operations

### Frontend
-  `lib/graphApi.ts` - New API client library (created)
-  `contexts/GraphContext.tsx` - New React context (created)
-  `GRAPH_API.md` - API documentation (created)

---

## Environment Setup

### Backend
No new dependencies required (uses existing sqlalchemy, fastapi, pydantic).

### Frontend
No new npm packages required for the client library.

Set optional env var:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```
(defaults to localhost:8000 if not set)
