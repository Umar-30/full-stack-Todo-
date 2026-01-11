"""
FastAPI application entry point.

This module creates and configures the FastAPI application
with database lifecycle management and API routers.
"""

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

from src.api import health_router
from src.db import database_lifespan
from src.models.task import Task  # Import Task model to register it with SQLModel
from src.routers.tasks import router as tasks_router

# Allowed origins for CORS
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:3004",
]

# Create FastAPI application with database lifespans
app = FastAPI(
    title="Todo API",
    description="Backend API for the Todo Full-Stack Web Application",
    version="1.0.0",
    lifespan=database_lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)


# Handle OPTIONS requests explicitly for all API routes
@app.options("/api/{path:path}")
async def options_handler(request: Request, path: str):
    """Handle CORS preflight requests for all API routes."""
    origin = request.headers.get("origin", "")

    response = Response(status_code=200)
    if origin in ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = origin
    else:
        response.headers["Access-Control-Allow-Origin"] = ALLOWED_ORIGINS[0]

    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Accept"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Max-Age"] = "600"
    return response

# Register routers
app.include_router(health_router)
app.include_router(tasks_router)


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint returning API info."""
    return {
        "name": "Todo API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
    }