"""
Database error handling utilities.

This module provides error handling for common database exceptions:
- OperationalError: Connection failures
- IntegrityError: Constraint violations
- TimeoutError: Query timeouts

Per contracts/database-interface.yaml error handling specification.
"""

import asyncio
import logging
from functools import wraps
from typing import Any, Callable, TypeVar

from sqlalchemy.exc import IntegrityError, OperationalError, SQLAlchemyError

logger = logging.getLogger(__name__)

T = TypeVar("T")


class DatabaseConnectionError(Exception):
    """Raised when database connection fails."""

    def __init__(self, message: str = "Unable to connect to database"):
        self.message = message
        super().__init__(self.message)


class DatabaseIntegrityError(Exception):
    """Raised when a database constraint is violated."""

    def __init__(self, message: str = "Database constraint violation"):
        self.message = message
        super().__init__(self.message)


class DatabaseTimeoutError(Exception):
    """Raised when a database operation times out."""

    def __init__(self, message: str = "Database operation timed out"):
        self.message = message
        super().__init__(self.message)


def handle_db_errors(func: Callable[..., T]) -> Callable[..., T]:
    """
    Decorator to handle database errors with appropriate logging.

    Catches SQLAlchemy exceptions and converts them to application-specific
    exceptions with sanitized error messages (no credential exposure).

    Usage:
        @handle_db_errors
        async def get_user(session: AsyncSession, user_id: str):
            ...
    """

    @wraps(func)
    async def wrapper(*args: Any, **kwargs: Any) -> T:
        try:
            return await func(*args, **kwargs)
        except OperationalError as e:
            logger.error(
                "Database connection error: Unable to connect to database. "
                "Please verify your DATABASE_URL configuration."
            )
            raise DatabaseConnectionError() from e
        except IntegrityError as e:
            # Extract constraint name if available, but not the full error
            constraint_info = "constraint violation"
            if hasattr(e, "orig") and e.orig:
                # Try to get constraint name without exposing table/column details
                orig_str = str(e.orig)
                if "unique" in orig_str.lower():
                    constraint_info = "unique constraint violation"
                elif "foreign key" in orig_str.lower():
                    constraint_info = "foreign key constraint violation"
                elif "not null" in orig_str.lower():
                    constraint_info = "not null constraint violation"
                elif "check" in orig_str.lower():
                    constraint_info = "check constraint violation"

            logger.error(f"Database integrity error: {constraint_info}")
            raise DatabaseIntegrityError(constraint_info) from e
        except asyncio.TimeoutError as e:
            logger.error("Database operation timed out")
            raise DatabaseTimeoutError() from e
        except SQLAlchemyError as e:
            logger.error(f"Database error: {type(e).__name__}")
            raise

    return wrapper


async def execute_with_timeout(coro: Any, timeout_seconds: float = 5.0) -> Any:
    """
    Execute an async database operation with a timeout.

    Args:
        coro: The coroutine to execute
        timeout_seconds: Maximum time to wait (default 5 seconds)

    Returns:
        The result of the coroutine

    Raises:
        DatabaseTimeoutError: If the operation times out
    """
    try:
        return await asyncio.wait_for(coro, timeout=timeout_seconds)
    except asyncio.TimeoutError:
        logger.error(f"Database operation timed out after {timeout_seconds} seconds")
        raise DatabaseTimeoutError(
            f"Database operation timed out after {timeout_seconds} seconds"
        )
