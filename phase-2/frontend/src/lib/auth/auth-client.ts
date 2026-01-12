/**
 * Better Auth Client Utilities
 *
 * Client-side utilities for authentication with Better Auth
 * Handles JWT token management and user session state
 */

import { createAuthClient } from "better-auth/client";

// Initialize Better Auth client with configuration
// Use empty string for baseURL to use relative URLs (works on any port)
export const betterAuthClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000"),
});

// Export individual auth methods for convenience
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = betterAuthClient;

// Custom useAuth hook for getting current user info
export function useAuth() {
  return {
    getCurrentUserId: async (): Promise<string | null> => {
      try {
        const session = await getSession();
        return session?.data?.user?.id || null;
      } catch (error) {
        console.error("Error getting current user ID:", error);
        return null;
      }
    }
  };
}

// Utility function to get JWT token for API calls
export async function getJwtToken(): Promise<string | null> {
  try {
    const session = await getSession();
    return session?.data?.session?.token || null;
  } catch (error) {
    console.error("Error getting JWT token:", error);
    return null;
  }
}

// Utility function to check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  try {
    const session = await getSession();
    return !!session?.data?.user;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
}

// Utility function to get current user ID
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const session = await getSession();
    return session?.data?.user?.id || null;
  } catch (error) {
    console.error("Error getting current user ID:", error);
    return null;
  }
}

// Type definitions for auth responses
export interface AuthSession {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  token: string;
  expiresAt: Date;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthSession['user'];
  token?: string;
  error?: string;
}
