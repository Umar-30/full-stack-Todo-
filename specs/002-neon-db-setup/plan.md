# Implementation Plan: Neon PostgreSQL Database Setup

**Branch**: `002-neon-db-setup` | **Date**: 2026-01-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-neon-db-setup/spec.md`

## Summary

Initialize the database layer using Neon Serverless PostgreSQL with async SQLModel ORM. This includes establishing secure database connections via asyncpg driver, defining core schema (Users, Todos, Categories), configuring Alembic for migrations, and implementing health check endpoints for monitoring.

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: FastAPI, SQLModel, asyncpg, Alembic, python-dotenv
**Storage**: Neon Serverless PostgreSQL (with PgBouncer connection pooling)
**Testing**: pytest, pytest-asyncio
**Target Platform**: Linux server (containerized deployment)
**Project Type**: Web application (frontend + backend)
**Performance Goals**: Connection within 5 seconds, health check <1 second, 100 concurrent operations
**Constraints**: SSL required, credentials never in logs, recovery from cold start <10 seconds
**Scale/Scope**: Multi-user application with user-level data isolation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-Driven Development | PASS | All code generated from specifications |
| II. Multi-User Task Isolation | PASS | Schema includes user_id FK on all user data |
| III. RESTful API Compliance | PASS | Health endpoints follow REST patterns |
| IV. JWT-Based Security | N/A | Authentication handled in separate feature |
| V. Technology Stack Adherence | PASS | Using SQLModel, Neon PostgreSQL as mandated |
| VI. Test-Driven Development | PENDING | Tests to be defined in tasks phase |
| VII. Separation of Concerns | PASS | Database layer isolated from API/frontend |
| VIII. Agent Architecture | PASS | Following spec-driven workflow |

**Post-Phase 1 Re-check**: All gates pass. Schema design enforces multi-user isolation.

## Project Structure

### Documentation (this feature)

```text
specs/002-neon-db-setup/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Technology research and decisions
├── data-model.md        # Entity definitions and relationships
├── quickstart.md        # Setup guide
├── contracts/           # Interface contracts
│   ├── database-interface.yaml
│   └── health-endpoint.yaml
├── checklists/
│   └── requirements.md  # Quality validation checklist
└── tasks.md             # Implementation tasks (created by /sp.tasks)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   ├── __init__.py
│   │   ├── base.py           # SQLModel base, engine configuration
│   │   ├── user.py           # User model
│   │   ├── category.py       # Category model
│   │   └── todo.py           # Todo model
│   ├── db/
│   │   ├── __init__.py
│   │   ├── session.py        # AsyncSession dependency
│   │   └── health.py         # Health check functions
│   └── api/
│       └── health.py         # Health check endpoints
├── alembic/
│   ├── env.py                # Alembic async configuration
│   ├── versions/             # Migration scripts
│   └── alembic.ini
├── tests/
│   ├── conftest.py           # Test fixtures
│   └── test_db/
│       ├── test_connection.py
│       ├── test_models.py
│       └── test_health.py
├── .env.example              # Environment template
└── requirements.txt          # Python dependencies

frontend/
└── (no changes for this feature)
```

**Structure Decision**: Web application structure selected per constitution. Backend handles database layer; frontend unchanged for this feature.

## Implementation Phases

### Phase 1: Environment & Dependencies

1. Create `.env.example` with `DATABASE_URL` template
2. Add dependencies to `requirements.txt`:
   - sqlmodel
   - asyncpg
   - alembic
   - python-dotenv
   - pytest-asyncio (dev)

### Phase 2: Database Connection

1. Create `backend/src/models/base.py`:
   - Async engine configuration with `create_async_engine`
   - Connection URL from environment
   - SSL mode enforcement
   - Pool configuration

2. Create `backend/src/db/session.py`:
   - `AsyncSession` context manager
   - FastAPI dependency injection helper

### Phase 3: Model Definitions

1. Create User model (`backend/src/models/user.py`)
2. Create Category model (`backend/src/models/category.py`)
3. Create Todo model (`backend/src/models/todo.py`)
4. Export all models in `backend/src/models/__init__.py`

### Phase 4: Migrations

1. Initialize Alembic with async support
2. Configure `alembic/env.py` for SQLModel metadata
3. Generate initial migration
4. Document migration commands in quickstart

### Phase 5: Health Check

1. Create `backend/src/db/health.py`:
   - `check_database_health()` function
   - Timeout handling
   - Connection status reporting

2. Create `backend/src/api/health.py`:
   - `GET /health` endpoint
   - `GET /health/db` endpoint

### Phase 6: Testing

1. Create test fixtures (`conftest.py`)
2. Test database connection
3. Test model creation
4. Test health endpoints

## Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Neon cold start latency | Medium | Medium | Use pooled connection, warmup on startup |
| Connection pool exhaustion | Low | High | Configure pool size, implement circuit breaker |
| Migration conflicts | Low | Medium | Version control migrations, review before apply |

## Artifacts Generated

- [x] research.md - Technology decisions
- [x] data-model.md - Entity definitions
- [x] quickstart.md - Setup guide
- [x] contracts/database-interface.yaml - Internal DB interface
- [x] contracts/health-endpoint.yaml - OpenAPI for health endpoints

## Next Steps

Run `/sp.tasks` to generate detailed implementation tasks with test cases.
