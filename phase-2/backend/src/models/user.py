"""
User model for the Todo application.

Represents an application user. Foundation for authentication (handled by Better Auth).
Per data-model.md specification.
"""

import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Column, Index, String
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .category import Category
    from .todo import Todo


class User(SQLModel, table=True):
    """
    User entity representing an application user.

    Attributes:
        id: UUID primary key
        email: Unique email address (max 255 chars)
        display_name: User's display name (max 100 chars)
        created_at: Timestamp when record was created
        updated_at: Timestamp when record was last updated
    """

    __tablename__ = "users"

    # Primary key
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        description="Unique identifier"
    )

    # Required fields
    email: str = Field(
        sa_column=Column(String(255), unique=True, nullable=False, index=True),
        description="User's email address"
    )
    display_name: str = Field(
        sa_column=Column(String(100), nullable=False),
        description="User's display name"
    )

    # Timestamps
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Record creation timestamp"
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_column_kwargs={"onupdate": lambda: datetime.now(timezone.utc)},
        description="Last update timestamp"
    )

    # Relationships
    categories: List["Category"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
    todos: List["Todo"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

    # Table indexes
    __table_args__ = (
        Index("idx_users_email", "email", unique=True),
    )


class UserCreate(SQLModel):
    """Schema for creating a new user."""

    email: str = Field(max_length=255, description="User's email address")
    display_name: str = Field(max_length=100, description="User's display name")


class UserRead(SQLModel):
    """Schema for reading user data."""

    id: uuid.UUID
    email: str
    display_name: str
    created_at: datetime
    updated_at: datetime


class UserUpdate(SQLModel):
    """Schema for updating user data."""

    email: Optional[str] = Field(default=None, max_length=255)
    display_name: Optional[str] = Field(default=None, max_length=100)
