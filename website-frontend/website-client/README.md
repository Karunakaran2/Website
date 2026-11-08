# KRAN Design System

Reference host application for KRAN enterprise UI: shared Probity-aligned components, portal modules, auth/seat shell, and modular domain boundaries for product teams.

## Prerequisites

- **Node.js** ≥ 26 (see `package.json` `engines`)
- npm (lockfile committed)

## Quick start

```bash
npm install
npm run dev
```

Default dev server: `http://localhost:5173` (Vite). API calls under `/api` proxy to `VITE_DEV_API_TARGET` or `http://localhost:8080` unless overridden in `.env.development`.

**New to the codebase?** Read [docs/DEVELOPER_ONBOARDING.md](./docs/DEVELOPER_ONBOARDING.md).

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Development server (development mode) |
| `npm run build` | Production bundle to `dist/` |
| `npm run build:report` | Build + top asset size listing |
| `npm run preview` | Serve production build locally |
| `npm run test` | Vitest watch |
| `npm run test:run` | Vitest single run (CI) |

Mode-specific `dev:*` and `build:*` scripts target testing, UAT, and KRAN deployment profiles via Vite `--mode`.

GitHub Actions (`.github/workflows/ci.yml`) runs `test:run`, `build`, and `build:report` on push/PR.

## Application flow

1. **Login** — `ROUTES.LOGIN`
2. **Seat selection** — `ROUTES.SEATS` (authenticated)
3. **Home** — `ROUTES.HOME` (`/home`) module portal after seat is chosen

Module URLs use prefixed paths (no `/dashboard`, no `:accountId`). See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).

## Portal layout

| Surface | Modules |
|---------|---------|
| **`/home` landing** | Module 1 (Sample), Module 2 (Workforce) |
| **Footer** | Component Workbench, Design Guidelines |
| **Header Setup** | Administration — setup masters and fixed assets |

| Area | URL prefix (examples) |
|------|------------------------|
| Module 1 | `/module-1/...` |
| Module 2 | `/module-2/...` |
| Component Workbench | `/component-workbench/...` |
| Design Guidelines | `/design-guidelines/...` |
| Administration | `/administration/setup/...`, `/administration/asset/...` |

## Shared UI

Production-style components live in `src/shared/components/` (aligned with **probity-client** read-only reference). See [docs/SHARED_COMPONENTS.md](./docs/SHARED_COMPONENTS.md).

## Documentation

| Doc | Topic |
|-----|--------|
| [docs/DEVELOPER_ONBOARDING.md](./docs/DEVELOPER_ONBOARDING.md) | Start here |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Host vs domain, routing, registry |
| [docs/MODULE_DEVELOPMENT_GUIDE.md](./docs/MODULE_DEVELOPMENT_GUIDE.md) | Adding a domain module |
| [docs/SHARED_COMPONENTS.md](./docs/SHARED_COMPONENTS.md) | Component catalogue |
| [docs/PERFORMANCE_AND_RELIABILITY.md](./docs/PERFORMANCE_AND_RELIABILITY.md) | Bundle baseline |
| [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) | Common failures |
| [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md) | Conventions |
| [AGENTS.md](./AGENTS.md) | Cursor rules map |

## Tests

```bash
npm run test:run
npm run build
```

No ESLint script is configured in `package.json`; rely on Vitest and production build for regression signal.
