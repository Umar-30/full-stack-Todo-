# Quickstart: Phase-2 Project Setup

**Feature**: 001-phase2-setup-architecture
**Time to Complete**: ~10 minutes

## Prerequisites

Before starting, ensure you have:

- [ ] Node.js 20+ installed (`node --version`)
- [ ] Python 3.11+ installed (`python --version`)
- [ ] Git installed (`git --version`)

## Step 1: Clone and Navigate

```bash
git clone <repository-url>
cd "Todo Full-Stack Web Application"
```

## Step 2: Frontend Setup

```bash
# Navigate to frontend
cd phase-2/frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your values (see comments in file)

# Start development server
npm run dev
```

**Verify**: Open http://localhost:3000 - you should see the default page.

## Step 3: Backend Setup

Open a new terminal:

```bash
# Navigate to backend
cd phase-2/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Edit .env with your values (see comments in file)

# Start development server
uvicorn src.main:app --reload --port 8000
```

**Verify**: Open http://localhost:8000/health - you should see `{"status": "healthy", ...}`.

## Step 4: Verify Full Stack

With both servers running:

1. Frontend at http://localhost:3000
2. Backend at http://localhost:8000
3. API docs at http://localhost:8000/docs (Swagger UI)

## Common Commands

### Frontend (from `phase-2/frontend/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |

### Backend (from `phase-2/backend/`)

| Command | Description |
|---------|-------------|
| `uvicorn src.main:app --reload` | Start dev server with auto-reload |
| `pytest` | Run tests |
| `pip freeze > requirements.txt` | Update dependencies |

## Troubleshooting

### Port Already in Use

```bash
# Frontend: Use different port
PORT=3001 npm run dev

# Backend: Use different port
uvicorn src.main:app --reload --port 8001
```

### Environment Variables Not Loading

1. Ensure `.env` file exists (not just `.env.example`)
2. Restart the development server after changes
3. Check variable names match exactly

### Python Virtual Environment Issues

```bash
# Remove and recreate
rm -rf venv
python -m venv venv
# Then activate and install again
```

## Next Steps

After setup is complete:

1. Run `/sp.tasks` to generate implementation tasks
2. Follow tasks to implement project structure
3. Proceed to authentication feature setup
