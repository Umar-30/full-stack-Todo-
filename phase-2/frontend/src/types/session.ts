/**
 * User Session Type Definitions
 *
 * TypeScript interfaces for authentication session state
 * Based on data-model.md specifications
 */

// User session interface
export interface UserSession {
  token: string; // JWT token from Better Auth
  user_id: string; // User identifier from JWT claims (UUID)
  expires_at: Date; // Token expiration timestamp
  is_authenticated: boolean; // Session authentication status
  user_email?: string; // User email for display purposes
  user_name?: string; // User name for display purposes
}

// Form state interface for UI components
export interface FormState {
  formData: Record<string, any>; // Current form field values
  errors?: Record<string, string[]>; // Field-specific error messages
  isLoading: boolean; // Submit button state (default: false)
  isSubmitted: boolean; // Submission status (default: false)
  touchedFields?: Set<string>; // Fields that have been interacted with
}

// Theme state interface
export type ThemeMode = "light" | "dark" | "auto";
export type FontSize = "sm" | "base" | "lg";

export interface ThemeState {
  mode: ThemeMode; // Theme mode (default: "auto")
  primaryColor?: string; // Primary accent color (default: "blue")
  fontSize: FontSize; // Base font size (default: "base")
}

// API response interface
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}