"""
Task schemas for the Task Management API.

Pydantic schemas for task validation and serialization.
Per data-model.md specification.
"""

from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel


class TaskCreate(BaseModel):
    """Schema for creating a new task."""

    title: str
    description: Optional[str] = None


class TaskUpdate(BaseModel):
    """Schema for updating task data."""

    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None


class TaskResponse(BaseModel):
    """Schema for reading task data."""

    id: UUID
    user_id: str  # Better Auth uses string IDs
    title: str
    description: Optional[str]
    is_completed: bool
    created_at: datetime
    updated_at: datetime


class TaskListResponse(BaseModel):
    """Schema for reading task list data."""

    tasks: List[TaskResponse]
    total: int
    limit: int
    offset: int