/**
 * Task Type Definitions
 *
 * TypeScript interfaces for task-related entities
 * Based on data-model.md specifications
 */

import { z } from 'zod';

// Task entity interface
export interface Task {
  id: string; // UUID
  user_id: string; // Owner user ID (UUID)
  title: string; // Required, 1-255 chars
  description?: string | null; // Optional, max 2000 chars
  is_completed: boolean; // Completion status
  created_at: Date; // Creation timestamp
  updated_at: Date; // Last update timestamp
}

// Zod schema for task validation
export const TaskSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string().min(1).max(255),
  description: z.string().max(2000).optional().nullable(),
  is_completed: z.boolean().default(false),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

// Zod schema for task creation
export const TaskCreateSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(2000).optional().nullable(),
});

// Zod schema for task update
export const TaskUpdateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional().nullable(),
  is_completed: z.boolean().optional(),
});

// Task list response interface
export interface TaskListResponse {
  tasks: Task[];
  total: number;
  limit: number;
  offset: number;
}

// Task form data interface (for UI forms)
export interface TaskFormData {
  title: string;
  description?: string;
  is_completed?: boolean;
}

// Validation errors interface
export interface ValidationError {
  field: string;
  message: string;
}