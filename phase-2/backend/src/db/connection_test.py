"""
Database connection test utility.

This module provides a simple connection test function that
verifies database connectivity by executing a SELECT 1 query.
"""

import asyncio
import logging
from typing import Tuple

from sqlalchemy import text
from sqlmodel.ext.asyncio.session import AsyncSession

from src.models.base import get_engine

logger = logging.getLogger(__name__)


async def test_connection() -> Tuple[bool, str]:
    """
    Test database connection by executing a simple query.

    Returns:
        Tuple[bool, str]: (success, message)
            - success: True if connection succeeded
            - message: Descriptive message about the result

    Example:
        >>> import asyncio
        >>> success, message = asyncio.run(test_connection())
        >>> print(f"Connection {'succeeded' if success else 'failed'}: {message}")
    """
    try:
        engine = get_engine()

        async with AsyncSession(engine) as session:
            result = await session.exec(text("SELECT 1"))
            value = result.scalar()

            if value == 1:
                logger.info("Database connection test successful")
                return True, "Database connection successful (SELECT 1 = 1)"
            else:
                logger.warning(f"Unexpected result from SELECT 1: {value}")
                return False, f"Unexpected result from SELECT 1: {value}"

    except Exception as e:
        error_type = type(e).__name__
        # Don't expose connection details in error message
        logger.error(f"Database connection test failed: {error_type}")
        return False, f"Database connection failed: {error_type}"


async def test_connection_with_timeout(timeout_seconds: float = 5.0) -> Tuple[bool, str]:
    """
    Test database connection with a timeout.

    Args:
        timeout_seconds: Maximum time to wait for connection (default 5 seconds)

    Returns:
        Tuple[bool, str]: (success, message)
    """
    try:
        return await asyncio.wait_for(
            test_connection(),
            timeout=timeout_seconds
        )
    except asyncio.TimeoutError:
        logger.error(f"Database connection test timed out after {timeout_seconds}s")
        return False, f"Connection timed out after {timeout_seconds} seconds"


def run_connection_test() -> None:
    """
    CLI entry point to test database connection.

    Usage:
        python -m backend.src.db.connection_test
    """
    print("Testing database connection...")
    success, message = asyncio.run(test_connection_with_timeout())

    if success:
        print(f"SUCCESS: {message}")
    else:
        print(f"FAILED: {message}")
        exit(1)


if __name__ == "__main__":
    run_connection_test()
