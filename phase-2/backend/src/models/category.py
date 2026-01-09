"""
Category model for the Todo application.

Represents a grouping mechanism for organizing todos.
Per data-model.md specification.
"""

import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import Column, ForeignKey, Index, String
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .todo import Todo
    from .user import User


class Category(SQLModel, table=True):
    """
    Category entity representing a grouping for todos.

    Attributes:
        id: UUID primary key
        name: Category name (max 50 chars)
        color: Hex color code for UI (default #6B7280)
        icon: Optional icon identifier (max 50 chars)
        user_id: Foreign key to users table (CASCADE delete)
        created_at: Timestamp when record was created
        updated_at: Timestamp when record was last updated
    """

    __tablename__ = "categories"

    # Primary key
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        description="Unique identifier"
    )

    # Required fields
    name: str = Field(
        sa_column=Column(String(50), nullable=False),
        description="Category name"
    )

    # Optional fields with defaults
    color: str = Field(
        default="#6B7280",
        sa_column=Column(String(7), default="#6B7280"),
        description="Hex color code for UI"
    )
    icon: Optional[str] = Field(
        default=None,
        sa_column=Column(String(50), nullable=True),
        description="Optional icon identifier"
    )

    # Foreign key - CASCADE delete when user is deleted
    user_id: uuid.UUID = Field(
        sa_column=Column(
            ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
            index=True
        ),
        description="Owner user reference"
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
    user: "User" = Relationship(back_populates="categories")
    todos: List["Todo"] = Relationship(
        back_populates="category",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )

    # Table indexes
    __table_args__ = (
        Index("idx_categories_user_id", "user_id"),
        Index("idx_categories_user_name", "user_id", "name", unique=True),
    )


class CategoryCreate(SQLModel):
    """Schema for creating a new category."""

    name: str = Field(max_length=50, description="Category name")
    color: Optional[str] = Field(default="#6B7280", max_length=7, description="Hex color code")
    icon: Optional[str] = Field(default=None, max_length=50, description="Icon identifier")


class CategoryRead(SQLModel):
    """Schema for reading category data."""

    id: uuid.UUID
    name: str
    color: str
    icon: Optional[str]
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class CategoryUpdate(SQLModel):
    """Schema for updating category data."""

    name: Optional[str] = Field(default=None, max_length=50)
    color: Optional[str] = Field(default=None, max_length=7)
    icon: Optional[str] = Field(default=None, max_length=50)
