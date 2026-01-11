/**
 * Sign Up Form Component
 *
 * Reusable component for user registration with email/password
 * Implements form validation with Zod and React Hook Form
 * Per spec.md: Validate input, prevent duplicate emails, provide generic error messages
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
import { signUp } from '@/lib/auth/auth-client';

// Define sign-up form validation schema
const signUpSchema = z.object({
  name: z.string()
    .min(1, { message: 'Name is required' })
    .max(50, { message: 'Name must be less than 50 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }),
  confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  onSignUpSuccess?: () => void;
  onSignUpError?: (error: string) => void;
  redirectTo?: string;
}

export function SignUpForm({
  onSignUpSuccess,
  onSignUpError,
  redirectTo = '/dashboard'
}: SignUpFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
        callbackURL: redirectTo,
      });

      if (result?.error) {
        // Show generic error message per security requirements
        const errorMsg = 'An account with this email already exists. Please try signing in instead.';
        setError(errorMsg);
        if (onSignUpError) onSignUpError(errorMsg);
      } else {
        // Successful authentication - user redirected by callbackURL
        if (onSignUpSuccess) onSignUpSuccess();
        router.push(redirectTo);
      }
    } catch (err) {
      console.error('Sign up error:', err);
      const errorMsg = 'An unexpected error occurred. Please try again.';
      setError(errorMsg);
      if (onSignUpError) onSignUpError(errorMsg);
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
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="John Doe"
          disabled={isLoading}
          {...form.register('name')}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-red-500">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          disabled={isLoading}
          {...form.register('confirmPassword')}
        />
        {form.formState.errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Creating account...' : 'Sign Up'}
      </Button>
    </form>
  );
}

// Card wrapper component for consistent styling
export function SignUpCard({
  onSignUpSuccess,
  onSignUpError,
  redirectTo = '/dashboard'
}: SignUpFormProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Enter your details to access your task management dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm
          onSignUpSuccess={onSignUpSuccess}
          onSignUpError={onSignUpError}
          redirectTo={redirectTo}
        />
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/signin" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardFooter>
    </Card>
  );
}