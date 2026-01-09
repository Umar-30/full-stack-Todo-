# Implementation Plan: Phase-2 Project Setup & Architecture

**Branch**: `001-phase2-setup-architecture` | **Date**: 2026-01-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-phase2-setup-architecture/spec.md`

## Summary

Create the foundational project structure for Phase-2 development with clearly separated frontend (Next.js 16+) and backend (FastAPI) applications. This setup enables independent development, environment configuration via `.env` files, and establishes routing conventions that will scale as features are added.

## Technical Context

**Language/Version**:
- Frontend: TypeScript 5.x / Node.js 20 LTS
- Backend: Python 3.11+

**Primary Dependencies**:
- Frontend: Next.js 16+ (App Router), React 18+
- Backend: FastAPI, Uvicorn, SQLModel, Pydantic

**Storage**: Neon Serverless PostgreSQL (configuration only in this phase)

**Testing**:
- Frontend: Jest + React Testing Library (setup only)
- Backend: pytest (setup only)

**Target Platform**: Web (Linux/Windows/macOS development, Linux production)

**Project Type**: Web application (frontend + backend)

**Performance Goals**: N/A for setup phase (no runtime code)

**Constraints**:
- Must follow constitution's technology stack exactly
- Frontend and backend must be independently startable
- Setup time for new developer < 10 minutes

**Scale/Scope**: Single application supporting future multi-user task management

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-Driven Development | ✅ PASS | All work originates from spec.md |
| II. Multi-User Task Isolation | ⏸️ DEFERRED | No user data in setup phase |
| III. RESTful API Compliance | ✅ PASS | Backend structured for REST |
| IV. JWT-Based Security | ⏸️ DEFERRED | No auth in setup phase |
| V. Technology Stack Adherence | ✅ PASS | Using exact stack from constitution |
| VI. Test-Driven Development | ⏸️ DEFERRED | Test setup only, no tests to write |
| VII. Separation of Concerns | ✅ PASS | Frontend/backend fully separated |
| VIII. Agent Architecture | ✅ PASS | Using spec workflow |

**Gate Status**: ✅ PASS - No violations requiring justification

## Project Structure

### Documentation (this feature)

```text
specs/001-phase2-setup-architecture/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Technology decisions
├── data-model.md        # Configuration entities
├── quickstart.md        # Developer setup guide
├── contracts/           # API contracts (health check)
│   └── health-check.yaml
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
phase-2/
├── README.md                    # Project overview and architecture
├── frontend/
│   ├── README.md                # Frontend-specific setup
│   ├── package.json             # Node.js dependencies
│   ├── next.config.js           # Next.js configuration
│   ├── tsconfig.json            # TypeScript configuration
│   ├── .env.example             # Environment template
│   ├── public/                  # Static assets
│   └── src/
│       ├── app/                 # App Router pages
│       │   ├── layout.tsx       # Root layout
│       │   ├── page.tsx         # Home page
│       │   └── globals.css      # Global styles
│       ├── components/          # Reusable components
│       ├── lib/                 # Utilities
│       └── services/            # API client
│
└── backend/
    ├── README.md                # Backend-specific setup
    ├── requirements.txt         # Python dependencies
    ├── pyproject.toml           # Project metadata (optional)
    ├── .env.example             # Environment template
    ├── src/
    │   ├── __init__.py
    │   ├── main.py              # FastAPI app entry point
    │   ├── core/                # Config, dependencies
    │   │   ├── __init__.py
    │   │   └── config.py        # Settings management
    │   ├── api/                 # Route handlers
    │   │   ├── __init__.py
    │   │   └── health.py        # Health check endpoint
    │   ├── models/              # SQLModel entities (empty)
    │   ├── schemas/             # Pydantic schemas (empty)
    │   └── services/            # Business logic (empty)
    └── tests/
        └── __init__.py
```

**Structure Decision**: Web application structure with `phase-2/frontend/` and `phase-2/backend/` as independent projects. This aligns with FR-001, FR-002, FR-009, and FR-010.

## Complexity Tracking

No violations requiring justification. All decisions align with constitution.

## Implementation Approach

### Phase 1: Directory Structure
1. Create `phase-2/` root directory
2. Create `phase-2/frontend/` with Next.js App Router structure
3. Create `phase-2/backend/` with FastAPI domain structure

### Phase 2: Frontend Initialization
1. Initialize Next.js 16+ project with TypeScript
2. Configure App Router with basic layout
3. Create `.env.example` with documented variables
4. Create `README.md` with setup instructions

### Phase 3: Backend Initialization
1. Create Python project structure
2. Set up FastAPI with health check endpoint
3. Configure environment variable loading
4. Create `.env.example` with documented variables
5. Create `README.md` with setup instructions

### Phase 4: Root Documentation
1. Create `phase-2/README.md` explaining architecture
2. Document how to run both services
3. Document routing conventions

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Version incompatibility | Low | Medium | Pin exact versions in package files |
| Port conflicts | Low | Low | Document alternative port configuration |
| Missing Node.js/Python | Medium | High | Clear prerequisites in quickstart.md |

## Artifacts Created

| Artifact | Path | Purpose |
|----------|------|---------|
| Research | `research.md` | Technology decisions |
| Data Model | `data-model.md` | Configuration entities |
| API Contract | `contracts/health-check.yaml` | Health check OpenAPI spec |
| Quickstart | `quickstart.md` | Developer setup guide |

## Next Steps

After this plan is approved:
1. Run `/sp.tasks` to generate implementation tasks
2. Execute tasks to create project structure
3. Verify setup matches success criteria SC-001 through SC-006
