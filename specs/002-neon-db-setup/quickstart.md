# Quickstart: Neon PostgreSQL Database Setup

**Feature**: 002-neon-db-setup
**Date**: 2026-01-08

## Prerequisites

- Python 3.11+
- Neon account (free tier available at https://neon.tech)
- Poetry or pip for dependency management

## 1. Create Neon Database

1. Sign up at [Neon Console](https://console.neon.tech)
2. Create a new project
3. Note your connection details:
   - Host: `<endpoint>-pooler.<region>.neon.tech`
   - Database: `neondb` (default)
   - User: Your project user
   - Password: Your project password

## 2. Install Dependencies

```bash
# Using pip
pip install sqlmodel asyncpg alembic python-dotenv

# Using Poetry
poetry add sqlmodel asyncpg alembic python-dotenv
```

## 3. Configure Environment

Create `.env` file in project root:

```env
# Neon PostgreSQL Connection (use pooled connection)
DATABASE_URL=postgresql+asyncpg://<user>:<password>@<endpoint>-pooler.<region>.neon.tech/<dbname>?sslmode=require

# Example:
# DATABASE_URL=postgresql+asyncpg://myuser:mypassword@ep-cool-name-123456-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Important**: Never commit `.env` to version control!

## 4. Verify Connection

Create a test script `test_connection.py`:

```python
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import text
import os
from dotenv import load_dotenv

load_dotenv()

async def test_connection():
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("ERROR: DATABASE_URL not set")
        return False

    engine = create_async_engine(database_url, echo=True)

    try:
        async with AsyncSession(engine) as session:
            result = await session.exec(text("SELECT 1"))
            value = result.scalar()
            print(f"SUCCESS: Database connection verified (SELECT 1 = {value})")
            return True
    except Exception as e:
        print(f"ERROR: Connection failed - {e}")
        return False
    finally:
        await engine.dispose()

if __name__ == "__main__":
    asyncio.run(test_connection())
```

Run:
```bash
python test_connection.py
```

## 5. Initialize Alembic (Migrations)

```bash
# Initialize Alembic
alembic init alembic

# Update alembic.ini with async driver
# Change: sqlalchemy.url = driver://...
# To use env variable (handled in env.py)
```

Update `alembic/env.py` for async support (see implementation tasks).

## 6. Create Initial Migration

```bash
# After defining models
alembic revision --autogenerate -m "Initial schema: users, categories, todos"

# Apply migration
alembic upgrade head
```

## 7. Health Check Endpoint

The application exposes health endpoints:

```
GET /health      # Full application health
GET /health/db   # Database-only health
```

Example response:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-08T12:00:00Z",
  "checks": {
    "database": {
      "status": "healthy",
      "connected": true,
      "latency_ms": 5
    }
  }
}
```

## Troubleshooting

### Connection Refused
- Verify DATABASE_URL is correct
- Check Neon project is active (not suspended)
- Ensure using `-pooler` suffix in endpoint

### SSL Error
- Confirm `?sslmode=require` in connection string
- Neon requires SSL for all connections

### Cold Start Latency
- First connection after idle may take 2-5 seconds
- Using pooled connection minimizes this
- Consider connection warmup on app startup

### Migration Errors
- Ensure models are imported in alembic/env.py
- Check target_metadata points to SQLModel.metadata

## Next Steps

1. Run `/sp.tasks` to generate implementation tasks
2. Implement database models in `backend/src/models/`
3. Set up FastAPI dependency injection for sessions
4. Create Alembic migrations
5. Implement health check endpoint

## References

- [Neon Documentation](https://neon.tech/docs)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com)
- [Alembic Tutorial](https://alembic.sqlalchemy.org/en/latest/tutorial.html)
- [asyncpg Documentation](https://magicstack.github.io/asyncpg)
