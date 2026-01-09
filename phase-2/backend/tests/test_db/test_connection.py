"""
Database connection tests.

These tests verify database connectivity and configuration.
Requires DATABASE_URL environment variable to be set.
"""

import os

import pytest

# Skip all tests if DATABASE_URL not configured
pytestmark = pytest.mark.skipif(
    not os.getenv("DATABASE_URL"),
    reason="DATABASE_URL not configured"
)


class TestDatabaseConnection:
    """Tests for database connection functionality."""

    @pytest.mark.asyncio
    async def test_connection_success(self):
        """Test successful database connection."""
        from src.db import test_connection

        success, message = await test_connection()

        assert success is True
        assert "successful" in message.lower()

    @pytest.mark.asyncio
    async def test_connection_with_timeout(self):
        """Test connection with timeout."""
        from src.db import test_connection_with_timeout

        success, message = await test_connection_with_timeout(timeout_seconds=5.0)

        assert success is True

    @pytest.mark.asyncio
    async def test_get_engine_returns_engine(self):
        """Test that get_engine returns an AsyncEngine."""
        from sqlalchemy.ext.asyncio import AsyncEngine

        from src.models import get_engine

        engine = get_engine()

        assert isinstance(engine, AsyncEngine)

    @pytest.mark.asyncio
    async def test_database_url_validation(self):
        """Test that DATABASE_URL is properly validated."""
        from src.models import get_database_url

        url = get_database_url()

        assert url.startswith("postgresql+asyncpg://")
        assert "ssl=require" in url


class TestDatabaseUrlValidation:
    """Tests for DATABASE_URL validation logic."""

    def test_missing_database_url_raises_error(self, monkeypatch):
        """Test that missing DATABASE_URL raises ValueError."""
        monkeypatch.delenv("DATABASE_URL", raising=False)

        # Need to reset the engine singleton
        from src.models import base
        base._engine = None

        with pytest.raises(ValueError, match="DATABASE_URL.*not set"):
            from src.models.base import get_database_url
            get_database_url()
