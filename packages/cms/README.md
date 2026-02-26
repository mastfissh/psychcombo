# PsychCombo CMS

This package contains the Payload CMS implementation for managing PsychCombo content.

## Setup

1. Install dependencies (from root):
   ```bash
   npm install
   ```

2. Copy environment file:
   ```bash
   cd packages/cms
   cp .env.example .env
   ```

3. Update `.env` with your configuration (especially `PAYLOAD_SECRET`)

## Development

Start the CMS development server:

```bash
npm run dev --workspace cms
```

The admin panel will be available at http://localhost:3000/admin

## Database

This CMS uses SQLite for data storage. The database file is created at `data.db` in the cms package directory.

## Collections

### Psychoactives
Individual psychoactive substances with:
- Basic info (title, aliases, family members)
- Duration chart (onset, plateau, etc.)
- Effects (positive, negative, neutral)
- Dosage table
- Images and warnings

### Combos
Drug combination information:
- Title
- Drug 1 and Drug 2 identifiers
- Rich text content (reports, research)

### Risks
Risk ratings for drug combinations:
- Drug pairs
- Risk level (SR, GR, MR, LRS, LRD, LR, ND)
- Confidence level (HC, MC, LC, NC)

## Migration

To migrate existing content from MDX files:

```bash
npm run migrate --workspace cms
```

## Production Build

```bash
npm run build --workspace cms
npm run start --workspace cms
```

## API Access

The CMS provides a REST API for content access:

### Endpoints

#### Psychoactives

- **GET /api/psychoactives** - List all psychoactives
  - Query params: `limit` (default: 100), `page` (default: 1), `where` (JSON filter)
  - Example: `GET /api/psychoactives?limit=10&page=1`

- **GET /api/psychoactives/:slug** - Get single psychoactive by slug
  - Example: `GET /api/psychoactives/lsd`

#### Combos

- **GET /api/combos** - List all combos
  - Query params: `limit` (default: 100), `page` (default: 1), `where` (JSON filter)
  - Example: `GET /api/combos?limit=50`

- **GET /api/combos/:slug** - Get single combo by slug
  - Example: `GET /api/combos/lsd_mdma`

#### Risks

- **GET /api/risks** - List all risks
  - Query params: `limit` (default: 1000), `page` (default: 1), `where` (JSON filter)

- **GET /api/risks/:drug1/:drug2** - Get risk data for specific drug combination
  - Example: `GET /api/risks/lsd/mdma`
  - Note: Drug order doesn't matter (automatically sorted)

#### Health Check

- **GET /health** - API health check
  - Returns: `{"status": "ok", "message": "Payload CMS API is running"}`

### Example Usage

```bash
# Get all psychoactives
curl http://localhost:3000/api/psychoactives

# Get LSD information
curl http://localhost:3000/api/psychoactives/lsd

# Get LSD + MDMA combo information
curl http://localhost:3000/api/combos/lsd_mdma

# Get risk data for LSD + MDMA
curl http://localhost:3000/api/risks/lsd/mdma

# Check API health
curl http://localhost:3000/health
```

## Data Schema

### Psychoactive

```typescript
{
  title: string
  slug: string
  aka?: string[]  // Aliases
  family_members?: string[]
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
    title?: string
    threshold?: string
    light?: string
    common?: string
    strong?: string
    heavy?: string
  }
  warnings?: string
  content?: RichText  // Lexical editor format
}
```

### Combo

```typescript
{
  title: string
  slug: string
  drug1: string
  drug2: string
  content: RichText  // Lexical editor format
}
```

### Risk

```typescript
{
  drug1: string
  drug2: string
  combo: string  // Auto-generated: "drug1_drug2" (sorted)
  risk_level: 'SR' | 'GR' | 'MR' | 'LRS' | 'LRD' | 'LR' | 'ND'
  confidence?: 'HC' | 'MC' | 'LC' | 'NC'
}
```

### Risk Levels

- **SR** - Significant Risk
- **GR** - Greater Risk
- **MR** - Minor Risk
- **LRS** - Low Risk Synergy
- **LRD** - Low Risk Decrease
- **LR** - Low Risk
- **ND** - No Data

### Confidence Levels

- **HC** - High Confidence
- **MC** - Medium Confidence
- **LC** - Low Confidence
- **NC** - No Confidence

## Deployment

### Requirements

- Node.js 18+
- Environment variables configured
- Persistent storage for SQLite database

### Environment Variables

```bash
PORT=3000
PAYLOAD_PUBLIC_SERVER_URL=https://your-cms-url.com
DATABASE_URL=file:./data.db
PAYLOAD_SECRET=your-secret-key-change-this-in-production
WEBSITE_URL=https://psychcombo.com
```

### Recommended Hosting

- Railway
- Render
- DigitalOcean App Platform
- Any Node.js hosting with persistent storage

### Database Persistence

The SQLite database file (`data.db`) must be persisted between deployments. Configure your hosting platform to:
1. Mount a persistent volume for the database file
2. Back up the database regularly
3. Use read replicas if needed for high traffic
