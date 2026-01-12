/**
 * Better Auth Client Configuration
 *
 * Client-side auth for React components
 * Per constitution: Frontend handles UI/UX and user authentication
 */

import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [
    jwtClient(), // Enables authClient.token() for JWT retrieval
  ],
});

// Export auth methods for convenience
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;
