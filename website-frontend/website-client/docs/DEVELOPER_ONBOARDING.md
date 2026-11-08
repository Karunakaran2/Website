# Developer onboarding — KRAN Design System

Single-build React SPA (`Vite`). Domain modules register lazy pages in `DASHBOARD_PAGE_REGISTRY`. **Probity Client** (`probity-client/src/shared/components`) is the read-only reference for component behavior.

**New projects:** fork this repo as the full starting context — [NEW_PROJECT_FROM_THIS_CONTEXT.md](./NEW_PROJECT_FROM_THIS_CONTEXT.md). **Optional MFE** (no npm UI packages): [MFE_WITHOUT_PACKAGES_PLAN.md](./MFE_WITHOUT_PACKAGES_PLAN.md).

## Before you build a new UI pattern

1. Search **`src/shared/components`** (and `@/shared/components` imports).
2. Open **Component Workbench** (`/component-workbench`) for live variants.
3. Read **Design Guidelines** (`/design-guidelines`).
4. Copy patterns from a **reference module** (below).

**Rule:** Reuse shared components. Do not fork buttons, tables, or modals inside `src/domain/*`.

## Reference modules (learn by example)

| Module | Path prefix | What it teaches |
|--------|-------------|-----------------|
| **Module 1** | `/module-1/...` | End-to-end workflows: dashboard, `DataTable`, forms, modals, confirms, Notes/Query on **Sample Forms** |
| **Administration** | `/administration/setup/...`, `/administration/asset/...` | Setup CRUD, FA Group, asset register, domain list + modal, mock RTK services |
| **Module 2** | `/module-2/...` | Directory filters, `DataTable` row actions, task board, confirm delete, header actions via layout helpers |

**Component Workbench** = catalogue. **Sample Module** = composition in realistic flows.

## Host shell (mandatory)

Before changing navigation, auth, or scroll behavior, read **[HOST_SHELL_INTEGRATION.md](./HOST_SHELL_INTEGRATION.md)**.

- **URL per tab** → `useDashboardRouteIds` + `DashboardContent`; sync Redux with `useDashboardRouteSync`.
- **Multi-tab login/logout** → `SessionSync`, session mirror, `restoreAuthState` vs `loginSuccess`.
- **Module scroll** → `AppScrollManager` on `#main-content`; inline forms → `useInlineFormScroll`.
- **In-app summary:** Design Guidelines → **Architecture** (`/design-guidelines/guide-architecture/overview`).

## Standard page layout

- Shell renders **`PageSectionHeaderBar`** (title + page-specific subtitle from `pageSubtitles` in i18n).
- Register actions: `useRegisterDashboardPageHeaderActions` from `@/app/shell/context/DashboardPageHeaderActionsContext`.
- Do **not** add a second H1 on the page body.
- Content: `ModulePageContent` padding via `DashboardModuleContentShell`.

## Register a new screen

See [MODULE_DEVELOPMENT_GUIDE.md](./MODULE_DEVELOPMENT_GUIDE.md): `routes/index.js` → `loadDomainPages.js` → `dashboard.js` nav → `moduleRoutes.js` → `pageSubtitles` in `en.js` / `hi.js`.

## DataTable list screens

```javascript
import { DataTable } from '@/shared/components'
import { TableViewAction, TableEditAction, TableRowActionsGroup, TABLE_ROW_ACTIONS_CLASS } from '@/shared/components/buttons'
```

- `emptyMessage="No data available in table"`
- Amount columns: `align: 'right'`, `format: 'currency'` or `formatIndianAmount` in `cell`
- Row key: `idMask` for domain data

Administration example: `src/domain/administration/asset/pages/menu/AssetFaGroupPage.jsx` (via screen components).

## Forms and validation

- Controls: `InputField`, `OrgSelectField`, `OrgDateField`, `IndianAmountField`, `TextAreaField` from `@/shared/components/forms`
- Client validation: field-level `error` + rose border; server errors via toast — not for client validation
- Confirm before save: `ActionConfirmProvider` + `confirmBeforeAction` / `DomainFormFooter`

Module 1 reference: `src/domain/module-1/pages/SampleFormsPage.jsx`.

## Modals and confirmations

- `PortalModalShell`, `FormModal`, `ConfirmDialog` from `@/shared/components`
- Module 1 workflows: `src/domain/module-1/pages/SampleModalsPage.jsx`

## Notes and queries

Shared panel (presentation only — parent owns save):

```javascript
import { WorkflowNotesQueryPanel } from '@/shared/components/workflow'
```

Demo wiring: **Sample Module → Forms** (`SampleFormsPage.jsx`).  
Probity voucher reference (read-only): `probity-client/src/domain/accounting/components/VoucherNotesQuerySection.jsx`.

## Indian formatting

Use **`@/shared/utils/probityFormat`**:

- `formatRupee(value)` — ₹ + en-IN grouping, 2 decimals
- `formatIndianAmount(value)` — grouping without symbol (thead already shows ₹)
- `formatDisplayDateOrDash(value)` — dd-mm-yyyy
- `IndianAmountField` / `IndianAmountInput` for inputs (group on blur, not while typing)

Do not duplicate `Intl.NumberFormat` in domain utils — delegate to `probityFormat`.

## Permissions (UI simulation)

Nav: `src/shared/privileges/probityPrivileges.js`.  
Row/button gates in modules are **demonstration only** — backend must enforce authorization.

## Inbox and `/home`

- Landing: `KranDesignSystemLanding` → `PortalInboxCard` + `PortalModulesGrid`
- Inbox logic helpers: `src/app/shell/utils/portalInboxUtils.js` (tested)
- Module cards: `PORTAL_MODULES` in `portalModules.js`

## Testing

```bash
npm run test:run
npm run build
```

Registry contracts: `dashboardPageRegistry.test.js`, `registryImportContract.test.js`, `pageSubtitleRegistry.test.js`.

## Documentation map

| Doc | Purpose |
|-----|---------|
| [SHARED_COMPONENTS.md](./SHARED_COMPONENTS.md) | Import map and categories |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Registry and routing |
| [HOST_SHELL_INTEGRATION.md](./HOST_SHELL_INTEGRATION.md) | Per-tab routing, session, scroll (mandatory) |
| [MODULE_DEVELOPMENT_GUIDE.md](./MODULE_DEVELOPMENT_GUIDE.md) | Step-by-step module registration |

When you change a shared component API, update Workbench examples and **SHARED_COMPONENTS.md** in the same change.
