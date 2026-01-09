"""
Pytest configuration and fixtures for Todo backend tests.

This module provides:
- Test database configuration
- AsyncSession fixtures
- FastAPI test client fixtures
"""

import asyncio
from typing import AsyncGenerator, Generator

import pytest
import pytest_asyncio
from fastapi.testclient import TestClient
from httpx import ASGITransport, AsyncClient
from sqlmodel import SQLModel

# Note: These fixtures require a test database configuration
# Set TEST_DATABASE_URL environment variable for testing


@pytest.fixture(scope="session")
def event_loop() -> Generator[asyncio.AbstractEventLoop, None, None]:
    """Create an event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
def app():
    """Get the FastAPI application."""
    from src.main import app

    return app


@pytest.fixture
def client(app) -> Generator[TestClient, None, None]:
    """Create a synchronous test client."""
    with TestClient(app) as client:
        yield client


@pytest_asyncio.fixture
async def async_client(app) -> AsyncGenerator[AsyncClient, None]:
    """Create an async test client."""
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as client:
        yield client


# Database fixtures (require TEST_DATABASE_URL)
# Uncomment when setting up test database

# @pytest_asyncio.fixture(scope="function")
# async def db_session() -> AsyncGenerator[AsyncSession, None]:
#     """Create a database session for testing."""
#     from backend.src.db import get_session
#     async for session in get_session():
#         yield session
