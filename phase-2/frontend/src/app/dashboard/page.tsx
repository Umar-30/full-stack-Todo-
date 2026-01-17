'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { Task, TaskListResponse } from '@/types/task';
import { TaskList } from '@/components/dashboard/task-list';
import { CreateTaskForm } from '@/components/dashboard/create-task-form';
import { taskApi } from '@/lib/api/task-api';
import { getCurrentUserId, signOut } from '@/lib/auth/auth-client';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { LogOut, RefreshCw, Check, LayoutDashboard, ListTodo, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const { data: session } = useSession();
  // Use name, or email username part, or 'User' as fallback
  const userName = session?.user?.name || session?.user?.email?.split('@')[0] || 'User';

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getCurrentUserId();
      if (!id) {
        router.push('/signin');
        return;
      }
      setUserId(id);
    };
    fetchUserId();
  }, [router]);

  const { data, error, mutate, isLoading } = useSWR<TaskListResponse>(
    userId ? `/api/${userId}/tasks` : null,
    async () => {
      if (!userId) return { tasks: [], total: 0, limit: 50, offset: 0 };
      const response = await taskApi.getTasks(userId);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data || { tasks: [], total: 0, limit: 50, offset: 0 };
    }
  );

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const completedTasks = data?.tasks?.filter(t => t.is_completed).length || 0;
  const pendingTasks = data?.tasks?.filter(t => !t.is_completed).length || 0;
  const totalTasks = data?.tasks?.length || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">Loading your dashboard...</h2>
          <p className="text-gray-500 mt-2">Please wait a moment</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-gray-900/50 backdrop-blur-xl rounded-3xl p-10 border border-red-500/20 max-w-md"
        >
          <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">!</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-gray-400 mb-8">We couldn't load your tasks. Please try again.</p>
          <Button
            onClick={() => mutate()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent hidden sm:block">
                  TaskFlow
                </span>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <button
                onClick={() => mutate()}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                title="Refresh tasks"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-medium text-white">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-gray-300">{userName}</span>
              </div>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="text-gray-400 hover:text-white hover:bg-white/5"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Welcome back, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{userName}</span>! <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Here's what's on your plate today
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            { icon: ListTodo, label: 'Total Tasks', value: totalTasks, color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-500/10' },
            { icon: CheckCircle2, label: 'Completed', value: completedTasks, color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-500/10' },
            { icon: Clock, label: 'Pending', value: pendingTasks, color: 'from-yellow-500 to-orange-500', bgColor: 'bg-yellow-500/10' },
            { icon: TrendingUp, label: 'Completion Rate', value: `${completionRate}%`, color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-500/10' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-5 hover:border-gray-700/50 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center mb-4`}>
                <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} style={{ color: stat.color.includes('blue') ? '#3b82f6' : stat.color.includes('green') ? '#22c55e' : stat.color.includes('yellow') ? '#eab308' : '#a855f7' }} />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Create Task Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <CreateTaskForm userId={userId} onTaskCreated={() => mutate()} />
          </motion.div>

          {/* Task List Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <LayoutDashboard className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Your Tasks</h2>
                    <p className="text-gray-500 text-sm">{totalTasks} total tasks</p>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 animate-pulse">
                    <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
                  </div>
                  <p className="text-gray-400">Loading your tasks...</p>
                </div>
              ) : data?.tasks && data.tasks.length > 0 ? (
                <TaskList
                  tasks={data.tasks}
                  userId={userId}
                  onTaskUpdated={() => mutate()}
                  onTaskDeleted={() => mutate()}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mx-auto mb-6">
                    <span className="text-5xl">📝</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No tasks yet</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">
                    Create your first task to start organizing your work and boosting your productivity!
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
