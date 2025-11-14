# Doot App - Setup & Development Guide

## Quick Start Checklist

### 1. Initial Setup (From Fresh Clone)

```bash
# Clone the repository
git clone <repository-url>
cd doot-app

# Install all dependencies (runs npm install in all workspaces)
npm install

# Build shared package and backend (required before development)
npm run build:all
```

### 2. Start Development

```bash
# Start the Expo mobile app
npm run dev:mobile

# Or start backend development (if needed)
npm run dev:backend
```

---

## Available Scripts

### Root Level Commands

- **`npm install`** - Install all workspace dependencies
- **`npm run build:all`** - Build shared package, then backend
- **`npm run build:shared`** - Build only the shared types package
- **`npm run build:backend`** - Build shared, then backend (includes CDK infra)
- **`npm run build`** - Build all workspaces
- **`npm run dev:mobile`** - Start Expo development server
- **`npm run dev:backend`** - Start backend development
- **`npm run type-check`** - Run TypeScript type checking across all workspaces
- **`npm run lint`** - Lint all workspaces
- **`npm run test`** - Run tests in all workspaces
- **`npm run clean`** - Clean all build artifacts and node_modules

### Workspace-Specific Commands

```bash
# Mobile app
npm run start --workspace=apps/mobile      # Start Expo
npm run android --workspace=apps/mobile    # Run on Android
npm run ios --workspace=apps/mobile        # Run on iOS
npm run web --workspace=apps/mobile        # Run on web

# Backend
npm run build --workspace=packages/backend   # Build TypeScript
npm run synth --workspace=packages/backend   # Synthesize CDK
npm run deploy --workspace=packages/backend  # Deploy to AWS

# Shared
npm run build --workspace=packages/shared    # Build shared types
```

---

## Development Workflow

### When Starting New Features

1. **Define shared types first** (if needed)
   - Edit `packages/shared/src/models/*.ts`
   - Run `npm run build:shared`

2. **Update GraphQL schema** (if needed)
   - Edit `packages/backend/schema/schema.graphql`
   - Add corresponding types to shared package

3. **Implement backend resolvers**
   - VTL: `packages/backend/src/appsync/resolvers/vtl/`
   - JS: `packages/backend/src/appsync/resolvers/js/`
   - Lambda: `packages/backend/src/appsync/resolvers/lambda/`

4. **Update CDK infrastructure** (if needed)
   - Edit `packages/backend/src/infra/stack.ts`

5. **Implement mobile screens**
   - Add routes: `apps/mobile/app/(tabs)/`
   - Add components: `apps/mobile/src/components/`
   - Add hooks: `apps/mobile/src/hooks/`

---

## Where to Start Implementing

### 📱 Mobile App (`apps/mobile/`)

#### Screens
- **Auth**: `app/(auth)/login.tsx`, `app/(auth)/signup.tsx`
- **Discover**: `app/(tabs)/discover.tsx` - Swipe/browse profiles
- **Matches**: `app/(tabs)/matches.tsx` - List of matches
- **Chat**: `app/(tabs)/chat/[matchId].tsx` - Messaging
- **Profile**: `app/(tabs)/profile.tsx` - User profile

#### Custom Hooks
- `src/hooks/useAuth.ts` - Authentication logic
- `src/hooks/useDiscovery.ts` - Profile discovery
- `src/hooks/useChat.ts` - Messaging logic

#### Services
- `src/services/auth.ts` - AWS Cognito integration
- `src/services/storage.ts` - Local storage

#### GraphQL
- `src/graphql/client.ts` - AppSync client setup
- `src/graphql/queries.ts` - GraphQL queries
- `src/graphql/mutations.ts` - GraphQL mutations
- `src/graphql/subscriptions.ts` - Real-time subscriptions

### 🔧 Backend (`packages/backend/`)

#### GraphQL Schema
- `schema/schema.graphql` - Complete API definition

#### Resolvers

**VTL (Simple CRUD):**
- `src/appsync/resolvers/vtl/Query.me.*.vtl` - Get current user
- `src/appsync/resolvers/vtl/Query.getUser.*.vtl` - Get user by ID

**JavaScript (Moderate Complexity):**
- `src/appsync/resolvers/js/Mutation.likeUser.ts` - Like logic
- `src/appsync/resolvers/js/Query.discoverProfiles.ts` - Discovery algorithm

**Lambda (Complex Logic):**
- `src/appsync/resolvers/lambda/Mutation.sendMessage.ts` - Message handling

#### Infrastructure
- `src/infra/app.ts` - CDK app entry
- `src/infra/stack.ts` - Main stack (AppSync, DynamoDB, Cognito, Lambda)

### 📦 Shared Types (`packages/shared/`)

#### Domain Models
- `src/models/user.ts` - UserProfile interface
- `src/models/match.ts` - Match interface
- `src/models/message.ts` - Message interface

**To add new types:**
1. Create file in `src/models/`
2. Export from `src/index.ts`
3. Run `npm run build:shared`
4. Import in mobile/backend: `import type { YourType } from '@doot-app/shared'`

---

## Architecture Overview

```
doot-app/
├── apps/
│   └── mobile/              # React Native + Expo app
│       ├── app/             # Expo Router (file-based routing)
│       └── src/             # Source code
├── packages/
│   ├── shared/              # Shared TypeScript types
│   │   └── src/models/      # Domain models (User, Match, Message)
│   └── backend/             # AWS infrastructure
│       ├── schema/          # GraphQL schema
│       └── src/
│           ├── appsync/     # Resolvers (VTL, JS, Lambda)
│           └── infra/       # CDK infrastructure code
```

---

## Technology Stack

- **Mobile**: React Native + Expo + Expo Router + TypeScript
- **Backend**: AWS AppSync (GraphQL) + DynamoDB + Lambda + Cognito
- **Infrastructure**: AWS CDK (Infrastructure as Code)
- **Shared**: TypeScript types for cross-platform consistency

---

## Resolver Strategy

| Type | Use Case | Examples |
|------|----------|----------|
| **VTL** | Simple CRUD operations | Get user, Get match |
| **AppSync JS** | Moderate business logic | Like user, Discovery filter |
| **Lambda** | Complex logic, integrations | Send message, notifications |

---

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Build shared types: `npm run build:all`
3. 🔨 Configure AWS credentials (for backend deployment)
4. 🔨 Implement authentication flow in mobile app
5. 🔨 Implement discovery screen with swipe functionality
6. 🔨 Connect mobile app to AppSync API
7. 🔨 Implement real-time messaging with subscriptions
8. 🔨 Deploy backend: `npm run deploy --workspace=packages/backend`

---

## Troubleshooting

### Build Errors

**Issue**: "Cannot find module '@doot-app/shared'"
**Solution**: Run `npm run build:shared` first

**Issue**: TypeScript errors about unused variables
**Solution**: Either use the variables or comment them out with `// TODO:`

**Issue**: Module resolution errors
**Solution**: Ensure you've run `npm install` at the root level

### Mobile Development

**Issue**: Metro bundler errors
**Solution**: Clear cache: `npx expo start --clear`

**Issue**: TypeScript errors in Expo
**Solution**: Run `npm run build --workspace=apps/mobile` to type-check

### Backend Deployment

**Issue**: CDK synthesis fails
**Solution**: Ensure `npm run build:backend` succeeds first

**Issue**: AWS credentials not configured
**Solution**: Run `aws configure` or set environment variables

---

## Contributing

1. Create feature branch
2. Make changes
3. Run `npm run build:all` to ensure builds succeed
4. Run `npm run type-check` to check types
5. Test locally
6. Submit pull request
