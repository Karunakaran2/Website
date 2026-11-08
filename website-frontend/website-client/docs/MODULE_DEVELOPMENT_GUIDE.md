# Module development guide

Step-by-step guide for adding a **domain module** to the KRAN Design System host. This app uses **lazy-loaded domain routes inside one Vite build**, not Module Federation remotes.

## Reference modules (copy patterns from here)

| Area | Routes | Key files |
|------|--------|-----------|
| Module 1 workflows | `/module-1/*` | `module-1/pages/SampleFormsPage.jsx`, `SampleTablesPage.jsx`, `SampleModalsPage.jsx` |
| Administration | `/administration/setup/*`, `/administration/asset/*` | `administration/setup/pages/*`, `administration/asset/pages/*` |
| Module 2 | `/module-2/*` | `module-2/hrms/pages/HrmsDirectoryPage.jsx`, `tasks/pages/TaskBoardPage.jsx` |

Full onboarding: [DEVELOPER_ONBOARDING.md](./DEVELOPER_ONBOARDING.md).

## 1. Plan the module

- Choose a **primary nav id** (kebab-case, unique).
- Define **secondary tabs** (sub-screens).
- Decide whether it belongs in one of the five reference areas or as an additional Probity-parity tab under `dashboard.js` constants.

## 2. Create folder structure

Under `src/domain/<your-module>/`:

```
components/
constants/
hooks/
layouts/          # optional module layout wrapper (not app shell)
pages/
routes/index.js   # required
services/         # API / mock
types/            # optional
```

Run `node scripts/ensure-domain-mfe-structure.mjs` only when bootstrapping legacy Probity-style domains; do not use it to resurrect removed modules (e.g. Accounting).

## 3. Register pages

`src/domain/<your-module>/routes/index.js`:

```javascript
import { lazyPage as page } from '@/app/routes/lazyPage'

export const myModulePages = {
  'my-primary:overview': page(() => import('../pages/MyOverviewPage')),
  'my-primary:details': page(() => import('../pages/MyDetailsPage')),
}
```

Merge into the host registry in `src/app/routes/loadDomainPages.js`:

```javascript
import { myModulePages } from '@/domain/my-module/routes'

export const DASHBOARD_PAGE_REGISTRY = {
  ...existingPages,
  ...myModulePages,
}
```

## 4. Wire navigation

1. Add primary (and secondary) items in `src/app/shell/constants/dashboard.js` — or extend an existing module group.
2. Add URL prefix handling in `src/shared/constants/moduleRoutes.js` if the module needs a dedicated path prefix (follow existing `MODULE_ROUTE_PREFIX` patterns).
3. Add a shell route in `AppRoutes.jsx` if a new prefix is required.
4. Add `pageSubtitles` and `nav` labels in `src/app/i18n/locales/en.js` (and `hi.js` when applicable).

## 5. Host shell (mandatory — do not reimplement in domains)

Read **[HOST_SHELL_INTEGRATION.md](./HOST_SHELL_INTEGRATION.md)** before wiring navigation or auth in a new module.

- **Routing:** Register pages only; shell `NavLink`s change the URL. Do not call `setDashboardNav` from domain code for shell-level tabs.
- **New tab / Ctrl+click:** Never assume Redux nav clicks run only in one tab — URL drives `DashboardContent`.
- **Session:** Host mounts `SessionSync` + `ensureSharedSessionHydrated`; domains use `RequireAuth` on menu routes.
- **Scroll:** Use `#main-content` scroll via `AppScrollManager`; inline list forms use `useInlineFormScroll`.
- **Toasts:** `showAppToast` + root `AppSuccessToastContainer` only.

## 6. Page UI conventions

- **Do not** add a second page title row; the shell renders `PageSectionHeaderBar`.
- Pass actions with `useRegisterDashboardPageHeaderActions` from `@/app/shell/context/DashboardPageHeaderActionsContext`.
- Use shared components from `@/shared/components` (DataTable, FormModal, InputField, Gigw buttons, `showAppToast`, etc.).
- List CRUD: follow Probity patterns in `src/shared/components/domain` (confirm before save, `FieldError`, `idMask` for keys).
- Wrap menu pages that use confirms in `ActionConfirmProvider`.

## 7. Services and mock data

- Put HTTP/RTK logic in `services/*Api.js`.
- Mock responses: `src/shared/api/mock/` — keep mocks out of presentational components.
- Document mock limitations in page copy or module README comment; do not imply production APIs.

## 8. Permissions

- Nav visibility: `src/shared/privileges/probityPrivileges.js`.
- Gate destructive actions in the UI only as a **demo**; real authorization remains server-side.

## 9. Testing

Add tests where risk is high:

- Route helpers (`moduleRoutes.test.js` pattern).
- Registry: extend `dashboardPageRegistry.test.js`.
- Utilities (e.g. `setupReturnNav.test.js`).
- Domain-specific validation/utils.

Run:

```bash
npm run test:run
npm run build
```

Registry contracts (auto-audit):

- `src/app/routes/dashboardPageRegistry.test.js` — portal + reference module nav coverage
- `src/app/routes/registryImportContract.test.js` — lazy import files exist, critical administration targets, unique keys
- `src/app/shell/utils/setupReturnNav.test.js` — Setup return Home validation

## 10. Documentation

- Add workbench or guidelines cross-links if you introduce new shared patterns.
- Update [ARCHITECTURE.md](./ARCHITECTURE.md) if registration or prefixes change.
- Host behavior changes → update [HOST_SHELL_INTEGRATION.md](./HOST_SHELL_INTEGRATION.md) and Design Guidelines → Architecture.

## Checklist

- [ ] Host shell rules reviewed ([HOST_SHELL_INTEGRATION.md](./HOST_SHELL_INTEGRATION.md))
- [ ] `routes/index.js` exports all primary:secondary keys used in nav
- [ ] Keys merged in `loadDomainPages.js`
- [ ] `getModuleRoute()` returns correct URLs
- [ ] `pageSubtitles` entry with a **specific** subtitle (not generic filler)
- [ ] No duplicate Home buttons inside Setup
- [ ] Shared components only — no copy-paste Probity folders into domain
- [ ] Tests and production build pass
