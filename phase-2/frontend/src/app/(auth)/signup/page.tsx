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
import { signUp } from '@/lib/auth/auth-client';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2, Check, ArrowLeft, Eye, EyeOff, Sparkles } from 'lucide-react';

const signUpSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }).max(50, { message: 'Name must be less than 50 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { message: 'Password must contain uppercase, lowercase, and number' }),
  confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: '/dashboard',
      });

      if (result?.error) {
        const errorMessage = result.error.message?.toLowerCase() || '';
        if (errorMessage.includes('already exists') || errorMessage.includes('duplicate')) {
          setError('An account with this email already exists. Please sign in instead.');
        } else if (errorMessage.includes('timeout') || errorMessage.includes('connection')) {
          setError('Connection error. Please try again in a moment.');
        } else {
          setError(result.error.message || 'Failed to create account. Please try again.');
        }
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      console.error('Sign up error:', err);
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
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Mobile background gradient */}
        <div className="absolute inset-0 lg:hidden">
          <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-purple-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[100px]" />
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
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white">Create your account</h2>
              <p className="text-gray-400 mt-2">Start your productivity journey today</p>
            </div>

            {/* Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <Label htmlFor="name" className="text-gray-300 text-sm font-medium">Full Name</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    disabled={isLoading}
                    className="h-12 pl-12 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    {...form.register('name')}
                  />
                </div>
                {form.formState.errors.name && (
                  <p className="text-sm text-red-400">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300 text-sm font-medium">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    disabled={isLoading}
                    className="h-12 pl-12 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    {...form.register('email')}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-sm text-red-400">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300 text-sm font-medium">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    disabled={isLoading}
                    className="h-12 pl-12 pr-12 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
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
                  <p className="text-sm text-red-400">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300 text-sm font-medium">Confirm Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                    className="h-12 pl-12 pr-12 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    {...form.register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-400">{form.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link href="/signin" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-gray-500 mt-6">
            By creating an account, you agree to our{' '}
            <span className="text-gray-400 hover:text-white cursor-pointer">Terms of Service</span>
            {' '}and{' '}
            <span className="text-gray-400 hover:text-white cursor-pointer">Privacy Policy</span>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/30 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Check className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">TaskFlow</span>
            </Link>

            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Start your
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                productivity journey
              </span>
            </h1>

            <p className="text-gray-400 text-lg max-w-md">
              Join thousands of users who are already managing their tasks efficiently with TaskFlow.
            </p>

            <div className="mt-12 space-y-4">
              {[
                'Free forever for personal use',
                'Unlimited tasks and projects',
                'Beautiful dark theme interface',
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 text-gray-300"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  {feature}
                </motion.div>
              ))}
            </div>

            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-16 p-6 rounded-2xl bg-gray-800/30 border border-gray-700/50 backdrop-blur-xl"
            >
              <p className="text-gray-300 italic">"TaskFlow transformed how I manage my daily tasks. It's simple, beautiful, and incredibly effective."</p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                  S
                </div>
                <div>
                  <p className="text-white font-medium">Shagufta Zakir</p>
                  <p className="text-gray-500 text-sm">Product Manager</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
