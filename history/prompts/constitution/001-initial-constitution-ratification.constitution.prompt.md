---
id: 001
title: Initial Constitution Ratification
stage: constitution
date: 2026-01-07
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: master
user: system
command: /sp.constitution
labels: ["constitution", "governance", "hackathon", "todo-app"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - null
---

## Prompt

# Project Constitution
## Hackathon II — Spec-Driven Multi-User Todo Web Application

---

## 1. Objective

Design and build a **modern, multi-user Todo web application from scratch** using **Spec-Driven Development**.

The entire system MUST be defined, generated, and evolved exclusively through:
- Claude Code
- Spec-Kit Plus
- Markdown specifications

Manual coding is **strictly forbidden**.

---

## 2. Core Requirements

The system MUST:

- Implement **all 5 Basic Level Todo features**
- Provide a **modern web-based user interface**
- Expose **RESTful API endpoints**
- Support **multi-user task isolation**
- Persist data using **Neon Serverless PostgreSQL**
- Implement **secure authentication** using Better Auth
- Enforce **JWT-based API security**

---

## 3. Technology Stack (Fixed & Non-Negotiable)

| Layer | Technology |
|------|-----------|
| Frontend | Next.js 16+ (App Router) |
| Backend | Python FastAPI |
| ORM | SQLModel |
| Database | Neon Serverless PostgreSQL |
| Spec-Driven System | Claude Code + Spec-Kit Plus |
| Authentication | Better Auth |
| API Style | REST |
| Authorization | JWT Tokens |

No substitutions or deviations are permitted.

---

## 4. API Endpoint Contract (Canonical)

All backend APIs MUST conform to the following structure:

| Method | Endpoint | Description |
|------|---------|------------|
| GET | `/api/{user_id}/tasks` | List all tasks |
| POST | `/api/{user_id}/tasks` | Create a new task |
| GET | `/api/{user_id}/tasks/{id}` | Get task details |
| PUT | `/api/{user_id}/tasks/{id}` | Update a task |
| DELETE | `/api/{user_id}/tasks/{id}` | Delete a task |
| PATCH | `/api/{user_id}/tasks/{id}/complete` | Toggle task completion |

---

## 5. Authentication & Security Architecture

### 5.1 JWT Authentication Flow

- Users authenticate on the frontend using **Better Auth**
- Better Auth MUST issue a **JWT token**
- The frontend MUST attach the token to every API request

## Response snapshot

Created project constitution v1.0.0 for Hackathon II Todo Application with:

**7 Core Principles:**
1. Spec-Driven Development (NON-NEGOTIABLE)
2. Multi-User Task Isolation
3. RESTful API Compliance
4. JWT-Based Security
5. Technology Stack Adherence (NON-NEGOTIABLE)
6. Test-Driven Development
7. Separation of Concerns

**Additional Sections:**
- Technology Stack (Frontend/Backend/Database layers)
- API Endpoint Contract (7 canonical endpoints)
- Authentication & Security Architecture (JWT flow)
- Governance (amendment process, version policy, compliance)

**Sync Impact Report:**
- Version: 0.0.0 → 1.0.0 (MAJOR - initial ratification)
- All templates verified compatible
- No follow-up TODOs

## Outcome

- ✅ Impact: Constitution established as authoritative governance document for project
- 🧪 Tests: N/A (governance document)
- 📁 Files: .specify/memory/constitution.md (created/updated)
- 🔁 Next prompts: /sp.specify to create feature specifications, /sp.plan to create implementation plans
- 🧠 Reflection: Constitution captures all user requirements and establishes clear, testable principles

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Monitor constitution compliance during feature development
