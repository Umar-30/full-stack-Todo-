# Todo Backend

FastAPI backend with Neon PostgreSQL database for the Todo Full-Stack Web Application.

## Quick Start

For detailed setup instructions, see [quickstart.md](../specs/002-neon-db-setup/quickstart.md).

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your Neon database credentials
```

### 3. Run Migrations

```bash
cd backend
alembic upgrade head
```

### 4. Start Server

```bash
uvicorn src.main:app --reload
```

## Project Structure

```
backend/
├── src/
│   ├── models/          # SQLModel database models
│   │   ├── base.py      # Engine configuration
│   │   ├── user.py      # User model
│   │   ├── category.py  # Category model
│   │   └── todo.py      # Todo model
│   ├── db/              # Database utilities
│   │   ├── session.py   # AsyncSession dependency
│   │   ├── health.py    # Health check functions
│   │   ├── startup.py   # App startup hooks
│   │   └── errors.py    # Error handling
│   └── api/             # FastAPI routes
│       ├── health.py    # Health check endpoints
│       └── schemas/     # Pydantic schemas
├── alembic/             # Database migrations
├── tests/               # Test files
├── .env.example         # Environment template
└── requirements.txt     # Python dependencies
```

## API Endpoints

### Health Check

- `GET /health` - Overall application health
- `GET /health/db` - Database-only health

## Database Models

- **User**: Application users (email, display_name)
- **Category**: Todo categories (name, color, icon)
- **Todo**: Task items (title, description, priority, due_date, status)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon PostgreSQL connection string | Yes |
| `ENVIRONMENT` | development or production | No (default: development) |

## Testing

```bash
pytest
```

## Documentation

- [Feature Specification](../specs/002-neon-db-setup/spec.md)
- [Implementation Plan](../specs/002-neon-db-setup/plan.md)
- [Data Model](../specs/002-neon-db-setup/data-model.md)
- [API Contracts](../specs/002-neon-db-setup/contracts/)
