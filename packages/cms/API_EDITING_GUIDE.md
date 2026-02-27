# API Editing Guide

Complete guide to editing Psych Combo content using the REST API.

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
- API client (Postman, Insomnia, or curl)
- Server at: `http://localhost:3000`

### Testing the Connection

```bash
curl http://localhost:3000/health
# Should return: {"status":"ok","message":"Payload CMS is running"}
```

## Authentication

Currently, the API is open for local development. In production, you'll need to:

1. Create a user account
2. Log in to get a token
3. Include token in requests

```bash
# Login (when auth is enabled)
POST http://localhost:3000/api/users/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "your-password"
}

# Response includes token
{
  "token": "eyJhbGc...",
  "user": {...}
}

# Use token in subsequent requests
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

{
  "title": "Psilocybin Mushrooms",
  "slug": "psilocybin-mushrooms",
  "aka": [
    { "alias": "Magic Mushrooms" },
    { "alias": "Shrooms" },
    { "alias": "Psilocybe" }
  ],
  "family_members": "4-HO-DMT, 4-PO-DMT",
  "duration_chart": {
    "total": "4-6 hours",
    "onset": "20-40 minutes",
    "coming_up": "30-60 minutes",
    "plateau": "2-3 hours",
    "coming_down": "1-2 hours",
    "after_effects": "2-8 hours"
  },
  "positive_effects": "euphoria, visual hallucinations, introspection, spiritual experiences",
  "negative_effects": "nausea, confusion, anxiety, paranoia",
  "neutral_effects": "pupil dilation, altered perception, time distortion",
  "dosage_table": {
    "threshold": "0.25g",
    "light": "0.25-1g",
    "common": "1-2.5g",
    "strong": "2.5-5g",
    "heavy": "5g+"
  },
  "image_location": "/images/psilocybin.jpg",
  "image_caption": "Psilocybe cubensis mushrooms",
  "warnings": "Do not combine with MAOIs. Can trigger latent mental health issues."
}
```

### Update Psychoactive

Update specific fields (PATCH):

```bash
PATCH http://localhost:3000/api/psychoactives/:id
Content-Type: application/json

{
  "warnings": "Updated warning text. Do not combine with MAOIs or SSRIs."
}
```

Replace entire document (PUT - less common):

```bash
PUT http://localhost:3000/api/psychoactives/:id
Content-Type: application/json

{
  "title": "Complete replacement object",
  // ... all fields required
}
```

### Delete Psychoactive

```bash
DELETE http://localhost:3000/api/psychoactives/:id
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
| neutral_effects | string | No | Comma-separated |
| dosage_table | object | No | Dosage ranges |
| image_location | string | No | Image path |
| image_caption | string | No | Image description |
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
            {
              "type": "text",
              "text": "Overview"
            }
          ]
        },
        {
          "type": "paragraph",
          "children": [
            {
              "type": "text",
              "text": "Combining LSD and psilocybin mushrooms is generally not recommended..."
            }
          ]
        }
      ]
    }
  }
}
```

**Note:** The `content` field uses Lexical editor format. For simple text, you can also use markdown format in migration.

### Update Combo

```bash
PATCH http://localhost:3000/api/combos/:id
Content-Type: application/json

{
  "title": "Updated Title"
}
```

### Delete Combo

```bash
DELETE http://localhost:3000/api/combos/:id
```

### Combo Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Combination name |
| slug | string | Yes | URL identifier |
| drug1 | string | Yes | First drug slug |
| drug2 | string | Yes | Second drug slug |
| content | object | No | Rich text content |

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

{
  "risk_level": "MR",
  "confidence": "MC"
}
```

### Delete Risk

```bash
DELETE http://localhost:3000/api/risks/:id
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

## Using Postman

### Setting Up

1. Download Postman: https://www.postman.com/downloads/
2. Create a new collection: "PsychCombo CMS"
3. Add environment with variable:
   - `base_url`: `http://localhost:3000`

### Example Request

1. New Request → POST
2. URL: `{{base_url}}/api/psychoactives`
3. Headers:
   - `Content-Type`: `application/json`
4. Body → raw → JSON:
   ```json
   {
     "title": "Test Substance",
     "slug": "test-substance"
   }
   ```
5. Send

### Saving Requests

- Save each request type (GET, POST, PATCH, DELETE)
- Organize by collection (Psychoactives, Combos, Risks)
- Add descriptions and examples

## Using curl

### Create

```bash
curl -X POST http://localhost:3000/api/psychoactives \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Substance",
    "slug": "test-substance"
  }'
```

### Read

```bash
curl http://localhost:3000/api/psychoactives/lsd
```

### Update

```bash
curl -X PATCH http://localhost:3000/api/psychoactives/:id \
  -H "Content-Type: application/json" \
  -d '{
    "warnings": "Updated warning"
  }'
```

### Delete

```bash
curl -X DELETE http://localhost:3000/api/psychoactives/:id
```

## Using VS Code REST Client

1. Install "REST Client" extension
2. Create file: `cms-api.http`
3. Add requests:

```http
### Variables
@baseUrl = http://localhost:3000

### Get all psychoactives
GET {{baseUrl}}/api/psychoactives?limit=10

### Get single psychoactive
GET {{baseUrl}}/api/psychoactives/lsd

### Create new psychoactive
POST {{baseUrl}}/api/psychoactives
Content-Type: application/json

{
  "title": "New Substance",
  "slug": "new-substance"
}

### Update psychoactive
PATCH {{baseUrl}}/api/psychoactives/PASTE_ID_HERE
Content-Type: application/json

{
  "warnings": "Updated warning"
}

### Delete psychoactive
DELETE {{baseUrl}}/api/psychoactives/PASTE_ID_HERE
```

4. Click "Send Request" above each request

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

**500 Server Error**
```json
{
  "errors": [
    {
      "message": "Internal server error"
    }
  ]
}
```

### Validation

- Slugs must be unique
- Required fields must be provided
- Field types must match schema
- Rich text must be valid Lexical format

## Tips & Best Practices

1. **Always test with GET first** - Understand the data structure
2. **Use PATCH, not PUT** - Update only changed fields
3. **Keep slugs URL-safe** - Use lowercase, hyphens, no spaces
4. **Backup before bulk operations** - SQLite database is in `data.db`
5. **Test locally** - Don't test destructive operations in production
6. **Use consistent naming** - Follow existing patterns
7. **Validate JSON** - Use a JSON validator before sending
8. **Save request templates** - Reuse in Postman/Insomnia
9. **Check response status** - 200/201 = success, 400/500 = error
10. **Review existing entries** - Match the structure and style

## Next Steps

1. Start the CMS server
2. Try reading existing data with GET requests
3. Create a test entry
4. Update the test entry
5. Delete the test entry
6. Create real content

## Getting Help

- Check Payload REST API docs: https://payloadcms.com/docs/rest-api/overview
- Review existing data structure via GET requests
- Ask in GitHub Discussions
- Open an issue for bugs

## Future Enhancements

- [ ] Postman collection with all endpoints
- [ ] Example scripts for bulk operations
- [ ] Validation helpers
- [ ] Migration tools
- [ ] Admin UI when Payload/Next.js compatibility is resolved

---

Happy editing! 🚀
