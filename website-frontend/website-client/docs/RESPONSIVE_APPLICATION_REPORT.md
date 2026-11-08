# KRAN Design System — application-wide responsive implementation

**Repository:** `design-system`  
**Date:** 2026-10-24 (updated 2026-11-02 — page header grid)  

## Route inventory

| Metric | Count | Source |
|--------|------:|--------|
| Registered dashboard routes | **252** | `DASHBOARD_PAGE_REGISTRY` (`dashboardPageRegistry.test.js`) |
| Primary modules | 6+ | inbox, module-1, module-2, component-workbench, administration, design-guidelines, auth surfaces |
| Routes manually opened in browser this pass | **6** | See verification below |
| Routes individually edited | **0** | Fixes applied at **shared shell + components** (all routes inherit) |

Most routes render through `DashboardLayout` → `MainLayout` → `ModuleContentShell` → page registry. Responsive work targeted that pipeline and shared widgets (tables, modals, headers, forms).

## Global layout & shared component changes

| Area | Change |
|------|--------|
| **Tokens** | `responsiveLayoutStyles.js` — `ORG_CHROME_GUTTER_CLASS`, `APP_MIN_WIDTH_ZERO_CLASS`, reading/wide caps |
| **Main scroll** | `MODULE_MAIN_CLASS`, `HOME_LANDING_MAIN_CLASS` — `min-w-0`, responsive gutters (`px-3` → `sm:px-5` → `xl:px-[20px]`) |
| **Page card** | `MODULE_CARD_CLASS` — `min-w-0 max-w-full` |
| **`.page-shell`** | CSS gutters: 12px mobile, 20px from `640px` |
| **Headers** | `DashboardHeader`, `AccountHeader` — compact height on narrow viewports, responsive gutters, truncating brand row |
| **Nav** | `SecondaryNav` — horizontal scroll + gutters; `PrimaryNav` already had overflow + More menu |
| **A11y bar** | Non-dense mode uses `.page-shell` gutters |
| **Page header** | `PageSectionHeader` + `pageHeaderLayoutStyles.js` — **grid** `md:grid-cols-[minmax(0,1fr)_auto]`; title wraps; actions wrap (tablet) / horizontal scroll on action row (lg) |
| **Detail tabs** | `EnterpriseDetailTabs` — negative margin aligned to card body padding |
| **Footer** | `AppFooter` — responsive gutters (prior pass) |
| **Modals** | `modalChrome.js` — viewport-capped widths, `max-h` on shell, tighter margins on phones; `FormModal` body uses `dvh` |
| **DataTable** | Pagination inset on small screens; existing responsive column packing unchanged |
| **Row ⋮ menu** | `TableRowActionsGroup` — clamp menu to right viewport edge |
| **Dashboard grids** | `dashboardStyles.js` — progressive columns through `2xl` / `3xl`; Tailwind `3xl`/`4xl` breakpoints added |
| **Skeletons** | `DashboardMetricsSkeleton` grid matches dashboard metrics |
| **Reports** | `ReportSplitLayout` — `min-w-0`, fluid filter column (prior pass) |

## Module-specific fixes

No separate per-route patches were required beyond shared layers. Module 1 dashboard/reports and workbench loading states already use shared skeletons and report layout from the skeleton initiative.

**Auth:** `SeatSelectionPanel` already wraps wide table in `overflow-x-auto`.

**Forms:** `FieldGrid` / `fieldGridClass` already stack to one column below `sm`.

## Viewports tested (this pass)

| Viewport | Method | Routes / surfaces |
|----------|--------|-------------------|
| 375 × 812 | Browser MCP + CDP | `/home`, `/module-1/.../dashboard`, `/module-2/m2-tasks/my-tasks`, `/component-workbench/feedback/loading-states`, `/administration/asset/fa-group` — no page-level horizontal overflow |
| 375 × 812 | Modal | M1 **Create Project** modal shell fits viewport (`left≈6.5px`, `width≈362px` at `vw=375`) |
| 1920 × 1080 | Browser MCP emulation | `/home` layout spot-check (prior pass) |
| 1440 × 900 | Automated layout review via shared components | Shell, tables, modals (code) |
| 1920 × 1080 | Dashboard grid `3xl` tokens | Chart/metric grids (code) |

**Not tested:** Full 252-route matrix, 320×568, 2560×1440, 3840×2160 physical QA, every administration CRUD screen.

## Remaining / known limitations

- Very wide **administration** tables may still scroll horizontally inside the table region (by design when many columns).
- **Accessibility bar** chips remain single-line with horizontal pressure on 320px — skip link and language remain reachable; full chip row may require horizontal pan.
- **Placeholder routes** inherit shell fixes but were not visually opened one-by-one.
- **4K typography** is not scaled up — content uses fluid grids and max modal widths instead of enlarging controls.

## Checks performed

```text
npm run test:run  → 369 passed (73 files)
npm run build     → success (after changes)
```

## Files changed (responsive pass)

- `src/shared/constants/responsiveLayoutStyles.js` (new)
- `src/shared/constants/moduleContentStyles.js`
- `src/assets/styles/accessibility.css`
- `tailwind.config.js`
- `src/shared/components/page/PageSectionHeader.jsx`
- `src/shared/components/page/EnterpriseDetailTabs.jsx`
- `src/shared/components/common/Header/DashboardHeader.jsx`
- `src/shared/components/common/Header/AccountHeader.jsx`
- `src/app/shell/components/SecondaryNav.jsx`
- `src/app/shell/constants/homeDashboard.js`
- `src/shared/components/AccessibilityBar.jsx`
- `src/shared/components/modals/modalChrome.js`
- `src/shared/components/modals/FormModal.jsx`
- `src/shared/components/DataTable/DataTable.jsx`
- `src/shared/components/buttons/TableRowActionsGroup.jsx`
- `src/domain/dashboard/constants/dashboardStyles.js`
- `src/shared/components/skeleton/SkeletonPrimitives.jsx`
- `src/shared/components/page/ListPageHeaderActions.jsx`
- `src/shared/components/page/PageContentToolbar.jsx`
- `src/shared/components/page/PageToolbarFields.jsx`
- `src/shared/components/DataTable/DataTableToolbar.jsx`

See also: `docs/SKELETON_RESPONSIVE_IMPLEMENTATION_REPORT.md`.
