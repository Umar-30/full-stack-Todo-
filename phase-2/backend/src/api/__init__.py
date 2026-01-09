"""
API routes package.

This module provides FastAPI routers for:
- health: Health check endpoints (/health, /health/db)
"""

from .health import router as health_router

__all__ = [
    "health_router",
]
