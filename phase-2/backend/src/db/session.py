"""
AsyncSession dependency for FastAPI.

This module provides database session management with:
- AsyncSession context manager
- FastAPI dependency injection helper
- Graceful error handling
"""

import logging
from typing import AsyncGenerator

from sqlalchemy.exc import OperationalError, SQLAlchemyError
from sqlmodel.ext.asyncio.session import AsyncSession

from src.models.base import get_engine

logger = logging.getLogger(__name__)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency that provides an AsyncSession.

    Usage:
        @app.get("/items")
        async def get_items(session: AsyncSession = Depends(get_session)):
            ...

    Yields:
        AsyncSession: Database session for the request

    Raises:
        SQLAlchemyError: If database connection fails (handled gracefully)
    """
    engine = get_engine()

    async with AsyncSession(engine) as session:
        try:
            yield session
            await session.commit()
        except OperationalError as e:
            await session.rollback()
            # Log error without exposing credentials
            logger.error(
                "Database connection error: Unable to connect to database. "
                "Please verify your DATABASE_URL configuration."
            )
            raise
        except SQLAlchemyError as e:
            await session.rollback()
            logger.error(f"Database error: {type(e).__name__}")
            raise
        except Exception as e:
            await session.rollback()
            logger.error(f"Unexpected error during database operation: {type(e).__name__}")
            raise


class DatabaseSessionManager:
    """
    Context manager for manual database session handling.

    Usage:
        async with DatabaseSessionManager() as session:
            result = await session.exec(select(User))
    """

    def __init__(self):
        self.engine = get_engine()
        self.session: AsyncSession | None = None

    async def __aenter__(self) -> AsyncSession:
        self.session = AsyncSession(self.engine)
        return self.session

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            if exc_type is not None:
                await self.session.rollback()
                # Log error without exposing sensitive details
                if exc_type == OperationalError:
                    logger.error(
                        "Database connection error during session. "
                        "Connection may have been lost."
                    )
                else:
                    logger.error(f"Database error: {exc_type.__name__}")
            else:
                await self.session.commit()
            await self.session.close()
