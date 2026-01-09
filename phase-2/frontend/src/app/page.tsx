/**
 * Home Page - Phase-2 Todo Application
 *
 * This is the main entry point for the frontend application.
 * Demonstrates Next.js App Router file-based routing.
 *
 * Routing Convention:
 * - src/app/page.tsx -> / (home route)
 * - src/app/[folder]/page.tsx -> /[folder] (nested route)
 * - src/app/api/[route]/route.ts -> API routes (if needed)
 */

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-black">
      <main className="flex flex-col items-center gap-8 p-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
          Todo Application
        </h1>

        <p className="max-w-lg text-lg text-zinc-600 dark:text-zinc-400">
          Phase-2 Full-Stack Web Application
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">
              Frontend
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Next.js 16+ with App Router
            </p>
            <p className="mt-2 text-xs text-green-600 dark:text-green-400">
              ✓ Running on port 3000
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">
              Backend
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              FastAPI with Python
            </p>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
              Check /health endpoint on port 8000
            </p>
          </div>
        </div>

        <p className="mt-8 text-sm text-zinc-500 dark:text-zinc-500">
          Edit{" "}
          <code className="rounded bg-zinc-100 px-2 py-1 font-mono text-sm dark:bg-zinc-800">
            src/app/page.tsx
          </code>{" "}
          to get started
        </p>
      </main>
    </div>
  );
}
