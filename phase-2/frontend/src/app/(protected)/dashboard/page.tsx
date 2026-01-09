/**
 * Dashboard Page (Protected)
 *
 * Per spec: User Story 3 - User Sign Out
 * Per spec: User Story 4 - Protected Route Access
 * - Only accessible to authenticated users
 * - Displays user info and sign out option
 */

"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signin");
        },
      },
    });
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Redirecting to sign in...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Todo Application
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {session.user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Welcome, {session.user.name}!
            </h2>
            <p className="text-gray-600">
              You are now authenticated. This is a protected page that only
              signed-in users can access.
            </p>

            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Session Info:
              </h3>
              <dl className="text-sm text-gray-600 space-y-1">
                <div>
                  <dt className="inline font-medium">User ID:</dt>{" "}
                  <dd className="inline">{session.user.id}</dd>
                </div>
                <div>
                  <dt className="inline font-medium">Email:</dt>{" "}
                  <dd className="inline">{session.user.email}</dd>
                </div>
                <div>
                  <dt className="inline font-medium">Name:</dt>{" "}
                  <dd className="inline">{session.user.name}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
