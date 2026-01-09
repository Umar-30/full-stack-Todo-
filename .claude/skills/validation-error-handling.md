# Validation & Error Handling Skill

You are a reusable Validation & Error Handling Skill that defines standardized input validation rules, error responses, and HTTP status codes for consistent API behavior.

## Purpose

Ensure all APIs follow consistent validation patterns, return predictable error responses, and use correct HTTP status codes across the entire application.

---

## Input Validation Rules

### Field Type Validators

| Type | Validation Rules |
|------|------------------|
| `string` | Non-null, trimmed, length constraints |
| `email` | RFC 5322 compliant, lowercase normalized |
| `password` | Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special |
| `uuid` | UUID v4 format (8-4-4-4-12 hex) |
| `number` | Numeric, within min/max bounds |
| `integer` | Whole number, no decimals |
| `boolean` | Strictly true/false |
| `datetime` | ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ) |
| `date` | ISO 8601 date (YYYY-MM-DD) |
| `url` | Valid URL with protocol (http/https) |
| `enum` | Value in predefined set |
| `array` | Valid JSON array, item type validation |
| `object` | Valid JSON object, nested validation |

### Common Validation Constraints

```yaml
constraints:
  required: true|false        # Field must be present
  nullable: true|false        # Field can be null
  min_length: number          # Minimum string length
  max_length: number          # Maximum string length
  min: number                 # Minimum numeric value
  max: number                 # Maximum numeric value
  pattern: regex              # Regex pattern match
  enum: [value1, value2]      # Allowed values
  unique: true|false          # Must be unique in collection
  trim: true|false            # Auto-trim whitespace
  lowercase: true|false       # Auto-lowercase
  default: value              # Default if not provided
```

### Validation Rule Template

```yaml
field: {field_name}
type: {type}
required: {true|false}
constraints:
  - rule: {constraint_name}
    value: {constraint_value}
    message: "{Custom error message}"
```

---

## HTTP Status Codes

### Success Codes

| Code | Name | When to Use |
|------|------|-------------|
| `200` | OK | Successful GET, PUT, PATCH |
| `201` | Created | Successful POST creating resource |
| `204` | No Content | Successful DELETE, no response body |

### Client Error Codes

| Code | Name | When to Use |
|------|------|-------------|
| `400` | Bad Request | Validation failed, malformed request |
| `401` | Unauthorized | Missing or invalid authentication |
| `403` | Forbidden | Authenticated but not authorized |
| `404` | Not Found | Resource does not exist |
| `405` | Method Not Allowed | HTTP method not supported |
| `409` | Conflict | Duplicate resource, state conflict |
| `410` | Gone | Resource permanently deleted |
| `415` | Unsupported Media Type | Invalid Content-Type header |
| `422` | Unprocessable Entity | Valid JSON but semantic errors |
| `429` | Too Many Requests | Rate limit exceeded |

### Server Error Codes

| Code | Name | When to Use |
|------|------|-------------|
| `500` | Internal Server Error | Unexpected server failure |
| `502` | Bad Gateway | Upstream service failure |
| `503` | Service Unavailable | Temporary overload/maintenance |
| `504` | Gateway Timeout | Upstream service timeout |

---

## Standardized Error Response Format

### Single Error Response

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_abc123xyz"
  }
}
```

### Validation Error Response (400)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_abc123xyz",
    "details": [
      {
        "field": "email",
        "code": "INVALID_FORMAT",
        "message": "Must be a valid email address"
      },
      {
        "field": "password",
        "code": "TOO_SHORT",
        "message": "Must be at least 8 characters"
      }
    ]
  }
}
```

### Authentication Error Response (401)

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required",
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_abc123xyz"
  }
}
```

### Authorization Error Response (403)

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "You do not have permission to access this resource",
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_abc123xyz"
  }
}
```

### Not Found Error Response (404)

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found",
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_abc123xyz",
    "details": {
      "resource": "Task",
      "id": "123e4567-e89b-12d3-a456-426614174000"
    }
  }
}
```

### Conflict Error Response (409)

```json
{
  "error": {
    "code": "CONFLICT",
    "message": "Resource already exists",
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_abc123xyz",
    "details": {
      "field": "email",
      "value": "user@example.com"
    }
  }
}
```

### Rate Limit Error Response (429)

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests",
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_abc123xyz",
    "details": {
      "retry_after": 60,
      "limit": 100,
      "window": "1 minute"
    }
  }
}
```

### Server Error Response (500)

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred",
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_abc123xyz"
  }
}
```

---

## Error Codes Catalog

### Validation Error Codes

| Code | Description |
|------|-------------|
| `REQUIRED` | Field is required but missing |
| `INVALID_TYPE` | Wrong data type |
| `INVALID_FORMAT` | Format doesn't match expected pattern |
| `TOO_SHORT` | Below minimum length |
| `TOO_LONG` | Exceeds maximum length |
| `TOO_SMALL` | Below minimum value |
| `TOO_LARGE` | Exceeds maximum value |
| `INVALID_ENUM` | Value not in allowed set |
| `INVALID_EMAIL` | Invalid email format |
| `INVALID_URL` | Invalid URL format |
| `INVALID_DATE` | Invalid date format |
| `INVALID_UUID` | Invalid UUID format |
| `NOT_UNIQUE` | Value already exists |

### Business Logic Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Authentication required |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource does not exist |
| `CONFLICT` | State or uniqueness conflict |
| `GONE` | Resource permanently removed |
| `EXPIRED` | Token or resource expired |
| `LOCKED` | Resource is locked |
| `RATE_LIMITED` | Too many requests |

### System Error Codes

| Code | Description |
|------|-------------|
| `INTERNAL_ERROR` | Unexpected server error |
| `SERVICE_UNAVAILABLE` | Service temporarily down |
| `UPSTREAM_ERROR` | Dependency service failed |
| `TIMEOUT` | Operation timed out |

---

## Validation Behavior Rules

### Request Processing Order

1. **Parse** - Validate JSON/request body structure
2. **Authenticate** - Verify auth token (if required)
3. **Authorize** - Check permissions (if required)
4. **Validate** - Apply field validation rules
5. **Process** - Execute business logic
6. **Respond** - Return success or error

### Validation Principles

1. **Fail Fast**: Return all validation errors at once, not one at a time
2. **Be Specific**: Include field name, error code, and human message
3. **Be Consistent**: Same error format across all endpoints
4. **Be Secure**: Never expose stack traces or internal details
5. **Be Helpful**: Error messages should guide the user to fix the issue

### Field Error Aggregation

When multiple fields fail validation, aggregate all errors:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      { "field": "title", "code": "REQUIRED", "message": "Title is required" },
      { "field": "email", "code": "INVALID_FORMAT", "message": "Invalid email" },
      { "field": "age", "code": "TOO_SMALL", "message": "Must be at least 18" }
    ]
  }
}
```

---

## Execution Instructions

When generating validation specs:

1. **Identify all input fields** from the request
2. **Apply type validators** based on field type
3. **Add business constraints** (unique, enum values, etc.)
4. **Define custom error messages** that are user-friendly
5. **Map to correct HTTP status codes**
6. **Use standardized error response format**

### Example Application

**Input:** API endpoint accepting `{ title, email, priority }`

**Output:**
```yaml
validation:
  title:
    type: string
    required: true
    constraints:
      - rule: min_length
        value: 1
        message: "Title cannot be empty"
      - rule: max_length
        value: 255
        message: "Title cannot exceed 255 characters"

  email:
    type: email
    required: true
    constraints:
      - rule: format
        value: email
        message: "Must be a valid email address"

  priority:
    type: enum
    required: false
    constraints:
      - rule: enum
        value: [low, medium, high]
        message: "Priority must be low, medium, or high"
      - rule: default
        value: medium

error_mapping:
  missing_title: { status: 400, code: "REQUIRED" }
  invalid_email: { status: 400, code: "INVALID_FORMAT" }
  invalid_priority: { status: 400, code: "INVALID_ENUM" }
```

---

## Integration Notes

- This skill works alongside `crud-spec.md` to provide validation rules
- Error format should be consistent across all API endpoints
- Include `request_id` for traceability in logs
- Never expose sensitive data in error messages
