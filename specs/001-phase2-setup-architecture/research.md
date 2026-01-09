# Research: Phase-2 Project Setup & Architecture

**Feature**: 001-phase2-setup-architecture
**Date**: 2026-01-08
**Status**: Complete

## Overview

This research document captures technology decisions and best practices for the Phase-2 project setup. Most decisions are pre-determined by the project constitution.

## Decisions

### 1. Frontend Framework

**Decision**: Next.js 16+ with App Router
**Rationale**: Mandated by constitution (Principle V). App Router provides file-based routing, server components, and modern React patterns.
**Alternatives Considered**: None (constitution constraint)

### 2. Backend Framework

**Decision**: Python FastAPI
**Rationale**: Mandated by constitution (Principle V). FastAPI provides async support, automatic OpenAPI docs, and Pydantic validation.
**Alternatives Considered**: None (constitution constraint)

### 3. Package Manager (Frontend)

**Decision**: npm (Node Package Manager)
**Rationale**: Most widely supported, included with Node.js, compatible with all Next.js tooling.
**Alternatives Considered**:
- pnpm: Faster, disk-efficient, but adds complexity for new developers
- yarn: Good but npm has caught up in features
- bun: Newer, less ecosystem support

### 4. Package Manager (Backend)

**Decision**: pip with requirements.txt (simple) or Poetry (advanced)
**Rationale**: pip is universal Python standard; Poetry adds lock files and virtual env management.
**Alternatives Considered**:
- pipenv: Less active development
- conda: Overkill for web apps

### 5. Development Server Ports

**Decision**: Frontend on port 3000, Backend on port 8000
**Rationale**: Industry standard defaults. Next.js defaults to 3000; FastAPI/uvicorn defaults to 8000. Avoids conflicts.
**Alternatives Considered**: Custom ports would work but standard ports are more predictable.

### 6. Frontend Folder Structure

**Decision**: Next.js App Router convention with feature-based organization
```
phase-2/frontend/
├── src/
│   ├── app/           # App Router pages and layouts
│   ├── components/    # Reusable UI components
│   ├── lib/           # Utilities and helpers
│   └── services/      # API client functions
├── public/            # Static assets
└── .env.example       # Environment template
```
**Rationale**: Follows Next.js 16+ conventions. `src/` directory keeps root clean. Feature-based organization scales well.
**Alternatives Considered**: Pages Router (legacy), flat structure (doesn't scale)

### 7. Backend Folder Structure

**Decision**: Domain-driven FastAPI structure
```
phase-2/backend/
├── src/
│   ├── api/           # Route handlers (routers)
│   ├── models/        # SQLModel entities
│   ├── schemas/       # Pydantic request/response schemas
│   ├── services/      # Business logic
│   └── core/          # Config, dependencies, security
├── tests/             # Test files
└── .env.example       # Environment template
```
**Rationale**: Separates concerns, follows FastAPI best practices, aligns with constitution's separation of concerns principle.
**Alternatives Considered**: Flat structure (doesn't scale), hexagonal architecture (overkill for setup phase)

### 8. Environment Variable Strategy

**Decision**: Separate `.env.example` files per service with commented documentation
**Rationale**: Each service has different config needs. Comments in example files serve as inline documentation.
**Alternatives Considered**:
- Single root .env: Mixes concerns, harder to maintain
- JSON config: Less standard for 12-factor apps

### 9. Node.js Version

**Decision**: Node.js 20 LTS
**Rationale**: Current LTS version, required for Next.js 16+, long-term support until April 2026.
**Alternatives Considered**: Node.js 18 (older), Node.js 22 (not yet LTS)

### 10. Python Version

**Decision**: Python 3.11+
**Rationale**: Modern Python with performance improvements, required by latest FastAPI/SQLModel versions.
**Alternatives Considered**: Python 3.10 (older), Python 3.12 (newer but less tested)

## Best Practices Applied

### From Constitution

1. **Separation of Concerns (Principle VII)**: Frontend and backend in separate directories with independent package management
2. **RESTful API Compliance (Principle III)**: Backend structured for resource-based routing
3. **Technology Stack Adherence (Principle V)**: Using exact stack specified

### Industry Standards

1. **12-Factor App**: Environment-based configuration
2. **Monorepo Conventions**: Shared root with independent services
3. **DRY Documentation**: README files at each level explaining local context

## Unknowns Resolved

| Unknown | Resolution |
|---------|------------|
| Frontend framework | Next.js 16+ (constitution) |
| Backend framework | FastAPI (constitution) |
| Database | Neon PostgreSQL (constitution) - deferred to future features |
| Authentication | Better Auth (constitution) - deferred to auth feature |
| Package managers | npm (frontend), pip/poetry (backend) |
| Folder structure | Documented above |
| Ports | 3000 (frontend), 8000 (backend) |

## References

- Next.js App Router Docs: https://nextjs.org/docs/app
- FastAPI Project Structure: https://fastapi.tiangolo.com/tutorial/bigger-applications/
- Constitution: `.specify/memory/constitution.md`
