from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import close_db_pool, init_db_pool
from app.routers import auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize the psycopg2 connection pool
    init_db_pool()
    yield
    # Shutdown: close all pool connections
    close_db_pool()


app = FastAPI(
    title="Intergalactic Cargo Portal",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)

@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}