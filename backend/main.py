from fastapi import FastAPI

from app.api.routes import api_router

app = FastAPI(title="StratWeave Backend")

app.include_router(api_router)