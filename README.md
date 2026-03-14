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
- **Future: ML** - Test and predict gameplan strength; suggest next strategies or counters.

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
