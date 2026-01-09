# Research: Neon PostgreSQL Database Setup

**Feature**: 002-neon-db-setup
**Date**: 2026-01-08
**Status**: Complete

## Research Tasks

### 1. Async Database Connection Pattern

**Decision**: Use SQLModel with SQLAlchemy's `create_async_engine` and `AsyncSession` for async database operations.

**Rationale**:
- SQLModel natively supports async through `sqlmodel.ext.asyncio.session.AsyncSession`
- Constitution mandates SQLModel as the ORM (Principle V)
- FastAPI is async-native, requiring async database operations for optimal performance
- asyncpg is the recommended PostgreSQL driver for async Python applications

**Alternatives considered**:
- Synchronous SQLModel: Rejected due to blocking I/O in async FastAPI context
- Raw asyncpg: Rejected as it bypasses SQLModel ORM layer required by constitution
- psycopg3 async: Valid alternative but asyncpg has better performance benchmarks

### 2. Connection Pooling Strategy

**Decision**: Use Neon's built-in PgBouncer connection pooling via `-pooler` endpoint suffix.

**Rationale**:
- Neon provides integrated PgBouncer that maintains warm connections
- Eliminates cold start latency for serverless workloads
- Reduces connection overhead for high-traffic applications
- No additional infrastructure required

**Configuration**:
- Use pooled connection string from Neon dashboard
- Connection string format: `postgresql://<user>:<password>@<endpoint>-pooler.<region>.neon.tech/<dbname>?sslmode=require`
- Pool size managed by Neon's infrastructure

**Alternatives considered**:
- Application-level asyncpg pool: Adds complexity, Neon pooling sufficient
- No pooling: Performance impact from cold starts

### 3. SSL/TLS Configuration

**Decision**: Require SSL for all connections using `sslmode=require` parameter.

**Rationale**:
- Neon requires SSL for all connections
- Protects data in transit
- FR-002 mandates SSL/TLS for all database connections

**Implementation**:
- Include `?sslmode=require` in connection string
- SQLAlchemy async engine accepts SSL parameters in URL

### 4. Environment Variable Structure

**Decision**: Use standard PostgreSQL connection variables plus Neon-specific pooler URL.

**Variables Required**:
```
DATABASE_URL=postgresql+asyncpg://<user>:<password>@<endpoint>-pooler.<region>.neon.tech/<dbname>?sslmode=require
```

**Rationale**:
- Single connection string simplifies configuration
- `postgresql+asyncpg://` scheme specifies the async driver
- Standard pattern recognized by SQLAlchemy/SQLModel

### 5. Migration Strategy

**Decision**: Use Alembic for database migrations.

**Rationale**:
- Alembic is the standard migration tool for SQLAlchemy/SQLModel
- Supports async migrations
- Version-controlled schema changes
- Rollback capability

**Alternatives considered**:
- Manual SQL scripts: Rejected due to lack of version control and rollback
- SQLModel's `create_all`: Only suitable for initial setup, not migrations

### 6. Health Check Implementation

**Decision**: Execute `SELECT 1` query with timeout for health verification.

**Rationale**:
- Minimal overhead query
- Validates both connection and query execution
- Can be wrapped with timeout for responsiveness
- Standard pattern for database health checks

### 7. Error Handling Pattern

**Decision**: Catch SQLAlchemy exceptions and map to appropriate error responses.

**Rationale**:
- SQLAlchemy provides hierarchical exception classes
- Connection errors vs query errors need different handling
- FR-006 requires graceful failure with appropriate logging

**Key exceptions to handle**:
- `sqlalchemy.exc.OperationalError`: Connection failures
- `sqlalchemy.exc.IntegrityError`: Constraint violations
- `asyncpg.exceptions.PostgresError`: Driver-level errors

## Technology Stack Confirmation

| Component | Technology | Justification |
|-----------|------------|---------------|
| ORM | SQLModel | Constitution Principle V |
| Async Engine | SQLAlchemy create_async_engine | Native SQLModel support |
| Driver | asyncpg | Best async PostgreSQL driver |
| Connection Pool | Neon PgBouncer | Built-in, no extra config |
| Migrations | Alembic | SQLAlchemy standard |
| SSL | sslmode=require | Neon requirement |

## Sources

- [Neon Connection Pooling Documentation](https://neon.com/docs/connect/connection-pooling)
- [Neon FastAPI Guide](https://neon.com/guides/fastapi-async)
- [Connect Python to Neon Postgres](https://neon.com/docs/guides/python)
- [asyncpg Documentation](https://magicstack.github.io/asyncpg/current/usage.html)
- [SQLModel Async Session Documentation](https://context7.com/fastapi/sqlmodel)
