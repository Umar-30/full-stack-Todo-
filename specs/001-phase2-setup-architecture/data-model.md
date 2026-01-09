# Data Model: Phase-2 Project Setup & Architecture

**Feature**: 001-phase2-setup-architecture
**Date**: 2026-01-08

## Overview

This feature focuses on project setup and architecture, not data persistence. Therefore, this document describes **configuration entities** rather than database entities.

## Configuration Entities

### 1. Frontend Environment Configuration

Represents environment variables required by the Next.js frontend application.

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | string | Yes | Backend API base URL |
| `NEXT_PUBLIC_APP_NAME` | string | No | Application display name |
| `PORT` | number | No | Dev server port (default: 3000) |

**Validation Rules**:
- `NEXT_PUBLIC_API_URL` must be a valid URL format
- `PORT` must be a number between 1024-65535

### 2. Backend Environment Configuration

Represents environment variables required by the FastAPI backend application.

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `DATABASE_URL` | string | Yes* | Neon PostgreSQL connection string |
| `SECRET_KEY` | string | Yes | JWT signing secret |
| `CORS_ORIGINS` | string | Yes | Comma-separated allowed origins |
| `DEBUG` | boolean | No | Enable debug mode (default: false) |
| `PORT` | number | No | Server port (default: 8000) |

**Validation Rules**:
- `DATABASE_URL` must be valid PostgreSQL connection string format
- `SECRET_KEY` must be at least 32 characters
- `CORS_ORIGINS` must contain valid URLs

*Note: `DATABASE_URL` marked required but deferred to database feature implementation.

### 3. Project Directory Structure

Represents the logical organization of project files.

```
Entity: DirectoryNode
├── name: string (directory/file name)
├── type: enum [directory, file]
├── purpose: string (what this location is for)
└── children: DirectoryNode[] (if directory)
```

## Relationships

```
phase-2/
├── frontend/ (1:1 with FrontendConfig)
│   └── .env.example → FrontendEnvironmentConfiguration
└── backend/ (1:1 with BackendConfig)
    └── .env.example → BackendEnvironmentConfiguration
```

## State Transitions

Not applicable - this is a static setup feature with no runtime state changes.

## Database Entities

**Deferred**: No database entities are defined in this feature. Database schema will be defined in subsequent features:
- User entity: Authentication feature
- Task entity: Task management feature

This aligns with the spec's "Out of Scope" section.
