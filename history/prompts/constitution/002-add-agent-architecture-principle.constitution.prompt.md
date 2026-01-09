---
id: 002
title: Add Agent Architecture Principle
stage: constitution
date: 2026-01-07
surface: agent
model: claude-opus-4-5-20251101
feature: none
branch: master
user: system
command: /sp.clarify
labels: ["constitution", "agents", "subagents", "skills", "architecture"]
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

is main agent subagent or reuseable skills use krne ko add kro consitution main

(User requested adding a principle about main agents, subagents, and reusable skills to the constitution)

## Response snapshot

Added **Principle VIII: Agent Architecture & Reusable Skills** to the constitution (v1.0.0 → v1.1.0).

The new principle establishes:

**Main Agent (Orchestrator):**
- Coordinates workflow and user interaction
- Delegates to subagents
- Invokes reusable skills

**Subagents:**
- spec-driven-orchestrator
- frontend-controller
- backend-controller
- api-governance
- database-schema-architect
- auth-security-architect

**Reusable Skills (.claude/skills/):**
- crud-spec.md
- validation-error-handling.md
- spec-consistency-checker.md

**Usage Requirements:**
- Main agent MUST delegate to appropriate subagent
- Reusable skills MUST be invoked for standardized patterns
- All outputs recorded in PHRs

## Outcome

- ✅ Impact: Constitution amended with agent architecture principle
- 🧪 Tests: N/A (governance document)
- 📁 Files: .specify/memory/constitution.md (updated)
- 🔁 Next prompts: /sp.specify to create feature specifications
- 🧠 Reflection: Agent hierarchy now formally documented in governance

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Monitor agent delegation compliance
