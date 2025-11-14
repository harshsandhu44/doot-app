# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Doot is a dating app built as a TypeScript monorepo using npm workspaces. The project is in early setup phase with structure in place but Expo and AWS tooling not yet configured.

## Monorepo Structure

```
doot-app/
├── apps/
│   └── mobile/          # React Native app (Expo - not yet configured)
├── packages/
│   ├── backend/         # AWS AppSync + CDK infrastructure (not yet configured)
│   └── shared/          # Shared TypeScript types and utilities
└── tsconfig.base.json   # Base TypeScript config with strict mode
```

## Key Commands

**Root-level commands** (run from repository root):
```bash
npm run build              # Build all workspaces
npm run type-check         # Type check without emitting files
npm run lint               # Lint all workspaces
npm run test               # Test all workspaces
npm run dev:mobile         # Start mobile dev server
npm run dev:backend        # Start backend dev
npm run clean              # Clean all workspaces and root node_modules
```

**Workspace-specific commands** (use `--workspace` flag):
```bash
npm run build --workspace=packages/shared
npm run dev --workspace=apps/mobile
```

## TypeScript Configuration

### Path Mappings
The base config provides path aliases for importing shared code:
- `@shared/*` → `packages/shared/src/*`
- `@doot-app/shared/*` → `packages/shared/src/*`

Example: `import { User } from '@shared/types'`

### Workspace TypeScript Configs
- **apps/mobile**: Extends base, `noEmit: true` (Metro handles bundling), allows JS
- **packages/backend**: Extends base, Node.js types, emits to `dist/`
- **packages/shared**: Extends base, `composite: true` for project references, generates declarations

### Strict Settings
All workspaces inherit strict TypeScript settings from `tsconfig.base.json`:
- `strict: true`
- `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`
- `noUncheckedIndexedAccess`
- JSX mode: `react-native`

## Architecture Notes

### Monorepo Workspace Layout
This is an npm workspaces monorepo with workspaces defined as `apps/*` and `packages/*`. All workspace packages use the `@doot-app/` scope (e.g., `@doot-app/mobile`, `@doot-app/backend`, `@doot-app/shared`).

### Expected Source Structure
Each workspace expects a `src/` directory (configured in tsconfig `rootDir`). The mobile app also includes `App.tsx` and `app.config.ts` at the root.

### Build Outputs
- Built files go to `dist/` in each workspace
- Mobile app: No emit (bundled by Expo/Metro)
- Backend: Compiles TypeScript to `dist/`
- Shared: Compiles with declaration files to `dist/`

## Current State

The repository has foundational structure but is not yet fully configured:
- ✅ Monorepo structure and npm workspaces configured
- ✅ TypeScript base configuration with strict mode
- ✅ Path mappings for shared package
- ⏳ Expo/React Native setup pending
- ⏳ AWS AppSync/CDK setup pending
- ⏳ Linting and testing tools pending
- ⏳ Source directories (`src/`) not yet created

When adding Expo or AWS tooling, update the stub scripts in each workspace's `package.json`.
