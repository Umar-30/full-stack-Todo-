# Data Model: Task Management REST API

**Feature**: 004-task-api
**Date**: 2026-01-09

## Entity: Task

### Description

Represents a to-do item owned by a specific user. Tasks are user-scoped - each user can only access their own tasks.

### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | Primary Key, Auto-generated | Unique task identifier |
| user_id | UUID | Required, Indexed, Foreign Key (logical) | Owner's ID from JWT |
| title | String(255) | Required, Non-empty | Task name |
| description | Text(2000) | Optional, Nullable | Detailed task description |
| is_completed | Boolean | Default: false | Completion status |
| created_at | DateTime | Auto-generated, UTC | When task was created |
| updated_at | DateTime | Auto-updated, UTC | Last modification time |

### SQLModel Definition

```python
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(index=True, nullable=False)
    title: str = Field(max_length=255, nullable=False)
    description: Optional[str] = Field(default=None, max_length=2000)
    is_completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### Indexes

| Index Name | Columns | Purpose |
|------------|---------|---------|
| ix_tasks_user_id | user_id | Fast lookup of user's tasks |
| pk_tasks | id | Primary key |

### Validation Rules

| Field | Rule | Error |
|-------|------|-------|
| title | Required, 1-255 chars | 422: "Title is required" |
| title | Non-empty after trim | 422: "Title cannot be empty" |
| description | Max 2000 chars | 422: "Description too long" |
| user_id | Must match JWT sub | 403: "Access denied" |

### State Transitions

```
                    ┌─────────────┐
    Create ────────►│ Incomplete  │
                    │ (default)   │
                    └──────┬──────┘
                           │
                    PATCH /complete
                           │
                           ▼
                    ┌─────────────┐
                    │  Completed  │
                    └──────┬──────┘
                           │
                    PATCH /complete (toggle)
                           │
                           ▼
                    ┌─────────────┐
                    │ Incomplete  │
                    └─────────────┘
```

## Entity: User (Reference Only)

User entity is managed by Better Auth. This API only references users via JWT tokens.

| Field | Source | Usage |
|-------|--------|-------|
| id (UUID) | JWT "sub" claim | task.user_id reference |
| email | JWT claims | Logging (optional) |

## Pydantic Schemas

### TaskCreate (Request)

```python
class TaskCreate(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=2000)
```

### TaskUpdate (Request)

```python
class TaskUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=2000)
    is_completed: Optional[bool] = None
```

### TaskResponse (Response)

```python
class TaskResponse(SQLModel):
    id: UUID
    user_id: UUID
    title: str
    description: Optional[str]
    is_completed: bool
    created_at: datetime
    updated_at: datetime
```

### TaskListResponse (Response)

```python
class TaskListResponse(SQLModel):
    tasks: List[TaskResponse]
    total: int
    limit: int
    offset: int
```

## Database Migration

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_tasks_user_id ON tasks(user_id);
```
