# Tasks: Phase-2 Project Setup & Architecture

**Input**: Design documents from `/specs/001-phase2-setup-architecture/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: No tests requested in specification - this is a setup/scaffolding feature.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web app structure**: `phase-2/frontend/`, `phase-2/backend/`
- All paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the root Phase-2 directory structure

- [x] T001 Create `phase-2/` root directory at repository root
- [x] T002 [P] Create `phase-2/frontend/` directory structure
- [x] T003 [P] Create `phase-2/backend/` directory structure

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Initialize both projects so they can be worked on independently

**⚠️ CRITICAL**: User story work cannot begin until both frontend and backend are initialized

### Frontend Initialization

- [x] T004 Initialize Next.js 16+ project with TypeScript in `phase-2/frontend/`
- [x] T005 Configure `phase-2/frontend/next.config.js` with basic settings
- [x] T006 Configure `phase-2/frontend/tsconfig.json` for strict TypeScript
- [x] T007 [P] Create `phase-2/frontend/src/` directory structure per plan.md

### Backend Initialization

- [x] T008 [P] Create `phase-2/backend/requirements.txt` with FastAPI, uvicorn, pydantic, python-dotenv dependencies
- [x] T009 [P] Create `phase-2/backend/src/__init__.py` package marker
- [x] T010 Create `phase-2/backend/src/main.py` with FastAPI app initialization
- [x] T011 [P] Create `phase-2/backend/src/core/__init__.py` package marker
- [x] T012 Create `phase-2/backend/src/core/config.py` with Pydantic Settings for environment variable loading
- [x] T013 [P] Create placeholder directories: `phase-2/backend/src/api/`, `phase-2/backend/src/models/`, `phase-2/backend/src/schemas/`, `phase-2/backend/src/services/`
- [x] T014 [P] Create `phase-2/backend/tests/__init__.py` for test directory

**Checkpoint**: Foundation ready - both frontend and backend projects exist and can be initialized

---

## Phase 3: User Story 1 - Developer Initializes Phase-2 Project (Priority: P1) 🎯 MVP

**Goal**: Ensure `phase-2/` directory structure is complete and clearly organized for frontend/backend separation

**Independent Test**: Verify `phase-2/` exists with `frontend/` and `backend/` subdirectories, each independently navigable

### Implementation for User Story 1

- [x] T015 [US1] Create `phase-2/frontend/src/app/` directory for App Router pages
- [x] T016 [P] [US1] Create `phase-2/frontend/src/components/` directory with `.gitkeep`
- [x] T017 [P] [US1] Create `phase-2/frontend/src/lib/` directory with `.gitkeep`
- [x] T018 [P] [US1] Create `phase-2/frontend/src/services/` directory with `.gitkeep`
- [x] T019 [P] [US1] Create `phase-2/frontend/public/` directory with `.gitkeep`
- [x] T020 [P] [US1] Create `phase-2/backend/src/api/__init__.py` package marker
- [x] T021 [P] [US1] Create `phase-2/backend/src/models/__init__.py` package marker
- [x] T022 [P] [US1] Create `phase-2/backend/src/schemas/__init__.py` package marker
- [x] T023 [P] [US1] Create `phase-2/backend/src/services/__init__.py` package marker

**Checkpoint**: Directory structure complete - developer can navigate frontend and backend independently

---

## Phase 4: User Story 2 - Developer Configures Environment Variables (Priority: P1)

**Goal**: Provide `.env.example` files with documented environment variables for both frontend and backend

**Independent Test**: Copy `.env.example` to `.env`, verify application loads configuration correctly

### Implementation for User Story 2

- [x] T024 [P] [US2] Create `phase-2/frontend/.env.example` with NEXT_PUBLIC_API_URL, NEXT_PUBLIC_APP_NAME, PORT variables and comments
- [x] T025 [P] [US2] Create `phase-2/backend/.env.example` with DATABASE_URL, SECRET_KEY, CORS_ORIGINS, DEBUG, PORT variables and comments
- [x] T026 [US2] Update `phase-2/backend/src/core/config.py` to validate required environment variables on startup
- [x] T027 [US2] Add `.env` to `phase-2/frontend/.gitignore` (create if not exists)
- [x] T028 [US2] Add `.env` and `venv/` to `phase-2/backend/.gitignore` (create if not exists)

**Checkpoint**: Environment configuration complete - developer can configure local environment

---

## Phase 5: User Story 3 - Developer Understands Routing Conventions (Priority: P2)

**Goal**: Establish routing patterns for both frontend (App Router) and backend (FastAPI routers)

**Independent Test**: Create a test route in frontend and backend, verify it works following the documented conventions

### Implementation for User Story 3

- [x] T029 [US3] Create `phase-2/frontend/src/app/layout.tsx` with root layout and metadata
- [x] T030 [US3] Create `phase-2/frontend/src/app/page.tsx` with basic home page demonstrating App Router
- [x] T031 [P] [US3] Create `phase-2/frontend/src/app/globals.css` with minimal base styles
- [x] T032 [US3] Create `phase-2/backend/src/api/health.py` with health check router per contracts/health-check.yaml
- [x] T033 [US3] Register health router in `phase-2/backend/src/main.py`

**Checkpoint**: Routing conventions established - developer can add new routes following patterns

---

## Phase 6: User Story 4 - Developer Runs Frontend and Backend Independently (Priority: P2)

**Goal**: Both servers start independently with single commands

**Independent Test**: Run `npm run dev` in frontend, run `uvicorn` in backend - both start on designated ports

### Implementation for User Story 4

- [x] T034 [US4] Verify `phase-2/frontend/package.json` has `dev` script configured for port 3000
- [x] T035 [US4] Update `phase-2/backend/src/main.py` to configure CORS for frontend origin
- [x] T036 [US4] Verify backend starts with `uvicorn src.main:app --reload --port 8000` from backend directory

**Checkpoint**: Both servers run independently - developer can work on either in isolation

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentation and final verification

- [x] T037 [P] Create `phase-2/frontend/README.md` with setup instructions, available commands, folder structure explanation
- [x] T038 [P] Create `phase-2/backend/README.md` with setup instructions, available commands, folder structure explanation
- [x] T039 Create `phase-2/README.md` with overall architecture, how to run both services, project overview
- [x] T040 Validate setup against success criteria SC-001 through SC-006
- [x] T041 Run quickstart.md validation - verify 10-minute setup is achievable

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Phase 2 completion
- **User Story 2 (Phase 4)**: Depends on Phase 2 completion - can run parallel to US1
- **User Story 3 (Phase 5)**: Depends on Phase 2 completion - can run parallel to US1/US2
- **User Story 4 (Phase 6)**: Depends on US3 (routing must exist to verify servers work)
- **Polish (Phase 7)**: Depends on all user stories complete

### User Story Dependencies

| Story | Depends On | Can Parallel With |
|-------|------------|-------------------|
| US1 (P1) | Foundational | US2 |
| US2 (P1) | Foundational | US1 |
| US3 (P2) | Foundational | US1, US2 |
| US4 (P2) | US3 | - |

### Within Each Phase

- Tasks marked [P] can run in parallel
- Tasks without [P] must run sequentially
- File creation tasks for different directories can always parallel

### Parallel Opportunities

**Phase 1** (all parallel):
```
T002 Create frontend directory || T003 Create backend directory
```

**Phase 2** (partial parallel):
```
T007 Frontend src structure || T008 Backend requirements.txt || T009-T014 Backend setup
```

**User Stories 1-3** (after Foundational):
```
All US1 tasks || All US2 tasks || All US3 tasks (different directories)
```

---

## Parallel Example: User Stories 1 & 2

```bash
# These can run in parallel after Foundational phase:

# User Story 1 - Directory Structure
Task: "Create phase-2/frontend/src/components/ directory"
Task: "Create phase-2/backend/src/api/__init__.py"

# User Story 2 - Environment Variables
Task: "Create phase-2/frontend/.env.example"
Task: "Create phase-2/backend/.env.example"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T014)
3. Complete Phase 3: User Story 1 (T015-T023)
4. Complete Phase 4: User Story 2 (T024-T028)
5. **STOP and VALIDATE**: Verify directory structure and env configuration
6. Deploy/demo minimal setup if ready

### Full Feature Delivery

1. Setup → Foundational → Foundation ready
2. User Story 1 + User Story 2 (parallel) → Core structure complete
3. User Story 3 → Routing conventions established
4. User Story 4 → Independent servers verified
5. Polish → Documentation complete

---

## Task Summary

| Phase | Task Count | Parallel Tasks |
|-------|------------|----------------|
| Setup | 3 | 2 |
| Foundational | 11 | 7 |
| User Story 1 | 9 | 8 |
| User Story 2 | 5 | 2 |
| User Story 3 | 5 | 1 |
| User Story 4 | 3 | 0 |
| Polish | 5 | 2 |
| **Total** | **41** | **22** |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- This is a scaffolding feature - no business logic or tests
- Each user story can be validated independently
- Commit after each task or logical group
- Stop at any checkpoint to validate progress
