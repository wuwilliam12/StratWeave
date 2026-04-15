# StratWeave

Web app for visualizing and creating **gameplans** and developing **skillsets**. The main focus is on **counters**, **general strategies**, and **approaches**. Strategies are user-created or suggested and presented as an interactive **web graph** for exploration and editing. Will expand to more sports later, but focusing on boxing for now.

## Focus

- **Counters** - What beats what; matchup and response chains.
- **Strategies** - High-level plans (gameplanning)
- **Approaches** - How to execute gameplans
- **Style Bulding** - Aid in developing your own unique style/system
- **IQ Aid** - Help train and develop sport/game IQ

Content is **user-created** or **suggested** (e.g. community or system suggestions). The primary interface is a **graph**: nodes = strategies/options, edges = counters, transitions, or dependencies. Future work will add **ML testing and predictions** for gameplans (e.g. strength estimation, suggested next moves).

## Features (current / planned)

- **Strategy graph** - Add, connect, and explore nodes (strategies, counters, approaches).
- **User & suggested content** - Create your own nodes/edges; system or community can suggest links.
- **Counters & transitions** - Edges represent “counters”, “leads to”, or “beats” relationships.
- **Bag / Training toolkit** - Track learned weapons/tools in a personal bag with group tags (e.g. training camp, weekly coach focus)
- **ML / Analysis** - Planned

## Current Tech Stack

Frontend:
- React
- Next.js
- React Flow
- TypeScript

Backend:
- FastAPI or NestJS
- Database
- Neo4j

ML:
- Python
- PyTorch
- scikit-learn

Hosting:
- Vercel
- AWS

## Developer Housekeeping

Use these targets from the repo root:

- `make check` - Full CI-style gate (`check-format`, `lint`, `typecheck`, `test`)
- `make format` - Apply formatting for frontend and backend
- `make lint` - Run frontend lint and backend lint (if `ruff` is installed)
- `make typecheck` - Run TypeScript checks (`tsc --noEmit`)
- `make test` - Run backend and frontend tests
- `make audit` - Run Node and Python dependency audits (Python audit runs if `pip-audit` is installed)
- `make clean` - Remove caches/artifacts only
- `make distclean` - Remove caches/artifacts and frontend dependencies (`node_modules`)
