/**
 * Task List Component
 *
 * Displays a list of tasks with CRUD operations
 * Implements responsive grid/list layout for tasks
 * Per spec.md: Show tasks in responsive grid/list layout
 */

'use client';

import { Task } from '@/types/task';
import { TaskItem } from './task-item';
import { AnimatePresence } from 'framer-motion';

interface TaskListProps {
  tasks: Task[];
  userId: string;
  onTaskUpdated: () => void;
  onTaskDeleted: () => void;
}

export function TaskList({ tasks, userId, onTaskUpdated, onTaskDeleted }: TaskListProps) {
  // Sort tasks: incomplete first, then by created_at (newest first)
  const sortedTasks = [...tasks].sort((a, b) => {
    // Incomplete tasks come first
    if (a.is_completed !== b.is_completed) {
      return a.is_completed ? 1 : -1;
    }
    // Then sort by created_at (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {sortedTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            userId={userId}
            onTaskUpdated={onTaskUpdated}
            onTaskDeleted={onTaskDeleted}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
