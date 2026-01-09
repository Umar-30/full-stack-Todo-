/**
 * Next.js Middleware for Route Protection
 *
 * Per spec: User Story 4 - Protected Route Access
 * - Unauthenticated users redirected to signin
 * - Authenticated users redirected away from auth pages
 * - Preserves intended destination after signin
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Routes that require authentication
const protectedRoutes = ["/dashboard"];

// Routes only for unauthenticated users
const authRoutes = ["/signin", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  // Check if trying to access protected route without session
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !sessionCookie) {
    // Redirect to signin with callback URL (FR-010)
    const signinUrl = new URL("/signin", request.url);
    signinUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signinUrl);
  }

  // Check if authenticated user trying to access auth pages
  const isAuthRoute = authRoutes.includes(pathname);

  if (isAuthRoute && sessionCookie) {
    // Redirect authenticated users to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup"],
};
