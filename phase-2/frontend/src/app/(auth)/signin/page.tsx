'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from '@/lib/auth/auth-client';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, Check, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const signInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        // Handle specific error cases
        const errorMessage = result.error.message?.toLowerCase() || '';
        if (errorMessage.includes('user not found') || errorMessage.includes('invalid')) {
          setError('Account not found. Please check your email or create a new account.');
        } else if (errorMessage.includes('password')) {
          setError('Incorrect password. Please try again.');
        } else if (errorMessage.includes('timeout') || errorMessage.includes('connection')) {
          setError('Connection error. Please try again in a moment.');
        } else {
          setError('Invalid email or password. Please try again.');
        }
      } else if (result?.data) {
        // Use window.location for full page reload to ensure cookies are properly set
        window.location.href = '/dashboard';
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err: unknown) {
      console.error('Sign in error:', err);
      const errorMessage = (err as { message?: string })?.message?.toLowerCase() || '';
      if (errorMessage.includes('timeout') || errorMessage.includes('connection')) {
        setError('Server is waking up. Please wait a moment and try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0f] overflow-hidden">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/30 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Check className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">TaskFlow</span>
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Welcome back to
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                productivity
              </span>
            </h1>

            <p className="text-gray-400 text-lg max-w-md">
              Sign in to continue managing your tasks and staying organized. Your productivity journey awaits.
            </p>

            <div className="mt-12 space-y-4">
              {[
                'Access all your tasks from anywhere',
                'Sync across all your devices',
                'Track your progress in real-time',
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 text-gray-300"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  {feature}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Mobile background gradient */}
        <div className="absolute inset-0 lg:hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Back to Home - Mobile */}
          <Link href="/" className="lg:hidden flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          {/* Glass Card */}
          <div className="bg-gray-900/50 backdrop-blur-2xl rounded-3xl border border-gray-700/50 p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              {/* Mobile Logo */}
              <div className="lg:hidden flex justify-center mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Check className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white">Sign in to your account</h2>
              <p className="text-gray-400 mt-2">Enter your credentials to continue</p>
            </div>

            {/* Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 rounded-xl bg-red-500/10 p-4 text-sm text-red-400 border border-red-500/20"
                >
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">!</span>
                  </div>
                  {error}
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300 text-sm font-medium">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    disabled={isLoading}
                    className="h-12 pl-12 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    {...form.register('email')}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-sm text-red-400 mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300 text-sm font-medium">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    className="h-12 pl-12 pr-12 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    {...form.register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-red-400 mt-1">{form.formState.errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Create account
                </Link>
              </p>
            </div>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-gray-500 mt-6">
            By signing in, you agree to our{' '}
            <span className="text-gray-400 hover:text-white cursor-pointer">Terms of Service</span>
            {' '}and{' '}
            <span className="text-gray-400 hover:text-white cursor-pointer">Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
