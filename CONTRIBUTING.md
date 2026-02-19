# Contributing to PsychCombo

Thank you for your interest in contributing to PsychCombo! This document provides guidelines for working with our monorepo setup.

## Monorepo Structure

This repository uses [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) to manage multiple packages:

```
psychcombo/
├── packages/
│   ├── mobile/     # React Native mobile app
│   ├── shared/     # Shared utilities and types
│   └── website/    # Astro-based website
├── package.json    # Root workspace configuration
└── tsconfig.json   # Root TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 22.x or later
- npm 11.x or later

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mastfissh/psychcombo.git
   cd psychcombo
   ```

2. Install all dependencies (this installs dependencies for all workspaces):
   ```bash
   npm install
   ```

## Working with Workspaces

### Running Scripts in All Workspaces

```bash
# Build all packages
npm run build

# Run tests in all packages
npm run test

# Lint all packages
npm run lint

# Format all packages
npm run format
```

### Running Scripts in Specific Workspaces

```bash
# Run website dev server
npm run dev --workspace website

# Build mobile app
npm run build --workspace mobile

# Run tests in shared package
npm run test --workspace shared
```

### Adding Dependencies

```bash
# Add a dependency to a specific workspace
npm install <package> --workspace website

# Add a dev dependency to a specific workspace
npm install <package> --save-dev --workspace mobile

# Add a dependency to the root workspace
npm install <package> -w
```

## Shared Package

The `shared` package contains utilities and types used by both the mobile and website packages.

### Using the Shared Package

The shared package is referenced as a local file dependency:

```json
{
  "dependencies": {
    "shared": "file:../shared"
  }
}
```

### Modifying Shared Code

When you modify code in the `shared` package, the changes are immediately available to other packages without needing to rebuild or reinstall.

## Code Quality

### TypeScript

All packages use TypeScript. The root `tsconfig.json` defines shared compiler options and path mappings.

Each package has its own `tsconfig.json` that extends the root configuration:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true
  }
}
```

### Linting

Run linting across all packages:

```bash
npm run lint
```

### Testing

Run tests across all packages:

```bash
npm run test
```

## Development Workflow

1. Create a new branch for your changes
2. Make your changes in the appropriate package(s)
3. Test your changes locally
4. Run linting and type checking
5. Commit your changes with clear commit messages
6. Push your branch and create a pull request

## Package-Specific Guidelines

### Website Package

- Built with [Astro](https://astro.build/)
- Deployed to Cloudflare Pages
- See `packages/website/README.md` for more details

### Mobile Package

- Built with [Expo](https://expo.dev/) and React Native
- Uses NativeWind for styling
- See `packages/mobile/README.md` for more details

### Shared Package

- Contains TypeScript utilities and types
- Must remain framework-agnostic
- Changes here affect both mobile and website packages

## Troubleshooting

### Clean Install

If you encounter dependency issues:

```bash
# Clean all node_modules
npm run clean

# Reinstall everything
npm install
```

### Workspace Not Found

Ensure you're running commands from the repository root directory.

## Questions?

If you have questions or need help, please open an issue on GitHub.
