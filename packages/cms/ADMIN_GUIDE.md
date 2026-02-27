# Admin Interface Guide

This guide explains how to use the PsychCombo CMS admin interface to view and manage content through the REST API.

## Overview

The CMS provides two ways to interact with content:

1. **Web Admin Interface** - A browser-based UI for browsing and viewing content
2. **REST API** - Direct API access for programmatic content management

## Accessing the Admin Interface

### Starting the Server

```bash
# From repository root
npm run dev --workspace cms

# Or from packages/cms directory
npm run dev
```

The server will start on port 3000.

### Admin Interface URL

Once the server is running, access the admin interface at:

**http://localhost:3000/admin**

This interface allows you to:
- Browse all psychoactives, combos, and risks
- Search and filter content
- View detailed JSON data for each item
- See statistics about your content

## Admin Interface Features

### Dashboard Statistics

The top of the interface shows:
- Total number of psychoactives
- Total number of combos
- Total number of risk entries

### Collections Tabs

#### 1. Psychoactives Tab
- View all substance information
- Search by title, slug, or alias
- Click "View JSON" to see the full data structure

**What you'll see:**
- Title
- Slug (URL identifier)
- Aliases (aka names)
- Raw JSON data when clicked

#### 2. Combos Tab
- View all drug combination information
- Search by title, drug names, or slug
- See which drugs are combined

**What you'll see:**
- Title
- Drug 1 and Drug 2 identifiers
- Slug
- Raw JSON data when clicked

#### 3. Risks Tab
- View risk ratings for drug combinations
- Search by drug names or risk level
- See confidence levels

**What you'll see:**
- Drug pairs
- Risk level (SR, GR, MR, LRS, LRD, LR, ND)
- Confidence level

#### 4. API Documentation Tab
- Quick reference for API endpoints
- Links to full documentation

## Managing Content via REST API

The admin interface is **read-only** for browsing. To actually create, update, or delete content, you need to use the REST API directly.

### Tools for API Management

**Recommended Tools:**
1. **Postman** - Popular API client with GUI
2. **curl** - Command-line HTTP client
3. **HTTPie** - User-friendly command-line HTTP client
4. **Insomnia** - API client alternative to Postman
5. **VS Code REST Client** - Extension for VS Code

### API Endpoints

All endpoints return JSON data.

#### GET Endpoints (Read)

```bash
# List all psychoactives
GET http://localhost:3000/api/psychoactives?limit=100&page=1

# Get single psychoactive
GET http://localhost:3000/api/psychoactives/lsd

# List all combos
GET http://localhost:3000/api/combos?limit=100&page=1

# Get single combo
GET http://localhost:3000/api/combos/lsd_mdma

# List all risks
GET http://localhost:3000/api/risks?limit=1000&page=1

# Get risk for combination
GET http://localhost:3000/api/risks/lsd/mdma

# Health check
GET http://localhost:3000/health
```

#### Query Parameters

- `limit` - Number of results per page (max 1000)
- `page` - Page number (starts at 1)
- `where` - JSON filter object (advanced)

### Example: Using curl

```bash
# Get all psychoactives
curl http://localhost:3000/api/psychoactives

# Get LSD information
curl http://localhost:3000/api/psychoactives/lsd

# Get LSD + MDMA combo
curl http://localhost:3000/api/combos/lsd_mdma

# Check API health
curl http://localhost:3000/health
```

### Example: Using Postman

1. Open Postman
2. Create a new GET request
3. Enter URL: `http://localhost:3000/api/psychoactives`
4. Click "Send"
5. View the JSON response

### Example: Using HTTPie

```bash
# Install HTTPie
pip install httpie

# Get psychoactives
http GET localhost:3000/api/psychoactives

# Get specific psychoactive
http GET localhost:3000/api/psychoactives/lsd
```

## Content Structure

### Psychoactive Object

```json
{
  "id": "...",
  "title": "LSD",
  "slug": "lsd",
  "aka": [
    { "alias": "Acid", "id": "..." },
    { "alias": "Tabs", "id": "..." }
  ],
  "duration_chart": {
    "total": "6-11 h",
    "onset": "40m",
    "coming_up": "20m",
    "plateau": "270m",
    "coming_down": "4h"
  },
  "positive_effects": "euphoria, empathy, stimulation",
  "negative_effects": "nausea, muscle tension, confusion",
  "dosage_table": {
    "threshold": "10 ug",
    "light": "20-50 ug",
    "common": "50-150 ug",
    "strong": "150-400 ug",
    "heavy": "400+ ug"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Combo Object

```json
{
  "id": "...",
  "title": "LSD + MDMA",
  "slug": "lsd_mdma",
  "drug1": "lsd",
  "drug2": "mdma",
  "content": {
    "root": {
      "type": "root",
      "children": [...]
    }
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Risk Object

```json
{
  "id": "...",
  "drug1": "lsd",
  "drug2": "mdma",
  "combo": "lsd_mdma",
  "risk_level": "LRS",
  "confidence": "HC",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Content Migration

The initial content was migrated from MDX files. To re-run the migration:

```bash
npm run migrate --workspace cms
```

This will import:
- 111 psychoactives from MDX files
- 944 combos from MDX files
- Risk data from JSON files

**Note:** The migration script checks for existing entries and skips duplicates.

## Future: Full Admin UI

Currently, the admin interface is for browsing only. For a full-featured admin UI with editing capabilities, consider:

1. **Payload Admin Panel** (requires additional Next.js setup)
2. **Custom Admin UI** (built with React/Vue/etc.)
3. **Third-party CMS Tools** (like Strapi Studio, Prisma Studio)

The current implementation focuses on the REST API, which provides maximum flexibility for building custom interfaces.

## Troubleshooting

### Server Won't Start

```bash
# Check if port 3000 is available
lsof -i :3000

# Check for errors in output
npm run dev --workspace cms
```

### Can't Access Admin Interface

1. Verify server is running
2. Check console for errors
3. Try accessing http://localhost:3000/health
4. Clear browser cache

### API Returns Errors

1. Check server logs for details
2. Verify request format
3. Ensure database file exists (`data.db`)
4. Try restarting the server

## Best Practices

1. **Always backup the database** before major changes
2. **Test API calls** with a tool like Postman first
3. **Use version control** for database backups
4. **Document custom API integrations**
5. **Monitor server logs** during development

## Getting Help

- See [CMS README](./README.md) for setup and configuration
- See [API Documentation](./README.md#api-access) for endpoint details
- Check [Payload CMS Documentation](https://payloadcms.com/docs) for advanced features

## Next Steps

1. Explore the admin interface
2. Try making API calls with curl or Postman
3. Read the full API documentation
4. Consider building a custom admin UI for your specific needs
5. Set up automated backups for the SQLite database
