# Troubleshooting

## Installation

| Symptom | Check |
|---------|--------|
| `npm install` fails on Node version | Use Node ≥ 26 per `package.json` engines |
| `tailwreck` link errors | `tailwreck` is `file:./tailwreck`; ensure folder exists |

## Dev server

| Symptom | Check |
|---------|--------|
| Port 5173 in use | Stop other Vite instances or set `server.port` in `vite.config.js` temporarily |
| API 404 | `VITE_DEV_API_TARGET` in `.env.development`; Vite proxies `/api` |
| Blank page after pull | Hard refresh; run `npm run build` to catch compile errors |
| CORS captcha on testing host | Use `npm run build:testing` (not `build` / production) for `172.150.0.60:3100` |

## Routing

| Symptom | Check |
|---------|--------|
| Redirect to login on refresh | Seat required routes use `RequireAuth requireSeat`; complete seat selection |
| Old `/dashboard/...` links | Should redirect via `LegacyPathRedirect`; update bookmarks to `getModuleRoute()` URLs |
| Wrong page under Setup Dashboard | Registry key must map to correct lazy import in `administration/setup/routes/index.js` |
| 404 / placeholder in module | Missing `primary:secondary` in `DASHBOARD_PAGE_REGISTRY` |
| **Current tab changes when opening link in new tab** | Remove `onClick` → `activatePrimary` / `activateSecondary` on shell `NavLink`; URL must drive `DashboardContent` — [HOST_SHELL_INTEGRATION.md](./HOST_SHELL_INTEGRATION.md) |
| Page content ≠ address bar | Ensure `DashboardContent` uses `useDashboardRouteIds`; workbench docs use URL-first `useModuleSecondaryTab` |

## Multi-tab session

| Symptom | Check |
|---------|--------|
| Opening a second tab logs out the first | Guards must not call `completeSessionLogout` with cross-tab broadcast when token is missing locally; use `ensureSharedSessionHydrated` in `AppProviders` |
| New tab not authenticated | `sessionMirror` in localStorage; `SessionSync` hydrate on mount |
| Logout in one tab does not reach others | `endAuthenticatedSession` → `broadcastCrossTab: true`; `SessionSync` listens for `LOGOUT` / `SESSION_EXPIRED` |

See [HOST_SHELL_INTEGRATION.md](./HOST_SHELL_INTEGRATION.md).

## Setup Home navigation

| Symptom | Check |
|---------|--------|
| Home from Setup always goes to `/home` | No **confirmed** return saved — open Setup from a module (header gear), or visit `/home` to clear stale storage |
| Home goes to wrong old module | Legacy unconfirmed `sessionStorage` — fixed by `confirmed: true` on save + `ensureSetupReturnRouteForSetupEntry` on Setup routes; logout clears storage |

## Build

| Symptom | Check |
|---------|--------|
| Vite build fails | Read error path; common cause is bad dynamic import path in `routes/index.js` |
| Assets 404 in deployed env | Set `VITE_PUBLIC_URL` to match hosting subdirectory |

## Components

| Symptom | Check |
|---------|--------|
| Double page title | Remove local `ModuleSectionHeader` / `SetupModuleHeader`; use shell header + `useRegisterDashboardPageHeaderActions` |
| Validation not showing rose border | Use `InputField` / `OrgSelectField`, not raw tailwreck `Input` on new forms |
| Toasts wrong style | Use `showAppToast`; ensure `AppSuccessToastContainer` at app root |

## Tests

```bash
npm run test:run
```

| Symptom | Check |
|---------|--------|
| `moduleRoutes` failures | URL prefix changes need test updates in `moduleRoutes.test.js` |
| Registry failures | Every portal module path must resolve in `dashboardPageRegistry.test.js` |

## Module Federation

This repository **does not** load Module Federation remotes. If documentation mentions webpack federation, treat it as a **future** or **Probity production** pattern — not this repo’s runtime.

See [ARCHITECTURE.md](./ARCHITECTURE.md).
