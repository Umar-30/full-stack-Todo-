"""
Database health check functions.

This module provides health check functionality for database connectivity
with timeout handling and proper error responses.

Per contracts/health-endpoint.yaml specification.
"""

import asyncio
import logging
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import text
from sqlmodel.ext.asyncio.session import AsyncSession

from src.models.base import get_engine

logger = logging.getLogger(__name__)

# Default timeout for health check queries (1 second)
DEFAULT_HEALTH_CHECK_TIMEOUT = 1.0


@dataclass
class DatabaseHealthResult:
    """
    Result of a database health check.

    Attributes:
        status: "healthy" or "unhealthy"
        connected: Whether database connection succeeded
        latency_ms: Query latency in milliseconds (if connected)
        error: Error message (if unhealthy)
    """

    status: str
    connected: bool
    latency_ms: Optional[int] = None
    error: Optional[str] = None

    def to_dict(self) -> dict:
        """Convert to dictionary for JSON response."""
        result = {
            "status": self.status,
            "connected": self.connected,
        }
        if self.latency_ms is not None:
            result["latency_ms"] = self.latency_ms
        if self.error is not None:
            result["error"] = self.error
        return result


async def check_database_health(
    timeout_seconds: float = DEFAULT_HEALTH_CHECK_TIMEOUT
) -> DatabaseHealthResult:
    """
    Check database connectivity by executing a SELECT 1 query.

    Args:
        timeout_seconds: Maximum time to wait for query (default 1 second)

    Returns:
        DatabaseHealthResult: Health check result with status, latency, and error info
    """
    start_time = time.perf_counter()

    try:
        engine = get_engine()

        async def run_health_query():
            async with AsyncSession(engine) as session:
                result = await session.exec(text("SELECT 1"))
                return result.scalar()

        # Execute with timeout
        value = await asyncio.wait_for(
            run_health_query(),
            timeout=timeout_seconds
        )

        # Calculate latency
        end_time = time.perf_counter()
        latency_ms = int((end_time - start_time) * 1000)

        if value == 1:
            logger.debug(f"Database health check passed (latency: {latency_ms}ms)")
            return DatabaseHealthResult(
                status="healthy",
                connected=True,
                latency_ms=latency_ms
            )
        else:
            logger.warning(f"Unexpected health check result: {value}")
            return DatabaseHealthResult(
                status="unhealthy",
                connected=True,
                latency_ms=latency_ms,
                error=f"Unexpected query result: {value}"
            )

    except asyncio.TimeoutError:
        logger.error(f"Database health check timed out after {timeout_seconds}s")
        return DatabaseHealthResult(
            status="unhealthy",
            connected=False,
            error=f"Connection timed out after {timeout_seconds} seconds"
        )
    except Exception as e:
        error_type = type(e).__name__
        logger.error(f"Database health check failed: {error_type}")
        return DatabaseHealthResult(
            status="unhealthy",
            connected=False,
            error=f"Connection failed: {error_type}"
        )


async def get_full_health_status(
    timeout_seconds: float = DEFAULT_HEALTH_CHECK_TIMEOUT
) -> dict:
    """
    Get full application health status including database.

    Args:
        timeout_seconds: Timeout for database health check

    Returns:
        dict: Full health response per contracts/health-endpoint.yaml
    """
    db_health = await check_database_health(timeout_seconds)

    overall_status = "healthy" if db_health.status == "healthy" else "unhealthy"

    return {
        "status": overall_status,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "checks": {
            "database": db_health.to_dict()
        }
    }
