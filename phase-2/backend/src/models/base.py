"""
Database engine configuration for Neon PostgreSQL.

This module provides async engine configuration with:
- SSL enforcement (sslmode=require)
- Connection pooling (pool_size=5, max_overflow=10)
- Pool pre-ping for connection health
"""

import os
from functools import lru_cache
from typing import Optional

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine
from sqlmodel import SQLModel

# Load environment variables
load_dotenv()

# Engine instance (singleton)
_engine: Optional[AsyncEngine] = None


def get_database_url() -> str:
    """
    Get database URL from environment with validation.

    Returns:
        str: The database connection URL

    Raises:
        ValueError: If DATABASE_URL is not set or invalid
    """
    database_url = os.getenv("DATABASE_URL")

    if not database_url:
        raise ValueError(
            "DATABASE_URL environment variable is not set. "
            "Please set it in your .env file or environment."
        )

    # Ensure we're using asyncpg driver
    if not database_url.startswith("postgresql+asyncpg://"):
        if database_url.startswith("postgresql://"):
            database_url = database_url.replace(
                "postgresql://", "postgresql+asyncpg://", 1
            )
        else:
            raise ValueError(
                "DATABASE_URL must be a PostgreSQL connection string. "
                "Expected format: postgresql+asyncpg://user:pass@host/db"
            )

    # Convert sslmode to ssl for asyncpg compatibility
    # asyncpg uses 'ssl' parameter, not 'sslmode'
    if "sslmode=" in database_url:
        database_url = database_url.replace("sslmode=require", "ssl=require")
        database_url = database_url.replace("sslmode=verify-full", "ssl=require")
        database_url = database_url.replace("sslmode=verify-ca", "ssl=require")
    elif "ssl=" not in database_url:
        # Ensure SSL is required (Neon requirement)
        separator = "&" if "?" in database_url else "?"
        database_url = f"{database_url}{separator}ssl=require"

    return database_url


def get_engine() -> AsyncEngine:
    """
    Get or create the async database engine (singleton).

    Configuration per contracts/database-interface.yaml:
    - pool_size: 5
    - max_overflow: 10
    - pool_pre_ping: True (validates connections before use)
    - echo: True in development, False in production

    Returns:
        AsyncEngine: The configured async database engine
    """
    global _engine

    if _engine is None:
        database_url = get_database_url()

        # Determine if we're in development mode
        is_development = os.getenv("ENVIRONMENT", "development").lower() == "development"

        _engine = create_async_engine(
            database_url,
            echo=is_development,  # Log SQL in development only
            pool_size=5,
            max_overflow=10,
            pool_pre_ping=True,  # Verify connections before use
        )

    return _engine


async def init_db() -> None:
    """
    Initialize database tables.

    This creates all tables defined in SQLModel metadata.
    Should be called on application startup after all models are imported.
    """
    engine = get_engine()
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def close_db() -> None:
    """
    Close database connections.

    Should be called on application shutdown to properly
    release all database connections.
    """
    global _engine

    if _engine is not None:
        await _engine.dispose()
        _engine = None
