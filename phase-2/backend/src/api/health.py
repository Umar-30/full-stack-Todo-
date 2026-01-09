"""
Health check API endpoints.

Provides endpoints for checking application and database health:
- GET /health: Overall application health
- GET /health/db: Database-only health

Per contracts/health-endpoint.yaml OpenAPI specification.
"""

from datetime import datetime, timezone
from typing import Union

from fastapi import APIRouter, Response, status

from src.api.schemas.health import (
    DatabaseHealthResponse,
    HealthChecks,
    HealthResponse,
)
from src.db.health import check_database_health, get_full_health_status

router = APIRouter(prefix="/health", tags=["Health"])

# Default timeout for health checks (1 second per spec)
HEALTH_CHECK_TIMEOUT = 1.0


@router.get(
    "",
    response_model=HealthResponse,
    summary="Application Health Check",
    description="Returns the health status of the application including database connectivity. "
    "This endpoint does not require authentication.",
    responses={
        200: {
            "description": "Health check successful",
            "model": HealthResponse,
        },
        503: {
            "description": "Service unhealthy",
            "model": HealthResponse,
        },
    },
)
async def get_health(response: Response) -> HealthResponse:
    """
    Get overall application health status.

    Returns 200 if healthy, 503 if any component is unhealthy.
    """
    health_data = await get_full_health_status(timeout_seconds=HEALTH_CHECK_TIMEOUT)

    # Set appropriate HTTP status code
    if health_data["status"] == "unhealthy":
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    # Convert to response model
    db_health = health_data["checks"]["database"]

    return HealthResponse(
        status=health_data["status"],
        timestamp=datetime.fromisoformat(health_data["timestamp"].replace("Z", "+00:00")),
        checks=HealthChecks(
            database=DatabaseHealthResponse(
                status=db_health["status"],
                connected=db_health["connected"],
                latency_ms=db_health.get("latency_ms"),
                error=db_health.get("error"),
            )
        ),
    )


@router.get(
    "/db",
    response_model=DatabaseHealthResponse,
    summary="Database-Only Health Check",
    description="Returns only the database connectivity status. "
    "Useful for targeted monitoring of database health. "
    "This endpoint does not require authentication.",
    responses={
        200: {
            "description": "Database is healthy",
            "model": DatabaseHealthResponse,
        },
        503: {
            "description": "Database is unhealthy",
            "model": DatabaseHealthResponse,
        },
    },
)
async def get_database_health(response: Response) -> DatabaseHealthResponse:
    """
    Get database-only health status.

    Returns 200 if database is healthy, 503 if unhealthy.
    """
    db_health = await check_database_health(timeout_seconds=HEALTH_CHECK_TIMEOUT)

    # Set appropriate HTTP status code
    if db_health.status == "unhealthy":
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    return DatabaseHealthResponse(
        status=db_health.status,
        connected=db_health.connected,
        latency_ms=db_health.latency_ms,
        error=db_health.error,
    )
