# Tasks: Neon PostgreSQL Database Setup

**Input**: Design documents from `/specs/002-neon-db-setup/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/database-interface.yaml, contracts/health-endpoint.yaml

**Tests**: Not explicitly requested in spec - tests included as optional verification tasks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app structure**: `backend/src/`, `backend/tests/`
- Based on plan.md project structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, and environment configuration

- [x] T001 Create backend directory structure per plan.md at backend/src/models/, backend/src/db/, backend/src/api/
- [x] T002 [P] Create backend/requirements.txt with sqlmodel, asyncpg, alembic, python-dotenv, fastapi, uvicorn
- [x] T003 [P] Create backend/.env.example with DATABASE_URL template per contracts/database-interface.yaml
- [x] T004 [P] Create backend/src/__init__.py package initialization
- [x] T005 [P] Create backend/src/models/__init__.py package initialization
- [x] T006 [P] Create backend/src/db/__init__.py package initialization
- [x] T007 [P] Create backend/src/api/__init__.py package initialization

**Checkpoint**: Project structure ready for implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core database infrastructure that MUST be complete before user stories

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Create async engine configuration in backend/src/models/base.py with create_async_engine, SSL enforcement, pool settings per contracts/database-interface.yaml
- [x] T009 Create AsyncSession dependency helper in backend/src/db/session.py with get_session() generator for FastAPI dependency injection
- [x] T010 Create error handling utilities in backend/src/db/errors.py for OperationalError, IntegrityError, TimeoutError per contracts
- [x] T011 Initialize Alembic with async support: run alembic init backend/alembic
- [x] T012 Configure backend/alembic/env.py for async SQLModel metadata and environment-based DATABASE_URL

**Checkpoint**: Database connection foundation ready - user story implementation can begin

---

## Phase 3: User Story 1 - Developer Connects to Database (Priority: P1)

**Goal**: Establish secure connection to Neon PostgreSQL so the application can read and write data

**Independent Test**: Run connection test script executing `SELECT 1` query to verify database connectivity

### Implementation for User Story 1

- [x] T013 [US1] Implement get_engine() function in backend/src/models/base.py that reads DATABASE_URL from environment with validation
- [x] T014 [US1] Add SSL mode enforcement (sslmode=require) in connection string parsing in backend/src/models/base.py
- [x] T015 [US1] Implement connection pool configuration (pool_size=5, max_overflow=10, pool_pre_ping=True) in backend/src/models/base.py
- [x] T016 [US1] Create connection test utility in backend/src/db/connection_test.py with async test_connection() function
- [x] T017 [US1] Add graceful error handling for invalid/missing credentials with clear error messages (no credential exposure) in backend/src/db/session.py
- [x] T018 [US1] Create startup connection verification in backend/src/db/startup.py that validates connection on app init

**Verification for US1**:
```bash
# Test connection independently:
python -c "from backend.src.db.connection_test import test_connection; import asyncio; asyncio.run(test_connection())"
```

**Checkpoint**: Database connection is established within 5 seconds, SSL enabled, credentials protected

---

## Phase 4: User Story 2 - Schema Initialization (Priority: P1)

**Goal**: Initialize database schema with core tables (Users, Todos, Categories) for data persistence

**Independent Test**: Run migration and verify all tables exist with correct columns and constraints

### Implementation for User Story 2

- [x] T019 [P] [US2] Create User model in backend/src/models/user.py with UUID id, email, display_name, timestamps per data-model.md
- [x] T020 [P] [US2] Create Category model in backend/src/models/category.py with UUID id, name, color, icon, user_id FK, timestamps per data-model.md
- [x] T021 [P] [US2] Create Todo model in backend/src/models/todo.py with all fields, user_id FK, category_id FK, constraints per data-model.md
- [x] T022 [US2] Export all models in backend/src/models/__init__.py (User, Category, Todo, engine)
- [x] T023 [US2] Create initial Alembic migration: alembic revision --autogenerate -m "Initial schema: users, categories, todos"
- [x] T024 [US2] Add indexes per data-model.md: idx_users_email, idx_categories_user_id, idx_todos_user_id, composite indexes
- [x] T025 [US2] Add CHECK constraints for priority (1-4) in Todo model
- [x] T026 [US2] Add ON DELETE CASCADE for user_id FKs, ON DELETE SET NULL for category_id FK in models
- [x] T027 [US2] Create migration runner utility in backend/src/db/migrate.py for programmatic migration execution

**Verification for US2**:
```bash
# Run migration and verify tables:
alembic upgrade head
# Then verify with psql or Python script that users, categories, todos tables exist
```

**Checkpoint**: All schema tables created with zero errors, idempotent re-runs work correctly

---

## Phase 5: User Story 3 - Connection Health Verification (Priority: P2)

**Goal**: Provide health check mechanism to verify database connectivity for monitoring

**Independent Test**: Hit /health and /health/db endpoints and verify correct response format

### Implementation for User Story 3

- [x] T028 [US3] Create health check function check_database_health() in backend/src/db/health.py with SELECT 1 query and timeout
- [x] T029 [US3] Implement DatabaseHealthResponse schema in backend/src/api/schemas/health.py per contracts/health-endpoint.yaml
- [x] T030 [US3] Implement HealthResponse schema with timestamp and checks.database in backend/src/api/schemas/health.py
- [x] T031 [US3] Create GET /health endpoint in backend/src/api/health.py returning overall application health
- [x] T032 [US3] Create GET /health/db endpoint in backend/src/api/health.py returning database-only health
- [x] T033 [US3] Add latency measurement (latency_ms) in health check response
- [x] T034 [US3] Implement proper HTTP status codes: 200 for healthy, 503 for unhealthy
- [x] T035 [US3] Add timeout handling (1 second) for health check queries with appropriate error response
- [x] T036 [US3] Register health router in backend/src/api/__init__.py or main app

**Verification for US3**:
```bash
# Start server and test health endpoints:
curl http://localhost:8000/health
curl http://localhost:8000/health/db
# Verify JSON response matches contracts/health-endpoint.yaml schema
```

**Checkpoint**: Health check responds within 1 second, correct status codes returned

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, validation, and final touches

- [x] T037 [P] Update backend/.env.example with complete environment variable documentation
- [x] T038 [P] Create backend/README.md with setup instructions referencing specs/002-neon-db-setup/quickstart.md
- [x] T039 Validate all models match data-model.md entity definitions exactly
- [x] T040 Verify connection string never appears in logs (SC-005 compliance check)
- [x] T041 Run quickstart.md validation: execute all setup steps and verify they work
- [x] T042 Create backend/tests/conftest.py with test database fixtures (optional)
- [x] T043 [P] Create backend/tests/test_db/test_connection.py with connection verification tests (optional)
- [x] T044 [P] Create backend/tests/test_db/test_health.py with health endpoint tests (optional)

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup
    ↓
Phase 2: Foundational (BLOCKS all user stories)
    ↓
┌───────────────────────────────────────┐
│  After Phase 2, stories can proceed:  │
│                                       │
│  Phase 3: US1 (Connection) ─┐         │
│                             │         │
│  Phase 4: US2 (Schema) ─────┼─→ US2 depends on US1 engine │
│                             │         │
│  Phase 5: US3 (Health) ─────┴─→ US3 depends on US1 connection │
└───────────────────────────────────────┘
    ↓
Phase 6: Polish (after desired stories complete)
```

### User Story Dependencies

| Story | Depends On | Can Start After |
|-------|------------|-----------------|
| US1 (Connection) | Phase 2 Foundational | T012 complete |
| US2 (Schema) | US1 (needs engine) | T018 complete |
| US3 (Health) | US1 (needs connection) | T018 complete |

### Within Each User Story

1. Core infrastructure first (engine, session)
2. Models before migrations
3. Migrations before verification
4. Health functions before endpoints

### Parallel Opportunities

**Phase 1 (all parallel)**:
```
T002, T003, T004, T005, T006, T007 can run simultaneously
```

**Phase 4 Models (parallel)**:
```
T019, T020, T021 can run simultaneously (different model files)
```

**Phase 6 Polish (parallel)**:
```
T037, T038, T043, T044 can run simultaneously
```

---

## Parallel Example: User Story 2 Models

```bash
# Launch all models for User Story 2 together:
Task: "Create User model in backend/src/models/user.py"
Task: "Create Category model in backend/src/models/category.py"
Task: "Create Todo model in backend/src/models/todo.py"

# Then sequentially:
Task: "Export all models in backend/src/models/__init__.py"
Task: "Create initial Alembic migration"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: US1 (Connection) - **Can verify connection works**
4. Complete Phase 4: US2 (Schema) - **Can verify tables exist**
5. **STOP and VALIDATE**: Database layer is functional
6. Deploy/demo if ready

### Full Feature (Add Health Check)

1. Complete MVP (US1 + US2)
2. Complete Phase 5: US3 (Health)
3. Complete Phase 6: Polish
4. Full database layer with monitoring ready

### Suggested MVP Scope

**Minimum Viable**: US1 (Connection) + US2 (Schema)
- Provides working database connection
- Creates all required tables
- Foundation for all future features

**Recommended**: US1 + US2 + US3
- Adds health monitoring capability
- Enables production readiness checks
- Small additional effort for significant operational value

---

## Summary

| Metric | Count |
|--------|-------|
| Total Tasks | 44 |
| Phase 1 (Setup) | 7 |
| Phase 2 (Foundational) | 5 |
| Phase 3 (US1 - Connection) | 6 |
| Phase 4 (US2 - Schema) | 9 |
| Phase 5 (US3 - Health) | 9 |
| Phase 6 (Polish) | 8 |
| Parallel Opportunities | 15 tasks marked [P] |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Credentials must NEVER appear in logs or error messages
