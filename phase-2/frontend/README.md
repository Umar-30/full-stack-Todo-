# Phase-2 Frontend

Next.js 16+ frontend application for the Todo Full-Stack Web Application.

## Prerequisites

- Node.js 20 LTS or higher
- npm (included with Node.js)

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
frontend/
├── src/
│   ├── app/           # App Router pages and layouts
│   │   ├── layout.tsx # Root layout (shared across all pages)
│   │   ├── page.tsx   # Home page (/)
│   │   └── globals.css# Global styles
│   ├── components/    # Reusable UI components
│   ├── lib/           # Utilities and helpers
│   └── services/      # API client and external services
├── public/            # Static assets (images, fonts)
├── .env.example       # Environment variable template
├── next.config.ts     # Next.js configuration
├── tsconfig.json      # TypeScript configuration
└── package.json       # Dependencies and scripts
```

## Routing Convention

This project uses Next.js App Router with file-based routing:

| File Path | Route |
|-----------|-------|
| `src/app/page.tsx` | `/` |
| `src/app/about/page.tsx` | `/about` |
| `src/app/tasks/page.tsx` | `/tasks` |
| `src/app/tasks/[id]/page.tsx` | `/tasks/:id` |

### Adding a New Page

1. Create a directory under `src/app/` matching your route
2. Add a `page.tsx` file in that directory
3. The route is automatically available

Example:
```tsx
// src/app/tasks/page.tsx
export default function TasksPage() {
  return <h1>Tasks</h1>;
}
// Available at: http://localhost:3000/tasks
```

## Environment Variables

See `.env.example` for all available configuration options:

- `NEXT_PUBLIC_API_URL` - Backend API base URL
- `NEXT_PUBLIC_APP_NAME` - Application display name
- `PORT` - Development server port (default: 3000)

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4
- **Linting**: ESLint with Next.js config
