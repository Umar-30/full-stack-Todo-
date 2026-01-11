'use client';

import { useState } from 'react';
import { Task } from '@/types/task';
import { taskApi } from '@/lib/api/task-api';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Edit2, Check, X, Loader2, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskItemProps {
  task: Task;
  userId: string;
  onTaskUpdated: () => void;
  onTaskDeleted: () => void;
}

export function TaskItem({ task, userId, onTaskUpdated, onTaskDeleted }: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleToggleComplete = async () => {
    setIsUpdating(true);
    try {
      const response = await taskApi.toggleTaskComplete(userId, task.id);
      if (response.error) {
        console.error('Error toggling task completion:', response.error);
        return;
      }
      onTaskUpdated();
    } catch (error) {
      console.error('Error toggling task completion:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await taskApi.deleteTask(userId, task.id);
      if (response.error) {
        console.error('Error deleting task:', response.error);
        return;
      }
      onTaskDeleted();
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleEdit = async () => {
    if (!editTitle.trim() || editTitle === task.title) {
      setIsEditing(false);
      setEditTitle(task.title);
      return;
    }

    setIsUpdating(true);
    try {
      const response = await taskApi.updateTask(userId, task.id, { title: editTitle.trim() });
      if (response.error) {
        console.error('Error updating task:', response.error);
        setEditTitle(task.title);
        return;
      }
      onTaskUpdated();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
      setEditTitle(task.title);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(task.title);
    }
  };

  const formatDate = (dateValue: string | Date) => {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      className={`group p-4 rounded-xl border transition-all duration-300 ${
        task.is_completed
          ? 'bg-green-500/5 border-green-500/20 hover:border-green-500/40'
          : 'bg-gray-800/30 border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/50'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <div className="pt-0.5">
          <Checkbox
            checked={task.is_completed}
            onCheckedChange={handleToggleComplete}
            disabled={isUpdating}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-9 bg-gray-700/50 border-gray-600 text-white rounded-lg"
                autoFocus
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleEdit}
                disabled={isUpdating}
                className="h-9 w-9 p-0 text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded-lg"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(task.title);
                }}
                className="h-9 w-9 p-0 text-gray-400 hover:text-gray-300 hover:bg-gray-600/50 rounded-lg"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <>
              <h3
                className={`font-medium transition-all duration-300 ${
                  task.is_completed ? 'line-through text-gray-500' : 'text-white'
                }`}
              >
                {task.title}
              </h3>

              {task.description && (
                <p className={`text-sm mt-1.5 line-clamp-2 ${
                  task.is_completed ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {task.description}
                </p>
              )}

              <div className="flex items-center gap-3 mt-3">
                <span className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  {formatDate(task.created_at)}
                </span>
                {task.is_completed && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">
                    <Check className="w-3 h-3" />
                    Done
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        {!isEditing && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg"
            >
              <Edit2 className="w-4 h-4" />
            </Button>

            <AnimatePresence mode="wait">
              {showDeleteConfirm ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-1"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-gray-300 hover:bg-gray-600/50 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}
