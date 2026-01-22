# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Level-X is a platform for deploying Level 4 autonomous digital employees (AI agents) that can handle complex workflows independently. The client is a Next.js 15 application with TypeScript, Tailwind CSS, and Zustand state management.

## Key Commands

### Development
- `pnpm dev` - Start Next.js development server on port 3000
- `pnpm dev:widget` - Watch mode for widget development
- `make dev` - Start development server with experimental HTTPS (uses yarn/concurrently)

### Building
- `pnpm build` - Production build of Next.js app
- `pnpm build:widget` - Build standalone widget bundle (outputs to `public/widget.js`)

### Quality Checks
- `pnpm lint` - Run ESLint on the codebase
- No separate typecheck script - TypeScript checking happens during build

### Testing
- `pnpm test` or `npx playwright test` - Run Playwright end-to-end tests
- Tests are configured to auto-start dev server on port 3000
- Test files in `tests/` directory (currently only `e2e.spec.ts`)

### Other
- `make clean` - Remove `.next` and `node_modules`
- `make install` - Install dependencies with yarn

## Architecture

### Multi-Tenant Workspace Model
The application uses a workspace-based multi-tenancy model:
- Users belong to one or more workspaces
- Each agent belongs to a workspace
- Workspace ID is sent via `X-Workspace-ID` header in API requests
- Workspace state managed in `src/store/workspaceStore.ts` with Zustand persistence

### Authentication Flow
- JWT-based auth with token stored in localStorage and cookies
- Token key: `boltz_by_alpinesbolt_auth_token`
- Auth store at `src/store/authStore.ts` handles user state, login/logout
- On 401 responses, `apiRequest()` automatically calls `logout()`
- Cookie set with 7-day expiry, secure, samesite=strict

### API Architecture
- Backend API proxied through Next.js rewrites: `/v1/*` → `${API_BASE_URL}/api/v1/*`
- Centralized API client in `src/lib/api.ts`
- All API calls use `apiRequest()` helper which:
  - Automatically adds auth token from localStorage/cookie
  - Adds workspace ID header from localStorage
  - Handles 401 by triggering logout
  - Uses `fetch` with credentials: 'include'

### State Management (Zustand)
All stores in `src/store/`:
- `authStore.ts` - User authentication state
- `workspaceStore.ts` - Current workspace and workspace list
- `agentStore.ts` - Agent data and CRUD operations
- `dashboardStore.ts` - Dashboard state
- `toastStore.ts` - Toast notifications
- `aiModelsStore.ts` - AI model configurations
- `agentDetailStore.ts` - Individual agent details
- `recentActionsStore.ts` - Recent activity tracking
- `supportedProvidersStore.ts` - AI provider configurations

All stores use Zustand's `persist` middleware with localStorage.

### Widget System
The platform includes an embeddable chat widget:
- Built separately with Vite: `vite.widget.config.ts`
- Entry point: `src/widget/index.ts`
- Compiled as IIFE bundle to `public/widget.js`
- External sites include via script tag with `window.LEVEL_X_CONFIG`
- Widget API routes: `src/app/api/widget/{chat,config}/route.ts`

### Next.js App Router Structure
```
src/app/
├── (auth)/               # Auth route group: login, register, forgot-password
├── dashboard/            # User dashboard
├── workspace/
│   └── [workspaceId]/    # Workspace-scoped routes
│       ├── agent/[id]/   # Agent detail & preview
│       ├── activities/   # Activity feed
│       ├── analytics/    # Analytics dashboard
│       ├── create/       # Create new agent
│       ├── feedback/     # Feedback management
│       ├── icps/         # ICP (Ideal Customer Profile) management
│       ├── instructions/ # Agent instructions
│       ├── integrations/ # Integration settings
│       ├── knowledge/    # Knowledge base management
│       ├── market/       # Market/template agents
│       ├── objectives/   # Objectives tracking
│       ├── settings/     # Workspace settings
│       └── users/        # User management
├── api/                  # Next.js API routes (widget endpoints)
├── features/             # Feature pages
├── integrations/         # Integration pages
├── pricing/              # Pricing page
├── settings/             # Settings pages
└── superadmin/           # Super admin panel
```

### Component Organization
```
src/components/
├── agent/           # Agent-specific components (creation, config, preview)
├── auth/            # Auth forms and flows
├── common/          # Shared components (Header, etc.)
├── dashboard/       # Dashboard widgets and layouts
├── form/            # Form components
├── landing/         # Landing page sections
├── landing-option/  # Alternative landing page sections
├── layout/          # Layout components
├── objectives/      # Objectives-related components
├── shared/          # Truly shared utilities
├── ui/              # Base UI components (buttons, modals, etc.)
└── workspace/       # Workspace management components
```

### Type System
Core types in `src/types/`:
- `agent.ts` - Agent, AgentAppearance, AgentBehavior, AgentStats, TrainingData
- `aiModels.ts` - AI model types and configurations
- `actions.ts` - Agent actions and API functions
- `conversations.ts` - Chat messages and conversation types
- `sources.ts` - Knowledge source types
- `index.ts` - Profile, Workspace, WorkspaceMember, Integration, KnowledgeBase

Key type patterns:
- `CreateX` types omit server-managed fields (`id`, timestamps)
- `UpdateX` types use `Partial<>` of main type
- `XWithRelations` types include nested related data
- Path aliases: `@/` maps to `src/`

### Agent Type Serialization
The platform supports multiple agent types with custom serialization:
- See `src/lib/agentTypeSerializer.ts` for type conversion logic
- Agent types stored as numbers in DB, displayed with labels in UI
- Types include: Chatbot, Customer Support, Sales, Lead Gen, etc.

## Development Patterns

### Environment Variables
- `.env.example` shows required variables
- `API_BASE_URL` - Backend API base URL (used in next.config.js rewrites)
- `NEXT_PUBLIC_API_URL` - Public-facing API URL (available client-side)
- Firebase config likely needed but not in example file

### Path Aliases
- `@/` resolves to `src/` (configured in tsconfig.json)
- Always use `@/` imports, never relative paths between top-level directories

### Styling
- Tailwind CSS 4.x with custom theme in `tailwind.config.js`
- Custom color palette: primary (cyan/sky), secondary (purple/violet)
- Font families: Inter (sans), Lexend (display)
- Custom animations: fade-in, slide-up
- Typography plugin enabled for markdown rendering

### Code Quality
- ESLint with `next/core-web-vitals` and `next/typescript` configs
- Strict TypeScript mode enabled
- Target: ES5 output, ESNext modules

## Important Notes

### Widget Development
When working on the widget:
1. Edit files in `src/widget/`
2. Run `pnpm dev:widget` for watch mode
3. Widget exposes global `window.LevelXWidget` API
4. Test by loading `public/widget.js` in demo HTML

### API Request Pattern
Always use the centralized `apiRequest()` from `src/lib/api.ts`:
```typescript
const data = await apiRequest('/endpoint', {
  method: 'POST',
  body: JSON.stringify(payload)
});
```
Never bypass this - it handles auth, workspace context, and error flows.

### Adding New Routes
For workspace-scoped features:
1. Add page under `src/app/workspace/[workspaceId]/your-feature/page.tsx`
2. Use workspace ID from params: `params.workspaceId`
3. Ensure API calls happen after workspace is set in store

### State Persistence
All Zustand stores use localStorage persistence:
- Be cautious with sensitive data
- Clear relevant stores on logout (see `authStore.logout()`)
- Storage keys: `boltz-auth-storage`, `workspace-storage`, `boltz-agent-storage`

### Testing E2E
Playwright tests assume:
- Dev server starts automatically (configured in `playwright.config.ts`)
- Server runs on `http://localhost:3000`
- 120s timeout for server startup
- Tests run in all three browsers (chromium, firefox, webkit)
