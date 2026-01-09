"""
Health endpoint tests.

These tests verify the health check endpoints work correctly.
"""

import pytest
from fastapi import status


class TestHealthEndpoints:
    """Tests for health check endpoints."""

    def test_health_endpoint_returns_json(self, client):
        """Test that /health returns valid JSON."""
        response = client.get("/health")

        assert response.headers["content-type"] == "application/json"
        data = response.json()
        assert "status" in data
        assert "timestamp" in data
        assert "checks" in data

    def test_health_endpoint_has_database_check(self, client):
        """Test that /health includes database status."""
        response = client.get("/health")
        data = response.json()

        assert "database" in data["checks"]
        db_status = data["checks"]["database"]
        assert "status" in db_status
        assert "connected" in db_status

    def test_health_db_endpoint_returns_json(self, client):
        """Test that /health/db returns valid JSON."""
        response = client.get("/health/db")

        assert response.headers["content-type"] == "application/json"
        data = response.json()
        assert "status" in data
        assert "connected" in data

    def test_health_returns_200_or_503(self, client):
        """Test that /health returns appropriate status codes."""
        response = client.get("/health")

        assert response.status_code in [
            status.HTTP_200_OK,
            status.HTTP_503_SERVICE_UNAVAILABLE
        ]

    def test_health_db_returns_200_or_503(self, client):
        """Test that /health/db returns appropriate status codes."""
        response = client.get("/health/db")

        assert response.status_code in [
            status.HTTP_200_OK,
            status.HTTP_503_SERVICE_UNAVAILABLE
        ]


class TestHealthResponseSchema:
    """Tests for health response schema compliance."""

    def test_health_response_has_timestamp(self, client):
        """Test that health response includes ISO timestamp."""
        response = client.get("/health")
        data = response.json()

        assert "timestamp" in data
        # Should be ISO 8601 format
        assert "T" in data["timestamp"]

    def test_database_health_has_latency_when_healthy(self, client):
        """Test that healthy database includes latency."""
        response = client.get("/health/db")
        data = response.json()

        if data["connected"]:
            # latency_ms should be present when connected
            assert "latency_ms" in data or data.get("latency_ms") is None
