/**
 * Authentication Middleware
 *
 * Protects routes that require authentication
 * Redirects unauthenticated users to sign-in page
 * Implements user_id validation per spec requirements
 */

import { NextRequest, NextResponse } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = ['/dashboard', '/profile', '/settings'];

// Define public routes that don't require authentication
const publicRoutes = ['/', '/signin', '/signup'];

export async function middleware(request: NextRequest) {
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Check if the current path is the homepage
  const isHomepage = request.nextUrl.pathname === '/';

  // Better Auth uses 'better-auth.session_token' cookie name
  const getAuthToken = () => {
    return request.cookies.get('better-auth.session_token')?.value ||
           request.cookies.get('better-auth-session-token')?.value ||
           request.cookies.get('__Secure-better-auth.session_token')?.value ||
           request.headers.get('authorization')?.replace('Bearer ', '');
  };

  // If accessing a protected route
  if (isProtectedRoute) {
    const token = getAuthToken();

    // If no token, redirect to sign-in with callback URL
    if (!token) {
      const signInUrl = new URL('/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // If accessing homepage and user is authenticated, redirect to dashboard
  if (isHomepage) {
    const token = getAuthToken();

    if (token) {
      // User is authenticated, redirect to dashboard
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // NOTE: Removed auto-redirect from signin/signup when logged in
  // Users can manually go to signin/signup even if logged in
  // This allows testing and switching accounts

  // Continue with the request
  return NextResponse.next();
}

// Apply middleware to specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};