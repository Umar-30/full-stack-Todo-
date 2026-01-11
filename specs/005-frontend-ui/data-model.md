# Data Model: Frontend UI Components

**Feature**: 005-frontend-ui
**Date**: 2026-01-10

## Overview

Data model for frontend UI components and state management for the task management application. This covers UI entities, component data structures, and client-side state representations.

## UI Entities

### 1. User Session (Client-Side State)

**Description**: Represents the authenticated user's session state in the frontend

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| token | string | Required, JWT format | Authentication token from Better Auth |
| user_id | UUID | Required | User identifier from JWT claims |
| expires_at | Date | Required | Token expiration timestamp |
| is_authenticated | boolean | Required | Session authentication status |
| user_email | string | Optional | User email for display purposes |
| user_name | string | Optional | User name for display purposes |

**Validation Rules**:
- token must be valid JWT format
- user_id must match UUID pattern
- expires_at must be in the future for valid sessions

### 2. Task (UI Representation)

**Description**: UI representation of a task fetched from the backend API

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | Required | Unique task identifier |
| title | string | Required, 1-255 chars | Task title |
| description | string | Optional, max 2000 chars | Task description |
| is_completed | boolean | Required, default: false | Completion status |
| created_at | Date | Required | Creation timestamp |
| updated_at | Date | Required | Last update timestamp |
| user_id | UUID | Required | Owner user ID (for consistency) |

**Validation Rules**:
- title: Required, 1-255 characters
- description: Optional, max 2000 characters
- is_completed: boolean, default false

### 3. Form State (Component State)

**Description**: State management for UI forms

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| formData | Record<string, any> | Required | Current form field values |
| errors | Record<string, string[]> | Optional | Field-specific error messages |
| isLoading | boolean | Required, default: false | Submit button state |
| isSubmitted | boolean | Required, default: false | Submission status |
| touchedFields | Set<string> | Optional | Fields that have been interacted with |

### 4. UI Theme State

**Description**: Application-wide theme configuration

**Fields**:
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| mode | "light" \| "dark" \| "auto" | Required, default: "auto" | Theme mode |
| primaryColor | string | Optional, default: "blue" | Primary accent color |
| fontSize | "sm" \| "base" \| "lg" | Optional, default: "base" | Base font size |

## Component Data Structures

### 1. Authentication Forms

#### Sign In Form
```typescript
interface SignInFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}
```

#### Sign Up Form
```typescript
interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
```

### 2. Task Management Forms

#### Create Task Form
```typescript
interface CreateTaskFormData {
  title: string;
  description?: string;
  is_completed: boolean;
}
```

#### Update Task Form
```typescript
interface UpdateTaskFormData {
  title?: string;
  description?: string;
  is_completed?: boolean;
}
```

### 3. Dashboard Components State

#### Task List Props
```typescript
interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  error?: string;
  onTaskToggle?: (taskId: string) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskEdit?: (taskId: string, data: UpdateTaskFormData) => void;
}
```

#### Task Item Props
```typescript
interface TaskItemProps {
  task: Task;
  onToggle?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  isEditing?: boolean;
}
```

## UI State Transitions

### 1. Authentication Flow
```
                    ┌─────────────┐
                    │  Signed Out │
                    │ (default)   │
                    └──────┬──────┘
                           │
                    Navigate to auth page
                           │
                           ▼
                    ┌─────────────┐
                    │  Auth Page  │
                    │ (sign in/up)│
                    └──────┬──────┘
                           │
                    Successful auth
                           │
                           ▼
                    ┌─────────────┐
                    │  Signed In  │
                    │ (protected) │
                    └──────┬──────┘
                           │
                    Sign out action
                           │
                           ▼
                    ┌─────────────┐
                    │  Signed Out │
                    │ (redirect)  │
                    └─────────────┘
```

### 2. Task Operation States
```
                    ┌─────────────┐
                    │  Idle State │
                    │ (view tasks)│
                    └──────┬──────┘
                           │
                    User clicks action
                           │
                           ▼
                    ┌─────────────┐
                    │ Loading/    │
                    │ Processing  │
                    └──────┬──────┘
                           │
                    Success/Failure
                           │
                           ▼
                    ┌─────────────┐
                    │  Result     │
                    │ (feedback)  │
                    └─────────────┘
```

## Validation Schemas

### 1. Sign In Validation
- email: required, valid email format
- password: required, minimum 8 characters

### 2. Sign Up Validation
- name: required, 1-50 characters
- email: required, valid email format
- password: required, minimum 8 characters, mixed case, numbers
- confirmPassword: required, must match password

### 3. Task Creation Validation
- title: required, 1-255 characters
- description: optional, max 2000 characters

### 4. Task Update Validation
- title: optional, 1-255 characters if provided
- description: optional, max 2000 characters if provided

## Component Hierarchy

```
App Layout
├── Theme Provider
├── Auth Provider
├── Header Component
│   ├── Navigation Links
│   └── User Menu
├── Main Content
│   ├── Dashboard Page
│   │   ├── Task List
│   │   │   ├── Task Item (repeated)
│   │   │   │   ├── Task Actions
│   │   │   │   └── Task Form (when editing)
│   │   │   └── Empty State
│   │   ├── Create Task Form
│   │   └── Task Filters
│   ├── Sign In Page
│   │   └── Sign In Form
│   └── Sign Up Page
│       └── Sign Up Form
└── Footer Component
```

## State Management Patterns

### 1. Global State (Context)
- User session (authentication state)
- Theme preferences
- Global loading states

### 2. Component State (useState)
- Form data and validation
- UI interaction states (modal open/close)
- Local component state

### 3. Server State (SWR)
- Task data from API
- User profile data
- Cached API responses

This data model ensures consistent state management across the UI while maintaining proper separation between client-side UI state and server-side data representations.