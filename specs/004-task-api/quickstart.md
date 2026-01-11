# Quickstart: Task Management REST API

**Feature**: 004-task-api
**Date**: 2026-01-09

## Prerequisites

1. **Better Auth configured** (from 003-better-auth)
   - Frontend running at `http://localhost:3000`
   - JWT tokens available via `/api/auth/token`

2. **Neon PostgreSQL** database accessible
   - Connection string in `.env`

3. **Python 3.11+** with dependencies installed

## Setup

### 1. Install Dependencies

```bash
cd phase-2/backend
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy example env if not exists
cp .env.example .env

# Required variables:
DATABASE_URL=postgresql+asyncpg://...
FRONTEND_URL=http://localhost:3000
```

### 3. Run Migrations

```bash
# Create tasks table
alembic upgrade head
```

### 4. Start Server

```bash
uvicorn src.main:app --reload --port 8000
```

## API Usage

### Get JWT Token

First, get a JWT token from Better Auth:

```javascript
// In frontend
const { data } = await authClient.token();
const jwt = data.token;
```

### Create a Task

```bash
curl -X POST "http://localhost:8000/api/{user_id}/tasks" \
  -H "Authorization: Bearer {jwt_token}" \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, eggs, bread"}'
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "user-uuid",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "is_completed": false,
  "created_at": "2026-01-09T12:00:00Z",
  "updated_at": "2026-01-09T12:00:00Z"
}
```

### List Tasks

```bash
curl "http://localhost:8000/api/{user_id}/tasks?limit=10&offset=0" \
  -H "Authorization: Bearer {jwt_token}"
```

**Response (200 OK):**
```json
{
  "tasks": [...],
  "total": 5,
  "limit": 10,
  "offset": 0
}
```

### Get Single Task

```bash
curl "http://localhost:8000/api/{user_id}/tasks/{task_id}" \
  -H "Authorization: Bearer {jwt_token}"
```

### Update Task

```bash
curl -X PUT "http://localhost:8000/api/{user_id}/tasks/{task_id}" \
  -H "Authorization: Bearer {jwt_token}" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated title"}'
```

### Toggle Completion

```bash
curl -X PATCH "http://localhost:8000/api/{user_id}/tasks/{task_id}/complete" \
  -H "Authorization: Bearer {jwt_token}"
```

### Delete Task

```bash
curl -X DELETE "http://localhost:8000/api/{user_id}/tasks/{task_id}" \
  -H "Authorization: Bearer {jwt_token}"
```

**Response: 204 No Content**

## Error Responses

| Status | Meaning |
|--------|---------|
| 401 | Missing/invalid JWT token |
| 403 | user_id doesn't match authenticated user |
| 404 | Task not found |
| 422 | Validation error (e.g., empty title) |

## Testing

```bash
cd phase-2/backend
pytest tests/test_tasks.py -v
```

## Frontend Integration

```typescript
// Example React hook usage
import { authClient } from '@/lib/auth-client';

async function createTask(title: string, description?: string) {
  const { data: tokenData } = await authClient.token();
  const { data: session } = await authClient.getSession();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/${session.user.id}/tasks`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    }
  );

  return response.json();
}
```
