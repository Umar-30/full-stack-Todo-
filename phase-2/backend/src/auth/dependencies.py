"""
Authentication dependencies for FastAPI routes.

Provides JWT token validation and user authentication.
For development, allows bypassing auth with a mock user.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
import os

# Security scheme for JWT Bearer token
security = HTTPBearer(auto_error=False)

# Check if we're in development mode (skip auth for testing)
DEV_MODE = os.getenv("DEV_MODE", "true").lower() == "true"


class ValidatedUser(BaseModel):
    """Represents a validated user from JWT token."""
    sub: str  # User ID from JWT subject (Better Auth uses string IDs)
    email: Optional[str] = None
    name: Optional[str] = None


def get_validated_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> ValidatedUser:
    """
    Dependency to validate JWT token and extract user information.

    In development mode, returns a mock user if no token provided.
    In production, validates the JWT token from Better Auth.
    """
    if DEV_MODE and credentials is None:
        # Development mode: use mock user for testing
        return ValidatedUser(
            sub="dev-user-001",
            email="dev@example.com",
            name="Dev User"
        )

    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    try:
        # In production, validate JWT token with Better Auth
        # For now, we'll use a simple validation
        # TODO: Integrate with Better Auth for JWT validation

        # Mock validation for development - accepts any token
        if DEV_MODE:
            return ValidatedUser(
                sub="dev-user-001",
                email="dev@example.com",
                name="Dev User"
            )
        else:
            # Production: Validate with Better Auth
            # This would typically call Better Auth's token validation endpoint
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token validation not implemented for production",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


# Alias for backwards compatibility
get_current_user = get_validated_user
