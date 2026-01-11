'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, Shield, Sparkles, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: CheckCircle,
    title: 'Task Management',
    description: 'Create, organize, and track your tasks with ease.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Instant updates and smooth animations.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is protected with encryption.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Sparkles,
    title: 'Beautiful Design',
    description: 'Modern dark theme interface.',
    color: 'from-purple-500 to-pink-500',
  },
];

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '1M+', label: 'Tasks Completed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9/5', label: 'User Rating' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/5 backdrop-blur-xl bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Check className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <Link href="/signin">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25">
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-8">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300">Introducing TaskFlow 2.0</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Manage Tasks
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Like a Pro
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
              The most intuitive task management app. Stay organized, boost productivity,
              and achieve your goals with our beautiful dark-themed interface.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg shadow-2xl shadow-blue-500/25 group">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/signin">
                <Button size="lg" variant="outline" className="border-gray-700 text-gray-300 hover:bg-white/5 hover:text-white px-8 py-6 text-lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 shadow-2xl max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="space-y-3">
                {['Complete project proposal', 'Review design mockups', 'Team meeting at 3 PM'].map((task, i) => (
                  <div key={i} className={`flex items-center gap-3 p-4 rounded-xl ${i === 0 ? 'bg-green-500/10 border border-green-500/30' : 'bg-gray-700/30 border border-gray-600/30'}`}>
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${i === 0 ? 'bg-green-500 border-green-500' : 'border-gray-500'}`}>
                      {i === 0 && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className={i === 0 ? 'text-gray-400 line-through' : 'text-white'}>{task}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16 border-y border-white/5 bg-black/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-400 mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Everything You Need
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Powerful features to help you manage your tasks and boost productivity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group p-6 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
            <div className="relative p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of users who are already managing their tasks more efficiently.
              </p>
              <Link href="/signup">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-2xl">
                  Create Free Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-400">TaskFlow</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 TaskFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
