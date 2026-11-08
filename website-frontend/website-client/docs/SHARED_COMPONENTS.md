# Shared components

Source of truth in this repo: **`src/shared/components/`** (kept aligned with read-only **probity-client** reference).

## Import paths

| Need | Import |
|------|--------|
| Barrel exports | `@/shared/components` |
| Data table | `@/shared/components` → `DataTable`, `DataTableToolbar` |
| Domain list + modal | `@/shared/components/domain` |
| Forms | `@/shared/components/forms` → `InputField`, `OrgSelectField`, `OrgDateField`, `FormLabel`, `FieldError` |
| GIGW actions | `@/shared/components/buttons/gigw` |
| Row actions | `@/shared/components/buttons` → `TableViewAction`, `TableRowActionsGroup`, … |
| Modals | `FormModal`, `PortalModalShell`, `ConfirmDialog` |
| Toasts | `showAppToast`, mount `AppSuccessToastContainer` once at app root |
| Typography / page header | `@/shared/components/typography`, `@/shared/components/page/PageSectionHeaderBar` |
| Confirm flow | `@/shared/components/confirm` → `ActionConfirmProvider`, `confirmBeforeAction` |

See `src/shared/components/index.js` for the full export list.

## Categories (audit map)

| Category | Primary implementation |
|----------|-------------------------|
| Buttons | `buttons/ActionButton`, `buttons/gigw/GigwButton`, `GigwIconButton` |
| Forms | `forms/FormFields.jsx`, `forms/OrgSelectField.jsx`, `OrgDateField.jsx` |
| Tables | `DataTable/DataTable.jsx`, `listing/OrgDataTable.jsx`, `TablePaginationBar` |
| Status | `status/StatusChip.jsx` |
| Modals | `modals/PortalModalShell.jsx`, `FormModal.jsx`, `ConfirmDialog.jsx` |
| Feedback | `toast/appToast.js` → **`showAppToast`**; loading under **`skeleton/`** (canonical) and page-specific **`skeletons/`** (auth/home only) |
| Layout / header | `page/PageSectionHeader.jsx`, `PageContentToolbar`, `ListPageHeaderActions`, `pageHeaderStyles.js` |
| Skeletons | `skeleton/index.js` → `SkeletonRegion`, `TableSkeleton`, `ReportResultsSkeleton`, … |
| Responsive tokens | `constants/responsiveLayoutStyles.js`, `constants/moduleContentStyles.js` |
| Workflow (notes/query UI) | `workflow/WorkflowNotesQueryPanel.jsx`, `workflow/WorkflowQueryHistoryTimeline.jsx` — see `QUERY_WORKFLOW.md` |
| Indian currency / dates | `@/shared/utils/probityFormat.js`, `forms/IndianAmountField.jsx` |
| Accessibility | `AccessibilityBar`, `AccessibilityProvider` (app shell) |
| Host navigation / scroll | `@/shared/navigation` → `AppScrollManager`, `appScrollContainer.js`, `useInlineFormScroll`, `isModifiedNavigationClick` |
| Host integrator UI copy | `@/shared/documentation/HostShellIntegratorGuide.jsx` (Design Guidelines + Workbench Overview) |

Host wiring (session, per-tab routing): **[HOST_SHELL_INTEGRATION.md](./HOST_SHELL_INTEGRATION.md)** — not duplicated here.

## API conventions

- **Forms:** pass RHF `rules` and `error={errors.field?.message}`; invalid borders via shared field wrappers (rose border + `FieldError`).
- **Tables:** `rowKey="idMask"` for domain data; `emptyMessage="No data available in table"`; action column `TABLE_ACTION_COLUMN_CLASS`.
- **Actions:** Approve ≠ activate; Verify vs Finalize icons per GIGW rules; use `useActionConfirm`, not `window.confirm`.
- **Confirmation:** One `ActionConfirmProvider` at app root; call `confirmBeforeAction` only for meaningful mutations (save, delete, submit, workflow, upload). Never confirm navigation, filters, search, sort, pagination, or opening browse/view modals.
- **Toasts:** `showAppToast` only for server/success paths — not client validation.

## Learning path

1. **Component Workbench** — live examples under `/component-workbench`.
2. **Design Guidelines** — standards under `/design-guidelines`.
3. **Probity Client** — read-only diff when behavior is unclear.

## Duplication policy

- Do **not** add parallel button/table/modal implementations under `src/domain/*`.
- Fix behavior once in `src/shared/components` and update workbench examples.
- Component documentation lives under `src/domain/component-workbench` only (legacy `ui-component-library` and `component-explorer` folders were removed).

## Accessibility

- Checkbox: `formCheckboxControlClass` (native tick, 20×20).
- Icon buttons: `aria-label` + `ActionIconTooltip`.
- Dialogs: focus trap via modal shell; see workbench Accessibility docs.

When changing a public component API, update workbench pages and this document in the same change.

## Cursor rules (for AI and contributors)

Persistent enforcement lives in **`.cursor/rules/`** — especially `kran-shared-components.mdc`, `kran-responsive-layout.mdc`, and `kran-skeleton-loading.mdc`. Read **`AGENTS.md`** for the full map.
