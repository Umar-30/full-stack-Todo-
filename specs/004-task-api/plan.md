# Implementation Plan: Task Management REST API

**Branch**: `004-task-api` | **Date**: 2026-01-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-task-api/spec.md`

## Summary

Implement secure REST API endpoints for task CRUD operations using FastAPI + SQLModel, with JWT authentication via Better Auth JWKS validation. All endpoints follow constitution-defined patterns with user-scoped data isolation.

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: FastAPI, SQLModel, python-jose (JWT validation via JWKS)
**Storage**: Neon Serverless PostgreSQL (async via asyncpg)
**Testing**: pytest, pytest-asyncio, httpx (async test client)
**Target Platform**: Linux server / Docker container
**Project Type**: Web application (phase-2/backend)
**Performance Goals**: <500ms task creation, <300ms task list (up to 100 tasks)
**Constraints**: <200ms p95 for simple operations, user data isolation
**Scale/Scope**: Multi-user, pagination for large task lists (default 50, max 100)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Implementation |
|-----------|--------|----------------|
| I. Spec-Driven Development | ✅ PASS | All code from spec.md |
| II. Multi-User Task Isolation | ✅ PASS | user_id in path, validated against JWT |
| III. RESTful API Compliance | ✅ PASS | Standard HTTP methods, status codes, JSON |
| IV. JWT-Based Security | ✅ PASS | Better Auth JWKS validation (from 003-better-auth) |
| V. Technology Stack | ✅ PASS | FastAPI, SQLModel, Neon PostgreSQL |
| VI. Test-Driven Development | ✅ PASS | Tests before implementation |
| VII. Separation of Concerns | ✅ PASS | Backend API only, no frontend logic |
| VIII. Agent Architecture | ✅ PASS | Using backend-controller patterns |

**Gate Status**: PASS - No violations

## Project Structure

### Documentation (this feature)

```text
specs/004-task-api/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (OpenAPI)
│   └── openapi.yaml
└── tasks.md             # Phase 2 output (/sp.tasks)
```

### Source Code (phase-2/backend)

```text
phase-2/backend/
├── src/
│   ├── auth/                    # From 003-better-auth
│   │   ├── __init__.py
│   │   ├── jwt.py               # JWKS validation
│   │   └── dependencies.py      # get_current_user
│   ├── models/
│   │   ├── __init__.py
│   │   └── task.py              # Task SQLModel
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── task.py              # Pydantic schemas
│   ├── routers/
│   │   ├── __init__.py
│   │   └── tasks.py             # Task CRUD endpoints
│   ├── services/
│   │   ├── __init__.py
│   │   └── task_service.py      # Business logic
│   ├── db/
│   │   ├── __init__.py
│   │   └── database.py          # Async DB connection
│   └── main.py                  # FastAPI app
├── tests/
│   ├── __init__.py
│   ├── conftest.py              # Fixtures
│   └── test_tasks.py            # Task API tests
├── requirements.txt
└── .env
```

**Structure Decision**: Web application structure using phase-2/backend folder per constitution. Auth module already exists from 003-better-auth feature.

## Complexity Tracking

> No violations - standard CRUD API following constitution patterns.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | N/A | N/A |

## Implementation Phases

### Phase 1: Database Model
- Create Task SQLModel in `src/models/task.py`
- Run Alembic migration to create tasks table

### Phase 2: Pydantic Schemas
- TaskCreate, TaskUpdate, TaskResponse schemas
- Pagination schema for list responses

### Phase 3: Service Layer
- CRUD operations with user_id scoping
- Pagination logic

### Phase 4: Router/Endpoints
- Mount at `/api/{user_id}/tasks`
- Apply auth dependencies
- Validate user_id matches JWT

### Phase 5: Testing
- Unit tests for service layer
- Integration tests for endpoints
- Auth tests (401, 403 scenarios)
