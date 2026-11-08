# Architecture — KRAN Design System

## Summary

The KRAN Design System is a **single-page application (SPA)** built with **Vite 6**, **React 18**, and **React Router 7**. Domain code is organized under `src/domain/<name>/` with clear folders (components, pages, routes, services, etc.), but **there is no Module Federation**, no `remoteEntry`, and **no independent remote deployment** in this repository.

Treat the design as **modular monolith + lazy routes**: one build artifact, explicit domain boundaries, and a central page registry.

Probity Client (`probity-client`) is the **read-only UI reference** for shared components; it is not bundled as a remote.

```
┌─────────────────────────────────────────────────────────────┐
│  Host shell (src/app/)                                       │
│  Auth, seats, providers, PrimaryNav, SecondaryNav, header    │
│  DASHBOARD_PAGE_REGISTRY → lazy domain pages                 │
└──────────────────────────┬──────────────────────────────────┘
                           │
     ┌─────────────────────┼─────────────────────┐
     ▼                     ▼                     ▼
 src/domain/*         src/shared/*          src/app/redux
 (business UI)        (components, API)     (combined slices)
```

## Host responsibilities

| Area | Location |
|------|----------|
| Entry | `src/main.jsx` → `AppProviders` → `App` |
| Routing | `src/app/routes/AppRoutes.jsx` |
| Auth guards | `RequireAuth`, `GuestOnly`, `SessionGuard`, `SessionSync`, `sessionBootstrap` |
| Global providers | Redux, i18n, `ActionConfirmProvider`, `FontSizeProvider`, accessibility, `AppScrollManager` |
| Application shell | `src/app/shell/` (nav, layout, page header, document title) |
| Module portal | `/home` — `PORTAL_LANDING_MODULES` (+ footer modules) in `portalModules.js` |
| Page registry | `src/app/routes/loadDomainPages.js` |
| Route helpers | `src/shared/constants/moduleRoutes.js` |
| Setup return Home | `src/app/shell/utils/setupReturnNav.js` (sessionStorage) |

## Domain (module) responsibilities

Each active reference domain under `src/domain/` should own:

- `routes/index.js` — exports a map of `'primaryId:secondaryId'` → `lazyPage(...)`
- `pages/` — screen components
- `components/`, `hooks/`, `services/`, `constants/` as needed
- Domain Redux slice (if used), registered in `src/app/store`

Domains **must not** duplicate shell chrome (global header, primary nav). Use `PageSectionHeaderBar` via the shell and `useRegisterDashboardPageHeaderActions` for page actions.

## Routing model

- **No** global `/dashboard` prefix; legacy URLs redirect via `canonicalizeModulePathname` / `legacyDashboardPathToModuleRoute`.
- **No** `:accountId` in user-facing paths.
- Module prefixes (see `MODULE_ROUTE_PREFIX`):

  - `/component-workbench`
  - `/module-1`
  - `/design-guidelines`
  - `/module-2`
  - `/administration/setup`
  - `/administration/asset`

- Catch-all `/:primaryTab/:secondaryTab` still mounts the dashboard shell for Probity-style finance tabs carried in the repo for parity/mock demos.

Build routes with `getModuleRoute(primaryId, secondaryId)` — never hardcode deprecated paths.

## Page loading contract

1. **URL (per tab)** → `useDashboardRouteIds()` derives `primaryId` / `secondaryId` from `location.pathname`.
2. **`DashboardContent`** calls `resolveDashboardPage(primary, secondary)` from those ids (Redux is synced by `useDashboardRouteSync`, not the sole source of truth for which page renders).
3. `useDashboardRouteSync` runs in `DashboardLayout` to align Redux with the URL on load and history navigation.
4. Shell **`NavLink`** items must not dispatch `setDashboardNav` in `onClick` (breaks open-in-new-tab / Ctrl+click isolation).
5. `lazyPage` uses `React.lazy` + one automatic retry; `retryLazyPages()` can refresh loaders after HMR failures.

Full host rules: **[HOST_SHELL_INTEGRATION.md](./HOST_SHELL_INTEGRATION.md)**.

If no registry entry exists, the shell shows a placeholder or skeleton — register every navigable tab in the domain `routes/index.js` and merge in `loadDomainPages.js`.

## State boundaries

- **Redux (RTK)** — dashboard nav highlight (synced from URL), auth user snapshot, domain server cache (`src/app/store`).
- **React Hook Form** — modal and form screens (validate → confirm → mutate pattern).
- **sessionStorage** — per-tab access token and seat flags; Setup return route (`setupReturnNav.js`).
- **localStorage** — session mirror for other tabs (`sessionMirror.js`); not sent via BroadcastChannel.
- **Module-local `useState`** — dialogs, filters, UI toggles.

Multi-tab logout and hydration: see **HOST_SHELL_INTEGRATION.md**.

Avoid importing another domain’s internal components; share via `src/shared/` only.

## Cross-module navigation

- Portal tiles and gold nav use `getModuleRoute` and `PORTAL_LANDING_MODULES` / `PORTAL_FOOTER_MODULES`.
- Entering Setup from another module should call `saveSetupReturnRoute(location)` before navigation (see shell/nav integration).
- Header **Home**: inside Setup area → last saved module path; otherwise → `/home`.

## Error handling

- `ErrorBoundary` / `RouteErrorBoundary` in shared components.
- Lazy load retry in `lazyPage.js`; no remote fallback UI (no remotes).

## Deployment model

- **One** `npm run build` output in `dist/`.
- `VITE_PUBLIC_URL` sets Vite `base` for subdirectory hosting.
- **Not supported here:** separate host/remote versions, runtime remote loading, or federated shared dependency negotiation.

### Smallest path to real MFE (future)

If independent deployment becomes a requirement:

1. Extract one domain’s routes + pages into a federated remote with explicit `exposes`.
2. Keep shell + registry in the host; replace static imports with dynamic `import('remote/Page')` guarded by error UI.
3. Pin shared `react` / `react-dom` versions across host and remotes.
4. Document dev URLs and CI build matrix before claiming MFE in guidelines.

## Key files

| File | Role |
|------|------|
| `src/app/routes/loadDomainPages.js` | Registry merge |
| `src/app/shell/hooks/useDashboardPageHeader.js` | Title/subtitle for shell header |
| `src/shared/constants/moduleRoutes.js` | Canonical URLs |
| `src/shared/components/page/PageSectionHeaderBar.jsx` | Shared page header chrome |
