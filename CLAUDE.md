# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Turborepo monorepo for the doot-app project. Currently contains a single Expo mobile application with an npm-based workspace structure.

## Architecture

**Monorepo Structure:**

- `apps/mobile` - Expo React Native mobile application (currently the only app)
- `packages/*` - Shared packages directory (currently empty, ready for future shared code)

**Key Technologies:**

- Turborepo for monorepo orchestration and task running
- Expo SDK ~54.0.23 for mobile development
- React 19.1.0 / React Native 0.81.5
- TypeScript 5.9.2
- npm workspaces for package management

**Build System:**

- Turborepo manages parallel task execution across workspace
- Build tasks have dependency chains (`dependsOn: ["^build"]`)
- Development tasks are marked as persistent and uncached
- Build outputs cached in `.next/**` (excluding cache directory)

## Common Commands

**Development:**

```bash
npm run dev                     # Run all apps in dev mode (uses turbo)
npm run dev -- --filter=mobile  # Run only mobile app
cd apps/mobile && npm run dev   # Run mobile app directly with Expo
cd apps/mobile && npm run dev:ios      # Run on iOS simulator
cd apps/mobile && npm run dev:android  # Run on Android emulator
cd apps/mobile && npm run dev:web      # Run in web browser
```

**Building:**

```bash
npm run build            # Build all apps and packages
npm run build -- --filter=mobile  # Build specific app
```

**Code Quality:**

```bash
npm run lint             # Lint all packages
npm run format           # Format code with Prettier
npm run check-types      # Type-check all TypeScript
```

**Turbo Filters:**
Use `--filter=<package-name>` to run commands on specific workspaces. Examples:

- `npm run build -- --filter=mobile`
- `npm run lint -- --filter=mobile`

## Requirements

- Node.js >= 18
- npm 11.4.2 (specified in packageManager field)
- For mobile development: iOS simulator (macOS) or Android emulator

## Mobile App Structure

The mobile app (`apps/mobile`) is a minimal Expo application:

- Entry point: `index.ts`
- Main component: `App.tsx`
- Configuration: `app.json` (Expo config)
- TypeScript configuration extends root tsconfig

## Important Notes

- This is a fresh monorepo with only one app currently - the package structure is ready for expansion
- Turbo tasks are configured with proper dependency chains - respect the `dependsOn` relationships
- Environment files (`.env*`) are included in turbo build inputs but gitignored
