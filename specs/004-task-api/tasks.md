---
description: "Task list for Task Management REST API implementation"
---

# Tasks: Task Management REST API

**Input**: Design documents from `/specs/004-task-api/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: TDD approach requested in spec (VI. Test-Driven Development)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `phase-2/backend/src/`, `tests/`
- Paths adjusted based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure per implementation plan in phase-2/backend/src/
- [X] T002 [P] Install missing dependencies (pytest-asyncio, httpx) if not present in requirements.txt
- [X] T003 [P] Create tests directory structure in phase-2/backend/tests/

---
## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 [P] Create Task SQLModel in phase-2/backend/src/models/task.py
- [X] T005 [P] Create Task Pydantic schemas in phase-2/backend/src/schemas/task.py
- [X] T006 Create database connection setup in phase-2/backend/src/db/database.py
- [X] T007 Create Task service layer in phase-2/backend/src/services/task_service.py
- [X] T008 [P] Create task router skeleton in phase-2/backend/src/routers/tasks.py
- [X] T009 Update main.py to include task router and database setup

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---
## Phase 3: User Story 1 - Create a New Task (Priority: P1) 🎯 MVP

**Goal**: Allow authenticated users to create new tasks with title and description

**Independent Test**: Can be fully tested by creating a task via POST request and verifying it exists in the database. Delivers immediate value by allowing users to start tracking tasks.

### Tests for User Story 1 (OPTIONAL - only if tests requested) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T010 [P] [US1] Contract test for POST /api/{user_id}/tasks in phase-2/backend/tests/test_tasks.py
- [X] T011 [P] [US1] Integration test for task creation flow in phase-2/backend/tests/test_tasks.py

### Implementation for User Story 1

- [X] T012 [US1] Implement task creation endpoint in phase-2/backend/src/routers/tasks.py
- [X] T013 [US1] Add auth dependency to task creation endpoint
- [X] T014 [US1] Add user_id validation to task creation endpoint
- [X] T015 [US1] Implement task creation in TaskService in phase-2/backend/src/services/task_service.py
- [X] T016 [US1] Add validation and error handling for task creation

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---
## Phase 4: User Story 2 - View My Tasks (Priority: P1)

**Goal**: Allow authenticated users to view all their tasks in a paginated list

**Independent Test**: Can be tested by retrieving tasks list via GET request and verifying correct tasks are returned for the authenticated user only.

### Tests for User Story 2 (OPTIONAL - only if tests requested) ⚠️

- [X] T017 [P] [US2] Contract test for GET /api/{user_id}/tasks in phase-2/backend/tests/test_tasks.py
- [X] T018 [P] [US2] Integration test for task list flow in phase-2/backend/tests/test_tasks.py

### Implementation for User Story 2

- [X] T019 [US2] Implement task list endpoint in phase-2/backend/src/routers/tasks.py
- [X] T020 [US2] Add auth dependency to task list endpoint
- [X] T021 [US2] Add user_id validation to task list endpoint
- [X] T022 [US2] Implement task listing in TaskService in phase-2/backend/src/services/task_service.py
- [X] T023 [US2] Add pagination logic to task listing

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---
## Phase 5: User Story 3 - View Single Task Details (Priority: P2)

**Goal**: Allow authenticated users to view details of a specific task

**Independent Test**: Can be tested by fetching a single task by ID and verifying all fields are returned correctly.

### Tests for User Story 3 (OPTIONAL - only if tests requested) ⚠️

- [X] T024 [P] [US3] Contract test for GET /api/{user_id}/tasks/{task_id} in phase-2/backend/tests/test_tasks.py
- [X] T025 [P] [US3] Integration test for single task view in phase-2/backend/tests/test_tasks.py

### Implementation for User Story 3

- [X] T026 [US3] Implement single task endpoint in phase-2/backend/src/routers/tasks.py
- [X] T027 [US3] Add auth dependency to single task endpoint
- [X] T028 [US3] Add user_id validation to single task endpoint
- [X] T029 [US3] Add task_id validation to single task endpoint
- [X] T030 [US3] Implement single task retrieval in TaskService in phase-2/backend/src/services/task_service.py

**Checkpoint**: At this point, User Stories 1, 2 AND 3 should all work independently

---
## Phase 6: User Story 4 - Update a Task (Priority: P2)

**Goal**: Allow authenticated users to update their task details

**Independent Test**: Can be tested by updating a task via PUT request and verifying changes are persisted.

### Tests for User Story 4 (OPTIONAL - only if tests requested) ⚠️

- [X] T031 [P] [US4] Contract test for PUT /api/{user_id}/tasks/{task_id} in phase-2/backend/tests/test_tasks.py
- [X] T032 [P] [US4] Integration test for task update flow in phase-2/backend/tests/test_tasks.py

### Implementation for User Story 4

- [X] T033 [US4] Implement task update endpoint in phase-2/backend/src/routers/tasks.py
- [X] T034 [US4] Add auth dependency to task update endpoint
- [X] T035 [US4] Add user_id validation to task update endpoint
- [X] T036 [US4] Add task_id validation to task update endpoint
- [X] T037 [US4] Implement task update in TaskService in phase-2/backend/src/services/task_service.py

**Checkpoint**: At this point, User Stories 1, 2, 3 AND 4 should all work independently

---
## Phase 7: User Story 5 - Delete a Task (Priority: P2)

**Goal**: Allow authenticated users to delete their tasks

**Independent Test**: Can be tested by deleting a task via DELETE request and verifying it no longer exists.

### Tests for User Story 5 (OPTIONAL - only if tests requested) ⚠️

- [X] T038 [P] [US5] Contract test for DELETE /api/{user_id}/tasks/{task_id} in phase-2/backend/tests/test_tasks.py
- [X] T039 [P] [US5] Integration test for task deletion flow in phase-2/backend/tests/test_tasks.py

### Implementation for User Story 5

- [X] T040 [US5] Implement task delete endpoint in phase-2/backend/src/routers/tasks.py
- [X] T041 [US5] Add auth dependency to task delete endpoint
- [X] T042 [US5] Add user_id validation to task delete endpoint
- [X] T043 [US5] Add task_id validation to task delete endpoint
- [X] T044 [US5] Implement task deletion in TaskService in phase-2/backend/src/services/task_service.py

**Checkpoint**: At this point, User Stories 1, 2, 3, 4 AND 5 should all work independently

---
## Phase 8: User Story 6 - Toggle Task Completion (Priority: P1)

**Goal**: Allow authenticated users to mark tasks as complete/incomplete

**Independent Test**: Can be tested by PATCH toggling completion status and verifying the state change persists.

### Tests for User Story 6 (OPTIONAL - only if tests requested) ⚠️

- [X] T045 [P] [US6] Contract test for PATCH /api/{user_id}/tasks/{task_id}/complete in phase-2/backend/tests/test_tasks.py
- [X] T046 [P] [US6] Integration test for task completion toggle in phase-2/backend/tests/test_tasks.py

### Implementation for User Story 6

- [X] T047 [US6] Implement task completion toggle endpoint in phase-2/backend/src/routers/tasks.py
- [X] T048 [US6] Add auth dependency to task completion endpoint
- [X] T049 [US6] Add user_id validation to task completion endpoint
- [X] T050 [US6] Add task_id validation to task completion endpoint
- [X] T051 [US6] Implement task completion toggle in TaskService in phase-2/backend/src/services/task_service.py

**Checkpoint**: All user stories should now be independently functional

---
## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T052 [P] Update documentation in phase-2/backend/README.md
- [X] T053 Run all tests to ensure everything works together
- [X] T054 [P] Add error handling for edge cases (FR-008, FR-009)
- [X] T055 Add logging for all task operations
- [X] T056 Run quickstart.md validation

---
## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1/US2/US3 but should be independently testable
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1/US2/US3/US4 but should be independently testable
- **User Story 6 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1/US2/US3/US4/US5 but should be independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---
## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (if tests requested):
Task: "Contract test for POST /api/{user_id}/tasks in phase-2/backend/tests/test_tasks.py"
Task: "Integration test for task creation flow in phase-2/backend/tests/test_tasks.py"

# Launch all implementation for User Story 1:
Task: "Implement task creation endpoint in phase-2/backend/src/routers/tasks.py"
Task: "Add auth dependency to task creation endpoint"
Task: "Implement task creation in TaskService in phase-2/backend/src/services/task_service.py"
```

---
## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Add User Story 6 → Test independently → Deploy/Demo
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
   - Developer D: User Story 4
   - Developer E: User Story 5
   - Developer F: User Story 6
3. Stories complete and integrate independently

---
## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
