"""
Database utilities package.

This module provides:
- session: AsyncSession dependency for FastAPI
- health: Database health check functions
- errors: Database error handling utilities
- startup: Application startup/shutdown hooks
- connection_test: Connection verification utility
- migrate: Migration runner utility
"""

from .connection_test import run_connection_test, test_connection, test_connection_with_timeout
from .errors import (
    DatabaseConnectionError,
    DatabaseIntegrityError,
    DatabaseTimeoutError,
    execute_with_timeout,
    handle_db_errors,
)
from .health import (
    DatabaseHealthResult,
    check_database_health,
    get_full_health_status,
)
from .session import DatabaseSessionManager, get_session
from .startup import (
    DatabaseStartupError,
    database_lifespan,
    shutdown_database,
    startup_database,
    verify_database_connection,
)

__all__ = [
    # Session management
    "get_session",
    "DatabaseSessionManager",
    # Health check
    "check_database_health",
    "get_full_health_status",
    "DatabaseHealthResult",
    # Error handling
    "handle_db_errors",
    "execute_with_timeout",
    "DatabaseConnectionError",
    "DatabaseIntegrityError",
    "DatabaseTimeoutError",
    # Startup/Shutdown
    "startup_database",
    "shutdown_database",
    "verify_database_connection",
    "database_lifespan",
    "DatabaseStartupError",
    # Connection test
    "test_connection",
    "test_connection_with_timeout",
    "run_connection_test",
]
