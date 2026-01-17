/**
 * Better Auth Server Configuration
 *
 * Uses built-in Kysely adapter for PostgreSQL (Neon)
 * Per constitution: Better Auth handles user login/registration, JWT issuance
 */

import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";

export const auth = betterAuth({
  // Database configuration - uses pg Pool with built-in Kysely adapter
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Required for Neon
  }),

  // Email and password authentication
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true, // Auto sign-in after registration
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days (per spec assumptions)
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  // JWT plugin for API authentication
  plugins: [
    jwt({
      jwt: {
        expirationTime: "1h", // 1 hour (per constitution: recommended)
      },
    }),
  ],

  // Rate limiting (relaxed for development, tighten for production)
  rateLimit: {
    enabled: true,
    window: 60, // 1 minute default window
    max: 100, // 100 requests per minute default
    customRules: {
      "/sign-in/email": {
        window: 60, // 1 minute (was 15 minutes)
        max: 20, // 20 attempts per minute (was 5 per 15 min)
      },
      "/sign-up/email": {
        window: 60,
        max: 10, // 10 attempts per minute (was 3)
      },
    },
  },

  // Security settings - allow dev ports and production URLs
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:3004",
    // Local network IPs for development (mobile testing)
    "http://192.168.1.3:3000",
    "http://192.168.1.3:3001",
    // Production URLs (Vercel)
    ...(process.env.NEXT_PUBLIC_APP_URL ? [process.env.NEXT_PUBLIC_APP_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    // Common Vercel patterns
    "https://full-stack-todo.vercel.app",
    "https://full-stack-todo-git-main.vercel.app",
  ],
});

// Export type for client
export type Auth = typeof auth;
