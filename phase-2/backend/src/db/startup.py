"""
Application startup database verification.

This module provides startup hooks that verify database
connectivity when the application initializes.
"""

import logging
from typing import Optional

from src.db.connection_test import test_connection_with_timeout
from src.models.base import close_db, get_engine, init_db

logger = logging.getLogger(__name__)


class DatabaseStartupError(Exception):
    """Raised when database fails to initialize on startup."""

    def __init__(self, message: str = "Database initialization failed"):
        self.message = message
        super().__init__(self.message)


async def verify_database_connection(
    timeout_seconds: float = 5.0,
    raise_on_failure: bool = True
) -> bool:
    """
    Verify database connection on application startup.

    Args:
        timeout_seconds: Maximum time to wait for connection
        raise_on_failure: If True, raise exception on failure

    Returns:
        bool: True if connection succeeded

    Raises:
        DatabaseStartupError: If connection fails and raise_on_failure is True
    """
    logger.info("Verifying database connection...")

    success, message = await test_connection_with_timeout(timeout_seconds)

    if success:
        logger.info(f"Database connection verified: {message}")
        return True
    else:
        logger.error(f"Database connection verification failed: {message}")
        if raise_on_failure:
            raise DatabaseStartupError(message)
        return False


async def startup_database(
    verify_connection: bool = True,
    create_tables: bool = False,
    connection_timeout: float = 5.0
) -> None:
    """
    Initialize database on application startup.

    This function should be called in FastAPI's startup event.

    Args:
        verify_connection: If True, verify connection before proceeding
        create_tables: If True, create all tables (for development)
        connection_timeout: Timeout for connection verification

    Example:
        @app.on_event("startup")
        async def on_startup():
            await startup_database()
    """
    logger.info("Starting database initialization...")

    # Verify connection first
    if verify_connection:
        await verify_database_connection(
            timeout_seconds=connection_timeout,
            raise_on_failure=True
        )

    # Optionally create tables (development only)
    if create_tables:
        logger.info("Creating database tables...")
        await init_db()
        logger.info("Database tables created")

    logger.info("Database initialization complete")


async def shutdown_database() -> None:
    """
    Clean up database connections on application shutdown.

    This function should be called in FastAPI's shutdown event.

    Example:
        @app.on_event("shutdown")
        async def on_shutdown():
            await shutdown_database()
    """
    logger.info("Shutting down database connections...")
    await close_db()
    logger.info("Database connections closed")


# FastAPI lifespan context manager (recommended for newer FastAPI versions)
from contextlib import asynccontextmanager
from typing import AsyncGenerator


@asynccontextmanager
async def database_lifespan(app) -> AsyncGenerator[None, None]:
    """
    Database lifespan context manager for FastAPI.

    Usage:
        app = FastAPI(lifespan=database_lifespan)
    """
    # Startup - create_tables=True to auto-create missing tables
    await startup_database(verify_connection=True, create_tables=True)
    yield
    # Shutdown
    await shutdown_database()
