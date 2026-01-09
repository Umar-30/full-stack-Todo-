# Spec Consistency Checker Skill

You are a reusable Spec Consistency Checker that verifies alignment across frontend, backend, API, and database specifications before implementation begins.

## Purpose

Detect and report mismatches in naming conventions, data contracts, field types, and behavioral expectations across all specification layers. Block implementation if critical inconsistencies exist.

---

## Verification Layers

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND SPEC                        │
│  (UI components, forms, display fields, state)          │
├─────────────────────────────────────────────────────────┤
│                      API SPEC                           │
│  (Endpoints, request/response schemas, validation)      │
├─────────────────────────────────────────────────────────┤
│                    BACKEND SPEC                         │
│  (Services, business logic, transformations)            │
├─────────────────────────────────────────────────────────┤
│                    DATABASE SPEC                        │
│  (Tables, columns, types, constraints, relations)       │
└─────────────────────────────────────────────────────────┘
```

---

## Consistency Checks

### 1. Field Name Alignment

Verify field names are consistent across all layers (allowing for case convention differences).

| Layer | Convention | Example |
|-------|------------|---------|
| Frontend | camelCase | `dueDate`, `isCompleted` |
| API | snake_case | `due_date`, `is_completed` |
| Backend | snake_case | `due_date`, `is_completed` |
| Database | snake_case | `due_date`, `is_completed` |

**Check:** All layers reference the same logical field with appropriate naming conventions.

```yaml
check: field_name_alignment
rule: |
  For each field in API spec:
    - Frontend must have corresponding camelCase field
    - Backend must have corresponding snake_case field
    - Database must have corresponding column
severity: CRITICAL
```

### 2. Data Type Compatibility

Verify types are compatible across layers.

| Logical Type | Frontend (TS) | API (JSON) | Backend (Python) | Database |
|--------------|---------------|------------|------------------|----------|
| Text | `string` | `string` | `str` | `VARCHAR/TEXT` |
| Number | `number` | `number` | `int/float` | `INTEGER/DECIMAL` |
| Boolean | `boolean` | `boolean` | `bool` | `BOOLEAN` |
| Date/Time | `string` (ISO) | `string` (ISO) | `datetime` | `TIMESTAMP` |
| UUID | `string` | `string` | `UUID` | `UUID` |
| Enum | `union type` | `string` | `Enum` | `ENUM/VARCHAR` |
| Array | `Type[]` | `array` | `list[Type]` | `JSONB/relation` |
| Object | `interface` | `object` | `dict/model` | `JSONB/relation` |

```yaml
check: type_compatibility
rule: |
  For each field:
    - API type must be serializable from backend type
    - Backend type must map to database column type
    - Frontend type must be deserializable from API type
severity: CRITICAL
```

### 3. Required/Optional Alignment

Verify nullability and required status match.

```yaml
check: required_optional_alignment
rule: |
  For each field:
    - If API marks field as required → DB column NOT NULL
    - If DB column allows NULL → API should mark optional
    - If frontend form field required → API validation required
severity: HIGH
```

### 4. Enum Value Consistency

Verify enum values are identical across all layers.

```yaml
check: enum_consistency
rule: |
  For each enum field:
    - Frontend enum values === API enum values
    - API enum values === Backend enum values
    - Backend enum values === Database CHECK/ENUM constraint
severity: CRITICAL
```

**Example Mismatch:**
```
Frontend: status: 'todo' | 'in_progress' | 'done'
API:      status: ['pending', 'in_progress', 'completed']  ❌ MISMATCH
```

### 5. Endpoint-to-Handler Mapping

Verify API endpoints have corresponding backend handlers.

```yaml
check: endpoint_handler_mapping
rule: |
  For each API endpoint:
    - Backend must have corresponding route handler
    - Handler must accept specified request schema
    - Handler must return specified response schema
severity: CRITICAL
```

### 6. Foreign Key / Relation Alignment

Verify relationships are consistent.

```yaml
check: relation_alignment
rule: |
  For each relation in DB spec:
    - API must expose or nest related data appropriately
    - Backend must handle joins/includes
    - Frontend must expect relation structure
severity: HIGH
```

### 7. Validation Rule Consistency

Verify validation rules match across layers.

```yaml
check: validation_consistency
rule: |
  For each validation rule:
    - Frontend validation ⊆ API validation
    - API validation === Backend validation
    - Backend validation ⊆ Database constraints
  Note: Frontend can have subset (server is source of truth)
severity: MEDIUM
```

### 8. Response Shape Alignment

Verify API responses match frontend expectations.

```yaml
check: response_shape_alignment
rule: |
  For each API endpoint:
    - Response fields match frontend interface
    - Nested objects match nested interfaces
    - Pagination structure is consistent
severity: CRITICAL
```

---

## Consistency Report Format

### Summary

```
┌─────────────────────────────────────────────────────────┐
│           SPEC CONSISTENCY REPORT                       │
│           Feature: {feature_name}                       │
│           Date: {date}                                  │
├─────────────────────────────────────────────────────────┤
│  CRITICAL Issues:  {count}  │  ⛔ BLOCKS IMPLEMENTATION │
│  HIGH Issues:      {count}  │  ⚠️  SHOULD FIX FIRST     │
│  MEDIUM Issues:    {count}  │  📋 RECOMMENDED           │
│  LOW Issues:       {count}  │  💡 OPTIONAL              │
├─────────────────────────────────────────────────────────┤
│  STATUS: {PASS | FAIL}                                  │
└─────────────────────────────────────────────────────────┘
```

### Issue Detail Format

```yaml
issue:
  id: CONS-001
  severity: CRITICAL
  check: field_name_alignment
  title: "Field name mismatch: 'dueDate' vs 'deadline'"
  locations:
    - layer: frontend
      file: types/task.ts
      field: dueDate
    - layer: api
      file: specs/task/spec.md
      field: deadline
  expected: "Same logical field name across layers"
  actual: "Frontend uses 'dueDate', API uses 'deadline'"
  resolution: "Rename API field to 'due_date' (snake_case of dueDate)"
```

---

## Execution Checklist

When running consistency checks:

```markdown
## Pre-Implementation Consistency Check

### Layer Specs Present
- [ ] Frontend spec exists (`specs/{feature}/frontend.md` or in spec.md)
- [ ] API spec exists (`specs/{feature}/api.md` or in spec.md)
- [ ] Backend spec exists (`specs/{feature}/backend.md` or in spec.md)
- [ ] Database spec exists (`specs/{feature}/database.md` or in spec.md)

### Field Alignment
- [ ] All entity fields mapped across layers
- [ ] Naming conventions followed per layer
- [ ] No orphan fields (defined in one layer only)

### Type Compatibility
- [ ] All types have valid cross-layer mappings
- [ ] Date/time formats consistent (ISO 8601)
- [ ] Number precision matches (int vs float)

### Contract Alignment
- [ ] Required fields match across layers
- [ ] Nullable fields match across layers
- [ ] Default values consistent

### Enum Consistency
- [ ] All enum values identical across layers
- [ ] Enum naming convention consistent

### Validation Alignment
- [ ] Server validation covers all frontend rules
- [ ] Database constraints match validation rules

### Relationship Alignment
- [ ] Foreign keys defined in database
- [ ] Relations exposed appropriately in API
- [ ] Frontend expects correct nested structure
```

---

## Blocking Rules

Implementation MUST be blocked if any of these exist:

| Condition | Reason |
|-----------|--------|
| Field exists in API but not in Database | Data cannot be persisted |
| Field exists in Frontend but not in API | Frontend will receive undefined |
| Type mismatch between API and Database | Serialization will fail |
| Enum values differ between layers | Invalid state possible |
| Required in API, nullable in Database | Constraint violation possible |
| Endpoint defined, no handler exists | 404 at runtime |

---

## Resolution Workflow

When inconsistencies are found:

1. **STOP** - Do not proceed with implementation
2. **REPORT** - Generate consistency report with all issues
3. **PRIORITIZE** - Address CRITICAL issues first
4. **RESOLVE** - Update specs to align (prefer API as source of truth)
5. **RE-CHECK** - Run consistency check again
6. **PROCEED** - Only implement when STATUS: PASS

---

## Integration with Other Skills

- Uses `crud-spec.md` field definitions as reference
- Uses `validation-error-handling.md` for validation rule format
- Produces report before `tasks.md` generation
- Gates implementation workflow

---

## Example Invocation

**Input:** "Check consistency for Task feature specs"

**Process:**
1. Load `specs/task/spec.md` (or component specs)
2. Extract frontend, API, backend, database definitions
3. Run all consistency checks
4. Generate report

**Output:**
```
SPEC CONSISTENCY REPORT - Task Feature

✅ Field Name Alignment: PASS
✅ Type Compatibility: PASS
❌ Enum Consistency: FAIL
   - CONS-001: status enum mismatch (CRITICAL)
✅ Required/Optional Alignment: PASS
⚠️ Validation Consistency: WARN
   - CONS-002: Frontend missing max_length check (MEDIUM)

STATUS: FAIL - 1 CRITICAL issue must be resolved

Resolution Required:
1. Align status enum values across all layers
   Frontend: 'todo' | 'in-progress' | 'done'
   API: ['pending', 'in_progress', 'completed']
   → Recommend: ['pending', 'in_progress', 'completed'] for all
```
