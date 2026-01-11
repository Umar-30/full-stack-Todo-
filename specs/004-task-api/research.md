# Research: Task Management REST API

**Feature**: 004-task-api
**Date**: 2026-01-09

## Overview

No major unknowns - this feature uses established patterns from constitution and existing codebase (003-better-auth).

## Decisions

### 1. Database Model Pattern

**Decision**: Use SQLModel with async session

**Rationale**:
- Constitution mandates SQLModel as ORM
- Existing backend setup uses asyncpg for async operations
- SQLModel integrates Pydantic validation with SQLAlchemy ORM

**Alternatives Considered**:
- Raw SQLAlchemy: Rejected - constitution mandates SQLModel
- Sync sessions: Rejected - performance degradation with Neon serverless

### 2. UUID vs Integer IDs

**Decision**: Use UUID for task IDs

**Rationale**:
- Spec requires UUID format (FR-005)
- Better security - IDs not guessable/sequential
- Compatible with Better Auth user IDs (also UUIDs)

**Alternatives Considered**:
- Auto-increment integers: Rejected - sequential IDs reveal data patterns

### 3. Pagination Strategy

**Decision**: Offset-based pagination with limit/skip

**Rationale**:
- Simple to implement
- Spec defines default 50, max 100 items
- Sufficient for expected scale (not millions of tasks per user)

**Alternatives Considered**:
- Cursor-based pagination: Rejected - over-engineering for current scale
- No pagination: Rejected - spec requires pagination (FR-013)

### 4. Error Response Format

**Decision**: Consistent JSON error format

```json
{
  "detail": "Error message",
  "status_code": 422,
  "errors": [
    {"field": "title", "message": "Field required"}
  ]
}
```

**Rationale**:
- FastAPI default format for HTTPException
- Spec requires consistent JSON responses (FR-012)
- Frontend can parse predictably

**Alternatives Considered**:
- Custom error schema: Rejected - FastAPI default is sufficient

### 5. Service Layer Pattern

**Decision**: Thin service layer with repository pattern

**Rationale**:
- Separation of concerns (constitution principle VII)
- Testable business logic
- Easy to mock for unit tests

**Alternatives Considered**:
- Direct DB access in routers: Rejected - violates separation of concerns
- Heavy domain layer: Rejected - over-engineering for CRUD

### 6. Auth Integration

**Decision**: Reuse auth module from 003-better-auth

**Rationale**:
- JWT validation already implemented
- JWKS caching in place
- Dependencies (get_current_user, validate_user_access) ready

**Alternatives Considered**:
- Duplicate auth code: Rejected - DRY principle violation
- Different auth mechanism: Rejected - constitution mandates Better Auth

## Dependencies

| Dependency | Purpose | Already Installed |
|------------|---------|-------------------|
| FastAPI | Web framework | Yes |
| SQLModel | ORM | Yes |
| asyncpg | Async PostgreSQL | Yes |
| python-jose | JWT validation | Yes (003-better-auth) |
| httpx | Async HTTP client | Yes |
| pytest | Testing | Yes |
| pytest-asyncio | Async tests | Yes |

## No NEEDS CLARIFICATION

All requirements are clear from spec and constitution. Ready for Phase 1.
