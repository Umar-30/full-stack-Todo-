"""
Migration runner utility for programmatic migration execution.

This module provides functions to run Alembic migrations
programmatically from Python code.
"""

import logging
import os
import sys
from pathlib import Path

from alembic import command
from alembic.config import Config

logger = logging.getLogger(__name__)

# Get the backend directory path
BACKEND_DIR = Path(__file__).parent.parent.parent
ALEMBIC_INI = BACKEND_DIR / "alembic.ini"
ALEMBIC_DIR = BACKEND_DIR / "alembic"


def get_alembic_config() -> Config:
    """
    Get Alembic configuration.

    Returns:
        Config: Alembic configuration object
    """
    if not ALEMBIC_INI.exists():
        raise FileNotFoundError(f"Alembic config not found at {ALEMBIC_INI}")

    config = Config(str(ALEMBIC_INI))
    config.set_main_option("script_location", str(ALEMBIC_DIR))

    return config


def run_upgrade(revision: str = "head") -> None:
    """
    Run database migrations up to a specific revision.

    Args:
        revision: Target revision (default "head" for latest)

    Example:
        run_upgrade()  # Upgrade to latest
        run_upgrade("abc123")  # Upgrade to specific revision
    """
    logger.info(f"Running migration upgrade to {revision}")
    config = get_alembic_config()
    command.upgrade(config, revision)
    logger.info("Migration upgrade complete")


def run_downgrade(revision: str = "-1") -> None:
    """
    Downgrade database by reverting migrations.

    Args:
        revision: Target revision (default "-1" for one step back)

    Example:
        run_downgrade()  # Revert one migration
        run_downgrade("-2")  # Revert two migrations
        run_downgrade("base")  # Revert all migrations
    """
    logger.info(f"Running migration downgrade to {revision}")
    config = get_alembic_config()
    command.downgrade(config, revision)
    logger.info("Migration downgrade complete")


def get_current_revision() -> str | None:
    """
    Get the current database revision.

    Returns:
        str | None: Current revision hash or None if no migrations applied
    """
    from alembic.runtime.migration import MigrationContext
    from sqlalchemy import create_engine

    from src.models.base import get_database_url

    # Use sync engine for revision check
    url = get_database_url().replace("postgresql+asyncpg://", "postgresql://")
    engine = create_engine(url)

    with engine.connect() as conn:
        context = MigrationContext.configure(conn)
        return context.get_current_revision()


def show_history() -> None:
    """Display migration history."""
    config = get_alembic_config()
    command.history(config)


def show_current() -> None:
    """Display current revision."""
    config = get_alembic_config()
    command.current(config)


def create_migration(message: str, autogenerate: bool = True) -> None:
    """
    Create a new migration revision.

    Args:
        message: Migration message/description
        autogenerate: If True, auto-detect changes from models

    Example:
        create_migration("Add user preferences table")
    """
    logger.info(f"Creating migration: {message}")
    config = get_alembic_config()
    command.revision(config, message=message, autogenerate=autogenerate)
    logger.info("Migration created")


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Database migration utility")
    subparsers = parser.add_subparsers(dest="command", help="Command to run")

    # Upgrade command
    upgrade_parser = subparsers.add_parser("upgrade", help="Run migrations")
    upgrade_parser.add_argument(
        "revision", nargs="?", default="head", help="Target revision"
    )

    # Downgrade command
    downgrade_parser = subparsers.add_parser("downgrade", help="Revert migrations")
    downgrade_parser.add_argument(
        "revision", nargs="?", default="-1", help="Target revision"
    )

    # History command
    subparsers.add_parser("history", help="Show migration history")

    # Current command
    subparsers.add_parser("current", help="Show current revision")

    # Create command
    create_parser = subparsers.add_parser("create", help="Create new migration")
    create_parser.add_argument("message", help="Migration message")
    create_parser.add_argument(
        "--no-autogenerate", action="store_true", help="Don't autogenerate"
    )

    args = parser.parse_args()

    if args.command == "upgrade":
        run_upgrade(args.revision)
    elif args.command == "downgrade":
        run_downgrade(args.revision)
    elif args.command == "history":
        show_history()
    elif args.command == "current":
        show_current()
    elif args.command == "create":
        create_migration(args.message, autogenerate=not args.no_autogenerate)
    else:
        parser.print_help()
