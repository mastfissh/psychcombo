# Shared Package

Shared utilities and types used across the PsychCombo monorepo.

## Overview

This package contains TypeScript utilities, types, and data that are shared between the mobile and website packages.

## Important Notes

- **This package is NOT published to npm** - it's a local workspace package consumed via `file:` protocol
- **Exports TypeScript source directly** - no build step required
- **Consumed by packages that natively handle TypeScript** (Astro, Expo)

## Usage

Import from this package in other workspace packages:

```typescript
import { combo, linkify, risk } from "shared";
```

For JSON data:

```typescript
import risksData from "shared/risks.json";
```

## Contents

- **index.ts** - Main module with utility functions
- **combos.json** - Combination data
- **risks.json** - Risk assessment data
- **psychoactives.json** - Psychoactive substances data

## Development

Since this package exports TypeScript source files directly, there's no build step. Changes are immediately available to consuming packages.

To verify TypeScript correctness:

```bash
npm run typecheck --workspace shared
```

## Architecture Decision

This package uses the "source export" pattern rather than building to JavaScript because:

1. All consuming packages (mobile with Expo, website with Astro) handle TypeScript natively
2. Eliminates build step complexity
3. Provides better IDE integration and type checking
4. Source maps and debugging work seamlessly
5. Faster development iteration
