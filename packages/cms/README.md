# PsychCombo CMS

Content Management System for PsychCombo using Payload CMS with SQLite.

## Quick Start

```bash
# Install dependencies (from repository root)
npm install

# Start the CMS
npm run dev --workspace cms
```

**Access the admin panel at:** http://localhost:3000/admin

On first visit, you'll create your first admin user.

## Admin Panel

The Payload CMS admin panel provides a full-featured interface for managing content:

- ✅ User authentication and management
- ✅ Rich content editing for Psychoactives, Combos, and Risks
- ✅ Media management
- ✅ Search and filtering
- ✅ Version history
- ✅ Access control

**See [PAYLOAD_ADMIN.md](./PAYLOAD_ADMIN.md) for complete admin documentation.**

## REST API

The CMS also provides a REST API for programmatic access:

### Endpoints

**Psychoactives:**
- `GET /api/psychoactives` - List all
- `GET /api/psychoactives/:slug` - Get by slug
- `POST /api/psychoactives` - Create new
- `PATCH /api/psychoactives/:id` - Update
- `DELETE /api/psychoactives/:id` - Delete

**Combos:**
- `GET /api/combos` - List all
- `GET /api/combos/:slug` - Get by slug
- `POST /api/combos` - Create new
- `PATCH /api/combos/:id` - Update
- `DELETE /api/combos/:id` - Delete

**Risks:**
- `GET /api/risks` - List all
- `GET /api/risks/:drug1/:drug2` - Get specific risk
- `POST /api/risks` - Create new
- `PATCH /api/risks/:id` - Update
- `DELETE /api/risks/:id` - Delete

**Health Check:**
- `GET /health` - API status

### Example Usage

```bash
# Get all psychoactives
curl http://localhost:3000/api/psychoactives

# Get LSD information
curl http://localhost:3000/api/psychoactives/lsd

# Get LSD + MDMA combo
curl http://localhost:3000/api/combos/lsd_mdma

# Get risk for LSD + MDMA
curl http://localhost:3000/api/risks/lsd/mdma
```

**See [API_EDITING_GUIDE.md](./API_EDITING_GUIDE.md) for complete API documentation.**

## Database

Uses SQLite with the database stored in `data.db`. The database is automatically created on first run.

### Migrations

```bash
# Create a new migration
npm run payload migrate:create <name> --workspace cms

# Run pending migrations
npm run payload migrate --workspace cms
```

## Collections

### Psychoactives
Individual substances with info on duration, effects, dosage, warnings, etc.

### Combos
Drug combination information with rich text content.

### Risks
Risk ratings for drug combinations with confidence levels.

### Users
Admin users with authentication.

## Data Schema

### Psychoactive

```typescript
{
  title: string
  slug: string
  aka?: Array<{alias: string}>
  family_members?: string
  image_caption?: string
  image_location?: string
  duration_chart?: {
    total?: string
    onset?: string
    coming_up?: string
    plateau?: string
    coming_down?: string
    after_effects?: string
  }
  positive_effects?: string
  negative_effects?: string
  neutral_effects?: string
  dosage_table?: {
    threshold?: string
    light?: string
    common?: string
    strong?: string
    heavy?: string
  }
  warnings?: string
  content?: RichText
}
```

### Combo

```typescript
{
  title: string
  slug: string
  drug1: string
  drug2: string
  content: RichText
}
```

### Risk

```typescript
{
  drug1: string
  drug2: string
  combo: string
  risk_level: 'SR' | 'GR' | 'MR' | 'LRS' | 'LRD' | 'LR' | 'ND'
  confidence?: 'HC' | 'MC' | 'LC' | 'NC'
}
```

**Risk Levels:**
- SR - Significant Risk
- GR - Greater Risk  
- MR - Minor Risk
- LRS - Low Risk Synergy
- LRD - Low Risk Decrease
- LR - Low Risk
- ND - No Data

**Confidence Levels:**
- HC - High Confidence
- MC - Medium Confidence
- LC - Low Confidence
- NC - No Confidence

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
PORT=3000
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
DATABASE_URL=file:./data.db
PAYLOAD_SECRET=your-secret-key-here
WEBSITE_URL=http://localhost:3333
```

## Production

```bash
# Build
npm run build --workspace cms

# Start
npm run start --workspace cms
```

### Deployment Requirements

- Node.js 18+
- Persistent storage for SQLite database
- Environment variables configured

### Recommended Hosting

- Railway
- Render
- DigitalOcean App Platform
- Any Node.js hosting with persistent storage

## Documentation

- **[PAYLOAD_ADMIN.md](./PAYLOAD_ADMIN.md)** - Complete admin panel guide
- **[API_EDITING_GUIDE.md](./API_EDITING_GUIDE.md)** - REST API documentation
- **[ADMIN_GUIDE.md](./ADMIN_GUIDE.md)** - Admin usage guide

## Getting Help

- [Payload CMS Documentation](https://payloadcms.com/docs)
- Open an issue on GitHub
- Check existing issues and discussions
