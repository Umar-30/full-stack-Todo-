"""
Health check response schemas.

Per contracts/health-endpoint.yaml OpenAPI specification.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class DatabaseHealthResponse(BaseModel):
    """
    Database health check response schema.

    Attributes:
        status: "healthy" or "unhealthy"
        connected: Whether database connection is established
        latency_ms: Database query latency in milliseconds
        pool_size: Configured connection pool size
        active_connections: Currently active connections in pool
        error: Error message if unhealthy
    """

    status: str = Field(
        description="Database health status",
        examples=["healthy", "unhealthy"]
    )
    connected: bool = Field(
        description="Whether database connection is established"
    )
    latency_ms: Optional[int] = Field(
        default=None,
        ge=0,
        description="Database query latency in milliseconds"
    )
    pool_size: Optional[int] = Field(
        default=None,
        ge=0,
        description="Configured connection pool size"
    )
    active_connections: Optional[int] = Field(
        default=None,
        ge=0,
        description="Currently active connections in pool"
    )
    error: Optional[str] = Field(
        default=None,
        description="Error message if unhealthy"
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "status": "healthy",
                    "connected": True,
                    "latency_ms": 5,
                    "pool_size": 5,
                    "active_connections": 2
                },
                {
                    "status": "unhealthy",
                    "connected": False,
                    "error": "Connection refused"
                }
            ]
        }
    }


class HealthChecks(BaseModel):
    """Health checks container."""

    database: DatabaseHealthResponse = Field(
        description="Database health status"
    )


class HealthResponse(BaseModel):
    """
    Full application health response schema.

    Attributes:
        status: Overall health status ("healthy" or "unhealthy")
        timestamp: ISO 8601 timestamp of the health check
        checks: Individual health check results
    """

    status: str = Field(
        description="Overall health status",
        examples=["healthy", "unhealthy"]
    )
    timestamp: datetime = Field(
        description="ISO 8601 timestamp of the health check"
    )
    checks: HealthChecks = Field(
        description="Individual health check results"
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "status": "healthy",
                    "timestamp": "2026-01-08T12:00:00Z",
                    "checks": {
                        "database": {
                            "status": "healthy",
                            "connected": True,
                            "latency_ms": 5
                        }
                    }
                }
            ]
        }
    }
