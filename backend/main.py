from fastapi import FastAPI
from routes import router
from api.routes import moves, frames, edges, styles

app = FastAPI(title="StratWeave Backend")

# Boxing API routers
app.include_router(moves.router, prefix="/moves", tags=["Moves"])
app.include_router(frames.router, prefix="/frames", tags=["Frames"])
app.include_router(edges.router, prefix="/edges", tags=["Edges"])
app.include_router(styles.router, prefix="/styles", tags=["Styles"])

