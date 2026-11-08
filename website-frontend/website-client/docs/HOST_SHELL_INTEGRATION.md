# Host shell integration (mandatory)

KRAN products (design-system, Probity, SPFO) share one **application shell**. Domain modules register pages in the host registry; they must **not** duplicate routing, session sync, or main scroll behavior.

## Providers and layout

| Piece | Location | Role |
|-------|----------|------|
| `AppProviders` | `src/app/providers/AppProviders.jsx` | Redux, router, `SessionSync`, `SessionGuard`, `AppScrollManager`, `ActionConfirmProvider` |
| `DashboardLayout` | `src/app/shell/layouts/DashboardLayout.jsx` | `useDashboardRouteSync()`, header, primary/secondary nav, `#main-content` |
| `DashboardContent` | `src/app/shell/components/DashboardContent.jsx` | Lazy page from **URL** via `useDashboardRouteIds` |

Mount **`AppSuccessToastContainer`** once at the app root.

## Routing (per browser tab)

1. **URL is authoritative** for which screen renders in **this** tab.
2. `useDashboardRouteSync` (in `DashboardLayout`) maps `location.pathname` → Redux `activePrimaryId` / `activeSecondaryId` on load and on back/forward.
3. `DashboardContent` calls `resolveDashboardPage(primaryId, secondaryId)` using ids from **`useDashboardRouteIds()`**, not Redux alone.
4. **PrimaryNav / SecondaryNav:** use React Router **`NavLink`** with `to={getModuleRoute(...)}`. **Do not** call `activatePrimary` / `activateSecondary` (or `setDashboardNav`) in `NavLink` `onClick`. Modified clicks (Ctrl+click, middle-click, open in new tab) must leave the current tab unchanged.
5. Programmatic navigation from custom controls: guard with `isModifiedNavigationClick(event)` from `@/shared/navigation/modifiedNavigationClick` before calling `navigate()`.
6. Build paths with **`getModuleRoute(primaryId, secondaryId)`** — see `src/shared/constants/moduleRoutes.js`.

### Workbench / doc tabs

`useModuleSecondaryTab` prefers the URL segment over Redux so library pages match the address bar.

## Authentication and multiple tabs

| Concern | Implementation |
|---------|----------------|
| Bootstrap | `ensureSharedSessionHydrated(store)` in `AppProviders` (before routed UI) |
| Cross-tab sync | `SessionSync` — mirror hydration, `LOGOUT` / `SESSION_EXPIRED` / `ACCOUNT_SWITCHED` / `LOGIN` / `TOKEN_REFRESHED` signals |
| Mirror storage | `sessionMirror.js` — `localStorage` snapshot (not broadcast on the channel) |
| Real login | `loginSuccess` → mirror + `LOGIN` signal |
| Restore in new tab | `restoreAuthState` — **no** cross-tab publish |
| User logout | `endAuthenticatedSession` → server logout + `completeSessionLogout({ broadcastCrossTab: true })` |
| Guards | `RequireAuth` redirects only; **does not** broadcast logout when token missing locally |
| Remote logout | Other tabs handle `LOGOUT` / `SESSION_EXPIRED` via `SessionSync` |

**Never** treat “this tab has no token yet” as a global logout. **Never** broadcast logout when opening, duplicating, or refreshing a tab.

Signals must **not** contain access tokens, refresh tokens, or passwords.

## Scroll

| Concern | Implementation |
|---------|----------------|
| Route changes | `AppScrollManager` → scroll `#main-content` to top (except POP with saved position) |
| Scroll container | `appScrollContainer.js` — `getAppScrollContainer()` |
| Inline list forms | `useInlineFormScroll` when opening add/edit cards (`ListWithFormModal`) |

Do not scroll `window` for module navigation when `#main-content` is the scroll region.

## Control heights (shell-adjacent toolbars)

- Form fields, page toolbar controls, DataTable toolbar: **`h-11`** (44px) — `formControlDimensions.js`, `dataTableToolbarStyles.js`.
- Default text buttons: **`GigwButton` / `ActionButton` size `md`** — `h-11` in `gigwButtonStyles.js`.
- Table row icon buttons: **36px** — `GIGW_TABLE_ICON_BTN_CLASS`.

## Related documentation

| Doc | Topic |
|-----|--------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Registry, domains, deployment |
| [MODULE_DEVELOPMENT_GUIDE.md](./MODULE_DEVELOPMENT_GUIDE.md) | Registering module pages |
| [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) | Multi-tab and routing symptoms |
| Component Workbench → Overview | Live `HostShellIntegratorGuide` |
| Design Guidelines → Architecture | Same guide in guidelines context |

## Verification checklist

- [ ] Ctrl+click a secondary nav tab: original tab URL and page unchanged; new tab loads target URL.
- [ ] Log in, open same app in second tab: both tabs authenticated; logout in one logs out all.
- [ ] Refresh authenticated tab: stays logged in; no spurious logout in other tabs.
- [ ] Navigate modules: `#main-content` scrolls to top; browser Back restores scroll when possible.
