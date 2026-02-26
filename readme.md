# PsychCombo

The website is hosted at https://psychcombo.com/ on Cloudflare Pages.

PsychCombo provides information about psychoactive substance combinations, including risk ratings and interaction data.

## Repository Structure

This is a monorepo project managed with npm workspaces:

- **packages/cms/** - Payload CMS for content management (SQLite)
- **packages/website/** - Astro-based website (Cloudflare Pages)
- **packages/mobile/** - React Native mobile app (Expo)
- **packages/shared/** - Shared utilities and types

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

```bash
# Install all dependencies
npm install

# Build all packages
npm run build
```

## Content Management System

The project now uses Payload CMS for managing content. See [packages/cms/README.md](packages/cms/README.md) for details.

### Quick Start - CMS

```bash
# Set up CMS
cd packages/cms
cp .env.example .env

# Start CMS server
npm run dev --workspace cms

# Migrate existing content (one-time)
npm run migrate --workspace cms
```

The CMS API will be available at http://localhost:3000

## Development

### Website Development

```bash
npm run dev --workspace website
```

The website will be available at http://localhost:3333

### Mobile Development

```bash
npm run start --workspace mobile
```

## Build and Deploy

### Website

The website is automatically deployed to Cloudflare Pages on push to main branch.

```bash
# Build website locally
npm run build --workspace website
```

### CMS

The CMS can be deployed to any Node.js hosting platform that supports SQLite.

```bash
# Build CMS
npm run build --workspace cms

# Start production server
npm run start --workspace cms
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License

See individual package LICENSE files for details.

