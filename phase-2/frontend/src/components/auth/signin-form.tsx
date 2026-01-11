/**
 * Sign In Form Component
 *
 * Reusable component for signing in users with email/password
 * Implements form validation with Zod and React Hook Form
 * Per spec.md: Validate credentials, provide generic error messages
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from '@/lib/auth/auth-client';

// Define sign-in form validation schema
const signInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

interface SignInFormProps {
  onSignInSuccess?: () => void;
  onSignInError?: (error: string) => void;
  redirectTo?: string;
}

export function SignInForm({
  onSignInSuccess,
  onSignInError,
  redirectTo = '/dashboard'
}: SignInFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
        callbackURL: redirectTo,
      });

      if (result?.error) {
        // Show generic error message per security requirements
        const errorMsg = 'Invalid email or password. Please try again.';
        setError(errorMsg);
        if (onSignInError) onSignInError(errorMsg);
      } else {
        // Successful authentication - user redirected by callbackURL
        if (onSignInSuccess) onSignInSuccess();
        router.push(redirectTo);
      }
    } catch (err) {
      console.error('Sign in error:', err);
      const errorMsg = 'An unexpected error occurred. Please try again.';
      setError(errorMsg);
      if (onSignInError) onSignInError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/30">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          disabled={isLoading}
          {...form.register('email')}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-500">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          disabled={isLoading}
          {...form.register('password')}
        />
        {form.formState.errors.password && (
          <p className="text-sm text-red-500">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}

// Card wrapper component for consistent styling
export function SignInCard({
  onSignInSuccess,
  onSignInError,
  redirectTo = '/dashboard'
}: SignInFormProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>
          Enter your credentials to access your task management dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm
          onSignInSuccess={onSignInSuccess}
          onSignInError={onSignInError}
          redirectTo={redirectTo}
        />
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardFooter>
    </Card>
  );
}