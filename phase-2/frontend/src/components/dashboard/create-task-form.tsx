'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { taskApi } from '@/lib/api/task-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Loader2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  description: z.string().max(2000, 'Description must be less than 2000 characters').optional(),
});

type CreateTaskFormValues = z.infer<typeof createTaskSchema>;

interface CreateTaskFormProps {
  userId: string;
  onTaskCreated: () => void;
}

export function CreateTaskForm({ userId, onTaskCreated }: CreateTaskFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDescription, setShowDescription] = useState(false);

  const form = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = async (data: CreateTaskFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await taskApi.createTask(userId, {
        title: data.title,
        description: data.description || undefined,
      });

      if (response.error) {
        setError(response.error);
        return;
      }

      form.reset();
      setShowDescription(false);
      onTaskCreated();
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6 h-fit">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Create Task</h2>
          <p className="text-gray-500 text-sm">Add a new task to your list</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          <Input
            {...form.register('title')}
            placeholder="What needs to be done?"
            disabled={isSubmitting}
            className="h-12 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
          {form.formState.errors.title && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400"
            >
              {form.formState.errors.title.message}
            </motion.p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowDescription(!showDescription)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors w-full"
        >
          {showDescription ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
          {showDescription ? 'Hide description' : 'Add description (optional)'}
        </button>

        <AnimatePresence>
          {showDescription && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <Textarea
                {...form.register('description')}
                placeholder="Add more details about this task..."
                rows={3}
                disabled={isSubmitting}
                className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none transition-all"
              />
              {form.formState.errors.description && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-400 mt-2"
                >
                  {form.formState.errors.description.message}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          disabled={isSubmitting || !form.watch('title')}
          className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5 mr-2" />
              Create Task
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
