# Feature Specification: Task Management REST API

**Feature Branch**: `004-task-api`
**Created**: 2026-01-09
**Status**: Draft
**Input**: User description: "Secure REST APIs for task management using FastAPI + SQLModel, backed by Neon PostgreSQL, and protected with Better Auth"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a New Task (Priority: P1)

As an authenticated user, I want to create a new task so that I can track my to-do items.

**Why this priority**: Task creation is the most fundamental operation - without it, no other task operations are meaningful. This is the entry point for all task data.

**Independent Test**: Can be fully tested by creating a task via POST request and verifying it exists in the database. Delivers immediate value by allowing users to start tracking tasks.

**Acceptance Scenarios**:

1. **Given** an authenticated user with valid JWT token, **When** they POST a new task with title "Buy groceries", **Then** the system creates the task and returns 201 Created with task details including generated ID
2. **Given** an authenticated user, **When** they POST a task without a title (required field), **Then** the system returns 422 Unprocessable Entity with validation error
3. **Given** an unauthenticated request (no/invalid token), **When** they attempt to create a task, **Then** the system returns 401 Unauthorized

---

### User Story 2 - View My Tasks (Priority: P1)

As an authenticated user, I want to view all my tasks so that I can see what I need to accomplish.

**Why this priority**: Viewing tasks is equally critical as creation - users need to see their tasks to know what to do. This completes the basic read-write cycle.

**Independent Test**: Can be tested by retrieving tasks list via GET request and verifying correct tasks are returned for the authenticated user only.

**Acceptance Scenarios**:

1. **Given** an authenticated user with 3 existing tasks, **When** they GET their tasks list, **Then** the system returns 200 OK with an array of exactly their 3 tasks
2. **Given** an authenticated user with no tasks, **When** they GET their tasks list, **Then** the system returns 200 OK with an empty array
3. **Given** User A is authenticated, **When** they request tasks, **Then** they see only their own tasks (not User B's tasks) - enforcing data isolation

---

### User Story 3 - View Single Task Details (Priority: P2)

As an authenticated user, I want to view details of a specific task so that I can see all information about it.

**Why this priority**: Required for task detail views and editing workflows, but secondary to list operations.

**Independent Test**: Can be tested by fetching a single task by ID and verifying all fields are returned correctly.

**Acceptance Scenarios**:

1. **Given** an authenticated user who owns task ID 123, **When** they GET /api/{user_id}/tasks/123, **Then** the system returns 200 OK with complete task details
2. **Given** an authenticated user, **When** they GET a non-existent task ID, **Then** the system returns 404 Not Found
3. **Given** User A is authenticated, **When** they try to GET User B's task, **Then** the system returns 403 Forbidden

---

### User Story 4 - Update a Task (Priority: P2)

As an authenticated user, I want to update my task details so that I can modify task information as needed.

**Why this priority**: Users need to edit tasks to fix mistakes or update details. Essential for task lifecycle management.

**Independent Test**: Can be tested by updating a task via PUT request and verifying changes are persisted.

**Acceptance Scenarios**:

1. **Given** an authenticated user with existing task, **When** they PUT updated title and description, **Then** the system returns 200 OK with updated task and changes are persisted
2. **Given** an authenticated user, **When** they PUT invalid data (empty title), **Then** the system returns 422 Unprocessable Entity
3. **Given** User A is authenticated, **When** they try to PUT update User B's task, **Then** the system returns 403 Forbidden

---

### User Story 5 - Delete a Task (Priority: P2)

As an authenticated user, I want to delete a task so that I can remove completed or unwanted tasks.

**Why this priority**: Cleanup is important for usability but secondary to core CRUD operations.

**Independent Test**: Can be tested by deleting a task via DELETE request and verifying it no longer exists.

**Acceptance Scenarios**:

1. **Given** an authenticated user with task ID 123, **When** they DELETE the task, **Then** the system returns 204 No Content and task is removed
2. **Given** an authenticated user, **When** they DELETE a non-existent task, **Then** the system returns 404 Not Found
3. **Given** User A is authenticated, **When** they try to DELETE User B's task, **Then** the system returns 403 Forbidden

---

### User Story 6 - Toggle Task Completion (Priority: P1)

As an authenticated user, I want to mark a task as complete/incomplete so that I can track my progress.

**Why this priority**: This is the core workflow - users complete tasks constantly. Toggling status is the most frequent operation after viewing.

**Independent Test**: Can be tested by PATCH toggling completion status and verifying the state change persists.

**Acceptance Scenarios**:

1. **Given** an authenticated user with incomplete task, **When** they PATCH /complete, **Then** task status changes to completed and returns 200 OK
2. **Given** an authenticated user with completed task, **When** they PATCH /complete, **Then** task status toggles back to incomplete
3. **Given** an unauthenticated request, **When** they PATCH /complete, **Then** the system returns 401 Unauthorized

---

### Edge Cases

- What happens when user_id in path doesn't match authenticated user's ID? → 403 Forbidden
- What happens when database connection fails? → 503 Service Unavailable with retry guidance
- What happens when task title exceeds maximum length (255 chars)? → 422 with validation error
- What happens when concurrent updates occur on same task? → Last write wins (optimistic concurrency)
- What happens when user has thousands of tasks? → Pagination support with default limit of 50

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST authenticate all API requests using JWT tokens issued by Better Auth
- **FR-002**: System MUST validate that {user_id} in path matches the authenticated user's ID
- **FR-003**: System MUST return 401 Unauthorized for missing or invalid JWT tokens
- **FR-004**: System MUST return 403 Forbidden when user attempts to access another user's tasks
- **FR-005**: System MUST create tasks with unique IDs (UUID format)
- **FR-006**: System MUST validate task title is required and non-empty (max 255 characters)
- **FR-007**: System MUST validate task description is optional (max 2000 characters)
- **FR-008**: System MUST store task creation timestamp automatically
- **FR-009**: System MUST store task update timestamp automatically on modifications
- **FR-010**: System MUST support task completion status as boolean (default: false/incomplete)
- **FR-011**: System MUST return proper HTTP status codes (200, 201, 204, 400, 401, 403, 404, 422, 500)
- **FR-012**: System MUST return JSON responses with consistent error format
- **FR-013**: System MUST support pagination for task list (default: 50 items, max: 100)
- **FR-014**: System MUST persist all data to Neon PostgreSQL database
- **FR-015**: System MUST enforce user-level data isolation (no cross-user data access)

### Key Entities

- **Task**: Represents a to-do item owned by a user
  - id: Unique identifier (UUID)
  - user_id: Owner reference (UUID, from JWT)
  - title: Task name (required, 1-255 chars)
  - description: Detailed info (optional, max 2000 chars)
  - is_completed: Completion status (boolean, default false)
  - created_at: Creation timestamp
  - updated_at: Last modification timestamp

- **User**: Referenced from Better Auth (not managed by this API)
  - id: User identifier (UUID, from JWT sub claim)
  - Authenticated via Better Auth JWT tokens

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a task in under 500ms response time
- **SC-002**: Users can view their task list in under 300ms for up to 100 tasks
- **SC-003**: All unauthorized access attempts are rejected with appropriate error codes
- **SC-004**: System maintains 100% data isolation between users (no cross-user data leakage)
- **SC-005**: All CRUD operations complete successfully for authenticated users
- **SC-006**: API response format is consistent across all endpoints (JSON)
- **SC-007**: System handles concurrent requests without data corruption

## Assumptions

- Better Auth is already configured and issuing valid JWT tokens (from feature 003-better-auth)
- Neon PostgreSQL database is available and accessible
- JWT tokens contain user ID in the "sub" claim
- All API operations are within the phase-2/backend folder structure
- CORS is configured to allow frontend requests from localhost:3000

## Out of Scope

- Task categories/labels/tags (future enhancement)
- Task due dates and reminders (future enhancement)
- Task sharing between users (future enhancement)
- Task comments/attachments (future enhancement)
- Bulk operations (delete multiple, update multiple)
- Search/filter functionality beyond basic list
- Task ordering/priorities beyond completion status
