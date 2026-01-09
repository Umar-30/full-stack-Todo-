# Data Model: Neon PostgreSQL Database Setup

**Feature**: 002-neon-db-setup
**Date**: 2026-01-08
**Status**: Draft

## Entity Overview

This document defines the core database schema for the Todo application. All entities support the multi-user isolation principle from the constitution.

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│      User       │       │    Category     │       │      Todo       │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │──┐    │ id (PK)         │──┐    │ id (PK)         │
│ email           │  │    │ name            │  │    │ title           │
│ display_name    │  │    │ color           │  │    │ description     │
│ created_at      │  │    │ icon            │  │    │ is_completed    │
│ updated_at      │  └───>│ user_id (FK)    │  └───>│ priority        │
└─────────────────┘       │ created_at      │       │ due_date        │
                          │ updated_at      │       │ user_id (FK)    │
                          └─────────────────┘       │ category_id (FK)│
                                                    │ created_at      │
                                                    │ updated_at      │
                                                    └─────────────────┘
```

## Entity Definitions

### User

Represents an application user. Foundation for authentication (handled by Better Auth).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User's email address |
| display_name | VARCHAR(100) | NOT NULL | User's display name |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes**:
- `idx_users_email` on `email` (unique)

**Validation Rules**:
- Email must be valid email format
- Display name must be 1-100 characters

### Category

Represents a grouping mechanism for organizing todos.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| name | VARCHAR(50) | NOT NULL | Category name |
| color | VARCHAR(7) | DEFAULT '#6B7280' | Hex color code for UI |
| icon | VARCHAR(50) | DEFAULT NULL | Optional icon identifier |
| user_id | UUID | FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE, NOT NULL | Owner reference |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes**:
- `idx_categories_user_id` on `user_id`
- `idx_categories_user_name` on `(user_id, name)` (unique per user)

**Validation Rules**:
- Name must be 1-50 characters
- Color must be valid hex format (#RRGGBB)
- User can have unique category names only

### Todo

Represents a task item in the todo application.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| title | VARCHAR(200) | NOT NULL | Task title |
| description | TEXT | DEFAULT NULL | Optional detailed description |
| is_completed | BOOLEAN | NOT NULL, DEFAULT FALSE | Completion status |
| priority | SMALLINT | NOT NULL, DEFAULT 2, CHECK (priority BETWEEN 1 AND 4) | Priority level (1=urgent, 2=high, 3=medium, 4=low) |
| due_date | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | Optional due date |
| user_id | UUID | FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE, NOT NULL | Owner reference |
| category_id | UUID | FOREIGN KEY REFERENCES categories(id) ON DELETE SET NULL, DEFAULT NULL | Optional category reference |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Indexes**:
- `idx_todos_user_id` on `user_id`
- `idx_todos_user_completed` on `(user_id, is_completed)`
- `idx_todos_user_due_date` on `(user_id, due_date)` WHERE `due_date IS NOT NULL`
- `idx_todos_user_priority` on `(user_id, priority)`
- `idx_todos_category_id` on `category_id`

**Validation Rules**:
- Title must be 1-200 characters
- Priority must be 1-4
- Due date must be in the future (application-level validation)

## Relationships

| Relationship | Type | Description |
|--------------|------|-------------|
| User → Category | One-to-Many | A user can have many categories |
| User → Todo | One-to-Many | A user can have many todos |
| Category → Todo | One-to-Many | A category can contain many todos |

## State Transitions

### Todo Completion States

```
┌──────────────────┐
│   is_completed   │
│      FALSE       │
└────────┬─────────┘
         │ Toggle complete
         ▼
┌──────────────────┐
│   is_completed   │
│      TRUE        │
└────────┬─────────┘
         │ Toggle incomplete
         ▼
┌──────────────────┐
│   is_completed   │
│      FALSE       │
└──────────────────┘
```

## Priority Levels

| Value | Name | Description |
|-------|------|-------------|
| 1 | Urgent | Requires immediate attention |
| 2 | High | Important, should be done soon |
| 3 | Medium | Normal priority |
| 4 | Low | Can be done when time permits |

## Data Isolation

Per Constitution Principle II (Multi-User Task Isolation):

- All queries MUST filter by `user_id`
- No cross-user data access permitted
- Foreign key `user_id` on todos and categories enforces ownership
- CASCADE delete ensures data cleanup when user is removed

## Migration Strategy

1. **Initial Migration**: Create all tables with constraints and indexes
2. **Future Migrations**: Use Alembic for schema evolution
3. **Rollback Support**: Each migration must have corresponding downgrade

## SQLModel Implementation Notes

- Use `Field(default_factory=uuid.uuid4)` for UUID primary keys
- Use `Optional[field_type]` for nullable fields
- Use `Relationship()` for ORM relationships
- Use `sa_column` for PostgreSQL-specific column options
