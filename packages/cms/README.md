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

The CMS provides a REST API and GraphQL endpoint:
- REST API: `http://localhost:3000/api`
- GraphQL: `http://localhost:3000/api/graphql`
