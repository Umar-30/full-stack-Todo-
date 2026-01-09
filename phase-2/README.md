# Phase-2: Todo Full-Stack Web Application

A modern full-stack todo application with Next.js frontend and FastAPI backend.

## Architecture Overview

```
phase-2/
├── frontend/          # Next.js 16+ (App Router)
│   └── Port 3000
└── backend/           # Python FastAPI
    └── Port 8000
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 16+ | React-based UI with App Router |
| Backend | FastAPI | REST API server |
| Database | Neon PostgreSQL | Serverless data storage |
| Auth | Better Auth | User authentication |
| ORM | SQLModel | Database operations |

## Prerequisites

- **Node.js** 20 LTS or higher
- **Python** 3.11 or higher
- **Git** for version control

## Quick Start

### 1. Frontend Setup

```bash
cd phase-2/frontend
npm install
cp .env.example .env
npm run dev
```

Frontend available at: http://localhost:3000

### 2. Backend Setup

```bash
cd phase-2/backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate
# Activate (macOS/Linux)
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
uvicorn src.main:app --reload --port 8000
```

Backend available at: http://localhost:8000
API docs at: http://localhost:8000/docs

## Development

### Running Both Services

Open two terminal windows:

**Terminal 1 - Frontend:**
```bash
cd phase-2/frontend && npm run dev
```

**Terminal 2 - Backend:**
```bash
cd phase-2/backend && source venv/bin/activate && uvicorn src.main:app --reload
```

### Port Configuration

Default ports can be changed via environment variables:

- Frontend: Set `PORT` in `frontend/.env`
- Backend: Set `PORT` in `backend/.env` or use `--port` flag

## Project Structure

### Frontend (`frontend/`)

```
src/
├── app/           # App Router pages
├── components/    # Reusable UI components
├── lib/           # Utilities
└── services/      # API client
```

### Backend (`backend/`)

```
src/
├── api/           # Route handlers
├── core/          # Config, security
├── models/        # Database entities
├── schemas/       # Request/response schemas
└── services/      # Business logic
```

## Routing Conventions

### Frontend (Next.js App Router)

File-based routing:
- `src/app/page.tsx` → `/`
- `src/app/tasks/page.tsx` → `/tasks`
- `src/app/tasks/[id]/page.tsx` → `/tasks/:id`

### Backend (FastAPI)

Resource-based routers:
- `/api/{user_id}/tasks` → Task operations
- `/health` → System health check

## Environment Configuration

### Frontend Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API URL |
| `NEXT_PUBLIC_APP_NAME` | No | App display name |
| `PORT` | No | Dev server port |

### Backend Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes* | PostgreSQL connection |
| `SECRET_KEY` | Yes | JWT secret (32+ chars) |
| `CORS_ORIGINS` | Yes | Allowed origins |
| `DEBUG` | No | Debug mode |
| `PORT` | No | Server port |

*Required for database features (deferred in setup phase)

## Next Steps

After setup is complete:

1. Configure database connection in backend
2. Set up Better Auth for authentication
3. Implement task CRUD operations
4. Add user management features

## Documentation

- [Frontend README](./frontend/README.md) - Detailed frontend documentation
- [Backend README](./backend/README.md) - Detailed backend documentation
- [API Docs](http://localhost:8000/docs) - Interactive API documentation (when running)
