"""
Todo model for the Todo application.

Represents a task item in the todo application.
Per data-model.md specification.
"""

import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING, Optional

from sqlalchemy import CheckConstraint, Column, ForeignKey, Index, SmallInteger, String, Text
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .category import Category
    from .user import User


class Todo(SQLModel, table=True):
    """
    Todo entity representing a task item.

    Attributes:
        id: UUID primary key
        title: Task title (max 200 chars)
        description: Optional detailed description
        is_completed: Completion status (default False)
        priority: Priority level 1-4 (1=urgent, 2=high, 3=medium, 4=low)
        due_date: Optional due date
        user_id: Foreign key to users table (CASCADE delete)
        category_id: Optional foreign key to categories (SET NULL on delete)
        created_at: Timestamp when record was created
        updated_at: Timestamp when record was last updated
    """

    __tablename__ = "todos"

    # Primary key
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        description="Unique identifier"
    )

    # Required fields
    title: str = Field(
        sa_column=Column(String(200), nullable=False),
        description="Task title"
    )

    # Optional fields
    description: Optional[str] = Field(
        default=None,
        sa_column=Column(Text, nullable=True),
        description="Optional detailed description"
    )

    # Status fields with defaults
    is_completed: bool = Field(
        default=False,
        description="Completion status"
    )
    priority: int = Field(
        default=2,
        sa_column=Column(SmallInteger, nullable=False, default=2),
        description="Priority level (1=urgent, 2=high, 3=medium, 4=low)"
    )

    # Optional due date
    due_date: Optional[datetime] = Field(
        default=None,
        description="Optional due date"
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

    # Foreign key - SET NULL when category is deleted
    category_id: Optional[uuid.UUID] = Field(
        default=None,
        sa_column=Column(
            ForeignKey("categories.id", ondelete="SET NULL"),
            nullable=True,
            index=True
        ),
        description="Optional category reference"
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
    user: "User" = Relationship(back_populates="todos")
    category: Optional["Category"] = Relationship(back_populates="todos")

    # Table constraints and indexes
    __table_args__ = (
        CheckConstraint("priority >= 1 AND priority <= 4", name="check_priority_range"),
        Index("idx_todos_user_id", "user_id"),
        Index("idx_todos_user_completed", "user_id", "is_completed"),
        Index("idx_todos_user_priority", "user_id", "priority"),
        Index("idx_todos_category_id", "category_id"),
        # Partial index for due_date (only non-null values)
        Index(
            "idx_todos_user_due_date",
            "user_id",
            "due_date",
            postgresql_where="due_date IS NOT NULL"
        ),
    )


class TodoCreate(SQLModel):
    """Schema for creating a new todo."""

    title: str = Field(max_length=200, description="Task title")
    description: Optional[str] = Field(default=None, description="Detailed description")
    priority: int = Field(default=2, ge=1, le=4, description="Priority (1-4)")
    due_date: Optional[datetime] = Field(default=None, description="Due date")
    category_id: Optional[uuid.UUID] = Field(default=None, description="Category ID")


class TodoRead(SQLModel):
    """Schema for reading todo data."""

    id: uuid.UUID
    title: str
    description: Optional[str]
    is_completed: bool
    priority: int
    due_date: Optional[datetime]
    user_id: uuid.UUID
    category_id: Optional[uuid.UUID]
    created_at: datetime
    updated_at: datetime


class TodoUpdate(SQLModel):
    """Schema for updating todo data."""

    title: Optional[str] = Field(default=None, max_length=200)
    description: Optional[str] = Field(default=None)
    is_completed: Optional[bool] = Field(default=None)
    priority: Optional[int] = Field(default=None, ge=1, le=4)
    due_date: Optional[datetime] = Field(default=None)
    category_id: Optional[uuid.UUID] = Field(default=None)
