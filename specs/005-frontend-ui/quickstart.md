# Quickstart: Frontend UI Implementation

**Feature**: 005-frontend-ui
**Date**: 2026-01-10

## Prerequisites

1. **Node.js 18+** with npm/yarn/pnpm
2. **Next.js 16.1.1** (already in phase-2/frontend)
3. **Better Auth** configured (from 003-better-auth feature)
4. **Backend API** running (from 004-task-api feature)

## Setup

### 1. Install Dependencies

```bash
cd phase-2/frontend
npm install @radix-ui/react-icons @radix-ui/react-slot lucide-react
npm install tailwindcss-animate framer-motion zod
npm install swr @hookform/resolvers
```

### 2. Configure Tailwind CSS for Dark Mode

```js
// tailwind.config.ts
export default {
  darkMode: ["class"],
  // ... other config
  plugins: [require("tailwindcss-animate")],
}
```

### 3. Create Directory Structure

```bash
# Component directories
mkdir -p src/components/{ui,auth,dashboard}
mkdir -p src/lib/{auth,api,utils}
mkdir -p src/types
mkdir -p src/app/{(auth),dashboard}
```

## Implementation Steps

### 1. Set Up Dark Theme

```tsx
// src/app/layout.tsx
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="dark:bg-gray-900 dark:text-white">
        {children}
      </body>
    </html>
  )
}
```

### 2. Create Authentication Pages

```tsx
// src/app/(auth)/signin/page.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInSchema } from '@/lib/validation/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignInPage() {
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' }
  })

  const onSubmit = async (data: any) => {
    // Use Better Auth client for sign in
    const result = await authClient.signIn.email(data)
    if (result.success) {
      // Redirect to dashboard
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email and password fields */}
          <Button type="submit">Sign In</Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

### 3. Create Dashboard Page

```tsx
// src/app/dashboard/page.tsx
'use client'

import { useTasks } from '@/lib/hooks/use-tasks'
import { TaskList } from '@/components/dashboard/task-list'
import { CreateTaskForm } from '@/components/dashboard/create-task-form'

export default function DashboardPage() {
  const { tasks, isLoading, error } = useTasks()

  if (isLoading) return <div>Loading tasks...</div>
  if (error) return <div>Error loading tasks: {error.message}</div>

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Tasks</h1>
        <CreateTaskForm />
      </div>
      <TaskList tasks={tasks} />
    </div>
  )
}
```

### 4. API Integration Layer

```ts
// src/lib/api/tasks.ts
import { Task, TaskCreate, TaskUpdate } from '@/types/task'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

class TaskApi {
  async getAll(userId: string, limit = 50, offset = 0) {
    const response = await fetch(`${API_BASE}/${userId}/tasks?limit=${limit}&offset=${offset}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    return response.json()
  }

  async create(userId: string, task: TaskCreate) {
    const response = await fetch(`${API_BASE}/${userId}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(task)
    })
    return response.json()
  }

  // Other CRUD methods...
}

export const taskApi = new TaskApi()
```

### 5. Component Examples

```tsx
// src/components/dashboard/task-item.tsx
'use client'

import { Task } from '@/types/task'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { TrashIcon } from 'lucide-react'

interface TaskItemProps {
  task: Task
  onToggle: (task: Task) => void
  onDelete: (taskId: string) => void
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-lg border ${
      task.is_completed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-white dark:bg-gray-800'
    }`}>
      <Checkbox
        checked={task.is_completed}
        onCheckedChange={() => onToggle(task)}
      />
      <div className="flex-1">
        <h3 className={`font-medium ${task.is_completed ? 'line-through text-gray-500' : ''}`}>
          {task.title}
        </h3>
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {task.description}
          </p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(task.id)}
      >
        <TrashIcon className="w-4 h-4" />
      </Button>
    </div>
  )
}
```

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Running the Application

```bash
# Start frontend
cd phase-2/frontend
npm run dev

# In another terminal, start backend
cd phase-2/backend
uvicorn src.main:app --reload
```

## Testing

```bash
# Unit tests
npm run test

# Component tests
npm run test:components

# E2E tests
npm run test:e2e
```

## Key Integration Points

1. **Authentication**: Use `authClient` from Better Auth for sign in/up
2. **API Calls**: Attach JWT token to all backend API requests
3. **Protected Routes**: Redirect unauthenticated users to sign in
4. **Error Handling**: Show user-friendly messages for API errors
5. **Loading States**: Display spinners during API operations
6. **Optimistic Updates**: Update UI immediately, revert on failure

## Responsive Design Breakpoints

- **Mobile**: 320px - 639px (base styles)
- **Tablet**: 640px - 767px (sm)
- **Desktop**: 768px+ (md and above)
- **Large Desktop**: 1280px+ (xl and above)

## Accessibility Features

- WCAG AA compliance
- Keyboard navigation support
- Screen reader compatibility
- Proper ARIA labels
- Focus management
- Color contrast ratios