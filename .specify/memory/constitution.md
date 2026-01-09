<!--
================================================================================
SYNC IMPACT REPORT
================================================================================
Version change: 1.0.0 → 1.1.0 (MINOR - new principle added)
Modified principles: N/A
Added sections:
  - Principle VIII: Agent Architecture & Reusable Skills
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ (compatible)
  - .specify/templates/spec-template.md ✅ (compatible)
  - .specify/templates/tasks-template.md ✅ (compatible)
Follow-up TODOs: None
================================================================================
-->

# Hackathon II Todo Application Constitution

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)

The entire system MUST be defined, generated, and evolved exclusively through:
- Claude Code
- Spec-Kit Plus
- Markdown specifications

**Manual coding is strictly forbidden.** All implementation MUST originate from specifications.

**Rationale**: Ensures traceability, consistency, and reproducibility across all development artifacts.

### II. Multi-User Task Isolation

The system MUST enforce strict user-level data isolation:
- Each user's tasks are accessible only to that user
- API endpoints MUST include `{user_id}` in the path
- No cross-user data leakage is permitted
- Authorization MUST be validated on every request

**Rationale**: Privacy and security are foundational requirements for multi-tenant applications.

### III. RESTful API Compliance

All backend APIs MUST conform to REST principles:
- Resource-based URL structure
- Proper HTTP method semantics (GET, POST, PUT, PATCH, DELETE)
- Stateless request handling
- Standard HTTP status codes
- JSON request/response bodies

**Rationale**: RESTful APIs ensure predictability, cacheability, and client-server decoupling.

### IV. JWT-Based Security

All API requests MUST be authenticated using JWT tokens:
- Better Auth issues tokens on the frontend
- Tokens MUST be attached to every API request via `Authorization: Bearer <token>`
- FastAPI backend MUST validate tokens before processing
- Invalid/expired tokens MUST return 401 Unauthorized

**Rationale**: Stateless authentication enables horizontal scaling and secure cross-origin requests.

### V. Technology Stack Adherence (NON-NEGOTIABLE)

No substitutions or deviations from the fixed technology stack are permitted:

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16+ (App Router) |
| Backend | Python FastAPI |
| ORM | SQLModel |
| Database | Neon Serverless PostgreSQL |
| Spec System | Claude Code + Spec-Kit Plus |
| Authentication | Better Auth |
| API Style | REST |
| Authorization | JWT Tokens |

**Rationale**: Fixed stack ensures consistency, reduces decision fatigue, and enables focused expertise.

### VI. Test-Driven Development

When tests are requested, TDD principles apply:
- Tests MUST be written before implementation
- Tests MUST fail before implementation begins (Red)
- Implementation MUST make tests pass (Green)
- Refactoring follows only after tests pass

**Rationale**: TDD ensures correctness, prevents regressions, and documents expected behavior.

### VII. Separation of Concerns

The architecture MUST maintain clear boundaries:
- Frontend handles UI/UX and user authentication (Better Auth)
- Backend handles business logic and data persistence (FastAPI)
- Database handles data storage (Neon PostgreSQL)
- Each layer communicates only through defined contracts

**Rationale**: Clean architecture enables independent development, testing, and scaling of each layer.

### VIII. Agent Architecture & Reusable Skills

Development workflows MUST leverage the hierarchical agent system:

**Main Agent (Orchestrator)**:
- Coordinates overall workflow and user interaction
- Delegates specialized tasks to subagents
- Maintains conversation context and state
- Invokes reusable skills for common patterns

**Subagents (Specialized Controllers)**:
- `spec-driven-orchestrator` - Multi-component coordination
- `frontend-controller` - UI/UX specifications (Next.js)
- `backend-controller` - API architecture (FastAPI)
- `api-governance` - RESTful contract design
- `database-schema-architect` - Data model design (SQLModel)
- `auth-security-architect` - Authentication flows (Better Auth/JWT)

**Reusable Skills** (located in `.claude/skills/`):
- `crud-spec.md` - Generate CRUD specifications for any entity
- `validation-error-handling.md` - Standardize validation and error responses
- `spec-consistency-checker.md` - Verify cross-layer spec alignment

**Usage Requirements**:
- Main agent MUST delegate to appropriate subagent for domain-specific tasks
- Reusable skills MUST be invoked for standardized patterns (CRUD, validation, consistency)
- Subagents MUST NOT bypass the main agent for user communication
- All agent outputs MUST be recorded in Prompt History Records (PHRs)

**Rationale**: Hierarchical agent architecture ensures specialization, consistency, and traceability across all development artifacts.

## Technology Stack

### Frontend Layer
- **Framework**: Next.js 16+ with App Router
- **Authentication**: Better Auth (handles user login/registration, JWT issuance)
- **State Management**: React state + server components
- **API Communication**: REST calls with JWT Bearer tokens

### Backend Layer
- **Framework**: Python FastAPI
- **ORM**: SQLModel (SQLAlchemy + Pydantic)
- **Authentication**: JWT token validation
- **API Style**: RESTful endpoints

### Database Layer
- **Provider**: Neon Serverless PostgreSQL
- **Connection**: Async database connections
- **Migrations**: Managed through SQLModel/Alembic

## API Endpoint Contract

All backend APIs MUST conform to this canonical structure:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/{user_id}/tasks` | List all tasks for user |
| POST | `/api/{user_id}/tasks` | Create a new task |
| GET | `/api/{user_id}/tasks/{id}` | Get task details |
| PUT | `/api/{user_id}/tasks/{id}` | Update a task (full) |
| PATCH | `/api/{user_id}/tasks/{id}` | Update a task (partial) |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete a task |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Toggle task completion |

### Request Requirements
- All requests MUST include `Authorization: Bearer <jwt_token>` header
- Request bodies MUST be valid JSON
- `user_id` in path MUST match authenticated user's ID

### Response Requirements
- Success responses: 200 (OK), 201 (Created), 204 (No Content)
- Error responses: 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)
- All responses MUST be JSON format

## Authentication & Security Architecture

### JWT Authentication Flow

1. User authenticates on frontend using Better Auth
2. Better Auth issues a JWT token upon successful authentication
3. Frontend stores the token securely
4. Frontend attaches token to every API request:
   ```
   Authorization: Bearer <jwt_token>
   ```
5. FastAPI backend validates the token
6. If valid, request proceeds; if invalid, return 401 Unauthorized

### Security Requirements
- Tokens MUST have expiration (recommended: 1 hour)
- Refresh token mechanism MUST be implemented
- Passwords MUST be hashed (handled by Better Auth)
- HTTPS MUST be used in production
- CORS MUST be configured to allow only trusted origins

## Governance

### Amendment Process
1. Propose amendment with clear rationale
2. Document in Architecture Decision Record (ADR)
3. Update constitution version following semantic versioning
4. Propagate changes to dependent templates and specifications

### Version Policy
- **MAJOR**: Breaking changes to principles or contracts
- **MINOR**: New principles or sections added
- **PATCH**: Clarifications or typo fixes

### Compliance Requirements
- All PRs MUST verify compliance with this constitution
- Constitution violations MUST be documented and justified
- Use `CLAUDE.md` for runtime development guidance

**Version**: 1.1.0 | **Ratified**: 2026-01-07 | **Last Amended**: 2026-01-07
