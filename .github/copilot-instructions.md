# GitHub Copilot Instructions for PsychCombo

This is a monorepo project containing multiple packages for the PsychCombo application, which provides information about psychoactive substance combinations.

## Repository Structure

This project uses npm workspaces to manage three main packages:

- **packages/website/** - Astro-based website (deployed to Cloudflare Pages)
- **packages/mobile/** - React Native mobile app built with Expo
- **packages/shared/** - Shared utilities, types, and data used by both website and mobile

## Code Style and Conventions

### General Guidelines

- Use TypeScript for all new code
- Follow existing code formatting patterns
- Maintain consistency with existing file naming conventions
- All packages use ESM (type: "module")

### TypeScript

- All packages extend the root `tsconfig.json`
- Use strict type checking
- Avoid `any` types when possible
- Prefer interfaces over types for object shapes

### Imports

- Use ES modules (import/export)
- Use relative imports for local files
- The shared package is imported as `"shared"` in mobile and website packages
- Prefer named exports over default exports

## Monorepo Commands

### Root Level Commands

Run these from the repository root:

```bash
npm run build      # Build all packages
npm run test       # Run tests in all packages
npm run lint       # Lint all packages
npm run format     # Format all packages
npm run clean      # Clean all node_modules
```

### Workspace-Specific Commands

```bash
npm run <script> --workspace <package-name>
npm install <package> --workspace <package-name>
```

### Website Package

- Built with Astro 5.x
- Uses Tailwind CSS v4
- Hosted on Cloudflare Pages
- Dev server runs on port 3333: `npm run dev --workspace website`
- Generate images before building: `npm run gen --workspace website`

### Mobile Package

- Built with Expo SDK ~54.0
- Uses React Native 0.81.x
- Styled with NativeWind (Tailwind for React Native)
- Development: `npm run start --workspace mobile`
- Type checking: `npm run typecheck --workspace mobile`

### Shared Package

- Contains JSON data files: combos.json, psychoactives.json, risks.json
- TypeScript utilities and types
- Must remain framework-agnostic
- Changes here affect both mobile and website

## Testing and Quality

- Always run `npm run lint` before committing
- Run `npm run test` to verify changes
- Use `npm run typecheck` for TypeScript validation
- Test changes in both website and mobile when modifying shared code

## Dependencies

- Add dependencies to specific workspaces, not the root
- Use `--workspace` flag when installing packages
- Shared dependencies should be in the shared package
- Check for security vulnerabilities when adding new dependencies

## Build and Deploy

- Website builds automatically on push to main via GitHub Actions
- Mobile builds are done manually via EAS Build
- Always test website builds locally before pushing: `npm run build --workspace website`

## File Organization

- Keep data files in the shared package
- UI components belong in their respective package (website or mobile)
- Utilities that work across platforms go in shared
- Assets specific to a platform stay in that package

## Common Patterns

### Data Loading

Both packages consume data from the shared package:

```typescript
import { combos, psychoactives, risks } from 'shared';
```

### TypeScript Configuration

Each package extends the root config:

```json
{
  "extends": "../../tsconfig.json"
}
```

### Styling

- Website: Tailwind CSS v4 with Astro
- Mobile: NativeWind (Tailwind-compatible classes for React Native)

## Helpful Tips

- When modifying shared code, consider impact on both mobile and website
- The website generates images at build time (genimg.ts)
- Mobile uses Expo Router for navigation
- Website uses file-based routing via Astro
- Both packages use the same data structures from shared
