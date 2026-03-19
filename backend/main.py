from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import api_router
from db import create_tables, get_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield


# Register sport resolvers after routes are loaded (avoids circular import)
import api.models.sports.boxing_resolver  # noqa: F401, E402


app = FastAPI(title="StratWeave Backend", lifespan=lifespan)

# CORS for front vs backend port access
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = ALLOWED_ORIGINS,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

app.include_router(api_router, prefix="/api")