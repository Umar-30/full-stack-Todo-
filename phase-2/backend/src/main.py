"""
FastAPI application entry point.

This module creates and configures the FastAPI application
with database lifecycle management and API routers.
"""

from fastapi import FastAPI

from src.api import health_router
from src.db import database_lifespan

# Create FastAPI application with database lifespan
app = FastAPI(
    title="Todo API",
    description="Backend API for the Todo Full-Stack Web Application",
    version="1.0.0",
    lifespan=database_lifespan,
)

# Register routers
app.include_router(health_router)


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint returning API info."""
    return {
        "name": "Todo API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
    }
