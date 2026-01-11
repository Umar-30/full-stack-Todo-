"""
Task model for the Task Management API.

Represents a task item in the task management system.
Per data-model.md specification.
"""

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel
from sqlmodel import Field, SQLModel


class Task(SQLModel, table=True):
    """
    Task entity representing a to-do item owned by a user.

    Attributes:
        id: UUID primary key
        user_id: Owner user ID (from JWT)
        title: Task title (required, max 255 chars)
        description: Optional detailed description (max 2000 chars)
        is_completed: Completion status (default False)
        created_at: Timestamp when record was created
        updated_at: Timestamp when record was last updated
    """

    __tablename__ = "tasks"

    # Primary key
    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        primary_key=True,
        description="Unique identifier"
    )

    # Required fields - Better Auth uses string IDs
    user_id: str = Field(
        description="Owner user ID from JWT (string format)"
    )

    title: str = Field(
        min_length=1,
        max_length=255,
        description="Task title (required, 1-255 chars)"
    )

    # Optional fields
    description: Optional[str] = Field(
        default=None,
        max_length=2000,
        description="Optional detailed description (max 2000 chars)"
    )

    # Status field with default
    is_completed: bool = Field(
        default=False,
        description="Completion status (default False)"
    )

    # Timestamps (naive UTC - no timezone info for PostgreSQL compatibility)
    created_at: datetime = Field(
        default_factory=lambda: datetime.utcnow(),
        description="Record creation timestamp"
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.utcnow(),
        description="Last update timestamp"
    )


class TaskCreate(SQLModel):
    """Schema for creating a new task."""

    title: str = Field(min_length=1, max_length=255, description="Task title (required)")
    description: Optional[str] = Field(default=None, max_length=2000, description="Task description (optional)")


class TaskUpdate(SQLModel):
    """Schema for updating task data."""

    title: Optional[str] = Field(default=None, min_length=1, max_length=255, description="Task title (optional)")
    description: Optional[str] = Field(default=None, max_length=2000, description="Task description (optional)")
    is_completed: Optional[bool] = Field(default=None, description="Completion status (optional)")


class TaskResponse(BaseModel):
    """Schema for reading task data."""

    id: uuid.UUID
    user_id: str  # Better Auth uses string IDs
    title: str
    description: Optional[str]
    is_completed: bool
    created_at: datetime
    updated_at: datetime