# API Editing Guide

Complete guide to editing PsychCombo content using the REST API.

## Overview

While the Payload admin panel provides a user-friendly interface, you can also manage content programmatically using the REST API. This is useful for:

- Automation and scripting
- Integration with other tools
- Bulk operations
- Custom workflows
- Programmatic access

## Table of Contents

1. [Getting Started](#getting-started)
2. [Authentication](#authentication)
3. [Psychoactives](#editing-psychoactives)
4. [Combos](#editing-combos)
5. [Risks](#editing-risks)
6. [Common Patterns](#common-patterns)

## Getting Started

### Prerequisites

- CMS server running: `npm run dev --workspace cms`
- API client (Postman, Insomnia, curl, or HTTPie)
- Server at: `http://localhost:3000`

### Testing the Connection

```bash
curl http://localhost:3000/health
# Should return: {"status":"ok","message":"Payload CMS is running"}
```

## Authentication

For API access, you need to authenticate:

### Login

```bash
POST http://localhost:3000/api/users/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "your-password"
}
```

Response includes a token:

```json
{
  "token": "eyJhbGc...",
  "user": {...}
}
```

### Using the Token

Include the token in subsequent requests:

```bash
GET http://localhost:3000/api/psychoactives
Authorization: Bearer eyJhbGc...
```

## Editing Psychoactives

### List All Psychoactives

```bash
GET http://localhost:3000/api/psychoactives?limit=10
```

### Get Single Psychoactive

```bash
GET http://localhost:3000/api/psychoactives/lsd
```

### Create New Psychoactive

```bash
POST http://localhost:3000/api/psychoactives
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "title": "Psilocybin Mushrooms",
  "slug": "psilocybin-mushrooms",
  "aka": [
    { "alias": "Magic Mushrooms" },
    { "alias": "Shrooms" }
  ],
  "family_members": "4-HO-DMT, 4-PO-DMT",
  "duration_chart": {
    "total": "4-6 hours",
    "onset": "20-40 minutes",
    "plateau": "2-3 hours"
  },
  "positive_effects": "euphoria, visual hallucinations, introspection",
  "negative_effects": "nausea, confusion, anxiety",
  "dosage_table": {
    "threshold": "0.25g",
    "light": "0.25-1g",
    "common": "1-2.5g",
    "strong": "2.5-5g",
    "heavy": "5g+"
  }
}
```

### Update Psychoactive

Update specific fields (PATCH):

```bash
PATCH http://localhost:3000/api/psychoactives/:id
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "warnings": "Updated warning text"
}
```

### Delete Psychoactive

```bash
DELETE http://localhost:3000/api/psychoactives/:id
Authorization: Bearer YOUR_TOKEN
```

### Common Psychoactive Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Substance name |
| slug | string | Yes | URL-friendly identifier |
| aka | array | No | Alternative names |
| family_members | string | No | Related substances |
| duration_chart | object | No | Time effects last |
| positive_effects | string | No | Comma-separated |
| negative_effects | string | No | Comma-separated |
| dosage_table | object | No | Dosage ranges |
| warnings | string | No | Safety warnings |

## Editing Combos

### List All Combos

```bash
GET http://localhost:3000/api/combos?limit=10
```

### Get Single Combo

```bash
GET http://localhost:3000/api/combos/lsd_mdma
```

### Create New Combo

```bash
POST http://localhost:3000/api/combos
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "title": "LSD + Psilocybin",
  "slug": "lsd_psilocybin",
  "drug1": "lsd",
  "drug2": "psilocybin-mushrooms",
  "content": {
    "root": {
      "type": "root",
      "children": [
        {
          "type": "heading",
          "tag": "h2",
          "children": [
            {"type": "text", "text": "Overview"}
          ]
        },
        {
          "type": "paragraph",
          "children": [
            {"type": "text", "text": "Description here..."}
          ]
        }
      ]
    }
  }
}
```

### Update Combo

```bash
PATCH http://localhost:3000/api/combos/:id
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "title": "Updated Title"
}
```

### Delete Combo

```bash
DELETE http://localhost:3000/api/combos/:id
Authorization: Bearer YOUR_TOKEN
```

## Editing Risks

### List All Risks

```bash
GET http://localhost:3000/api/risks?limit=100
```

### Get Risk for Combination

```bash
GET http://localhost:3000/api/risks/lsd/mdma
```

### Create New Risk

```bash
POST http://localhost:3000/api/risks
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "drug1": "lsd",
  "drug2": "mdma",
  "combo": "lsd_mdma",
  "risk_level": "LRS",
  "confidence": "HC"
}
```

### Update Risk

```bash
PATCH http://localhost:3000/api/risks/:id
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "risk_level": "MR",
  "confidence": "MC"
}
```

### Delete Risk

```bash
DELETE http://localhost:3000/api/risks/:id
Authorization: Bearer YOUR_TOKEN
```

### Risk Levels

| Code | Meaning |
|------|---------|
| SR | Significant Risk |
| GR | Greater Risk |
| MR | Minor Risk |
| LRS | Low Risk Synergy |
| LRD | Low Risk Decrease |
| LR | Low Risk |
| ND | No Data |

### Confidence Levels

| Code | Meaning |
|------|---------|
| HC | High Confidence |
| MC | Medium Confidence |
| LC | Low Confidence |
| NC | No Confidence |

## Common Patterns

### Pagination

```bash
# Get first page
GET /api/psychoactives?limit=10&page=1

# Get second page
GET /api/psychoactives?limit=10&page=2
```

### Filtering

```bash
# Filter by slug
GET /api/psychoactives?where[slug][equals]=lsd

# Complex filter (JSON encoded)
GET /api/psychoactives?where={"title":{"like":"psilocybin"}}
```

### Sorting

```bash
# Sort by title ascending
GET /api/psychoactives?sort=title

# Sort by title descending
GET /api/psychoactives?sort=-title

# Sort by creation date
GET /api/psychoactives?sort=-createdAt
```

### Field Selection

```bash
# Only return specific fields
GET /api/psychoactives?select=title,slug,aka
```

## Using API Clients

### Postman

1. Download: https://www.postman.com/downloads/
2. Create collection: "PsychCombo CMS"
3. Add environment variable `base_url`: `http://localhost:3000`
4. Create requests for each endpoint
5. Use `{{base_url}}` in URLs
6. Add Authorization header with token

### Insomnia

1. Download: https://insomnia.rest/download
2. Create workspace
3. Add requests
4. Use environment variables
5. Store token for reuse

### curl

```bash
# Create
curl -X POST http://localhost:3000/api/psychoactives \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title": "Test", "slug": "test"}'

# Read
curl http://localhost:3000/api/psychoactives/lsd

# Update
curl -X PATCH http://localhost:3000/api/psychoactives/:id \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"warnings": "Updated"}'

# Delete
curl -X DELETE http://localhost:3000/api/psychoactives/:id \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### VS Code REST Client

1. Install "REST Client" extension
2. Create `cms-api.http` file:

```http
@baseUrl = http://localhost:3000
@token = YOUR_TOKEN

### Get psychoactives
GET {{baseUrl}}/api/psychoactives?limit=10

### Get single
GET {{baseUrl}}/api/psychoactives/lsd

### Create new
POST {{baseUrl}}/api/psychoactives
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "title": "New Substance",
  "slug": "new-substance"
}
```

## Error Handling

### Common Errors

**400 Bad Request**
```json
{
  "errors": [
    {
      "message": "Field 'slug' is required",
      "field": "slug"
    }
  ]
}
```

**401 Unauthorized**
```json
{
  "errors": [
    {
      "message": "Unauthorized"
    }
  ]
}
```

**404 Not Found**
```json
{
  "errors": [
    {
      "message": "Document not found"
    }
  ]
}
```

## Tips & Best Practices

1. **Use the admin panel for manual editing** - It's easier for individual changes
2. **Use the API for automation** - Scripts, imports, bulk operations
3. **Always test with GET first** - Understand the data structure
4. **Use PATCH, not PUT** - Update only changed fields
5. **Keep slugs URL-safe** - Lowercase, hyphens, no spaces
6. **Backup before bulk operations** - Database is in `data.db`
7. **Test locally first** - Don't test in production
8. **Validate JSON** - Use a validator before sending
9. **Store your token** - Don't hardcode in scripts
10. **Check response status** - 200/201 = success

## Next Steps

1. Log in via `/api/users/login`
2. Get your token
3. Try reading data with GET
4. Create a test entry
5. Update the test entry
6. Delete the test entry
7. Build your automation scripts

## Getting Help

- Payload REST API Docs: https://payloadcms.com/docs/rest-api/overview
- Admin Panel Guide: [ADMIN_GUIDE.md](./ADMIN_GUIDE.md)
- Admin Documentation: [PAYLOAD_ADMIN.md](./PAYLOAD_ADMIN.md)
- GitHub Issues: Report problems

---

Happy automating! 🚀
