# Skeleton & responsive implementation report

**Repository:** `design-system`  
**Date:** 2026-10-24  

## Skeleton audit

| Finding | Detail |
|---------|--------|
| Shared library | Already present under `src/shared/components/skeleton/` (`SkeletonBlock`, `FormSkeleton`, `PageCardSkeleton`, `ProbityTablePageSkeleton`, …) |
| Workbench page | **Exists:** `feedback:loading-states` → `LoadingStatesFeedbackPage.jsx` |
| Duplicate UI | Legacy `Shimmer` / `SkeletonBar` in `src/shared/components/ui/Shimmer.jsx` — now delegates to `SkeletonBlock` |
| Decision | **Reuse and extend** — no second skeleton library |

## Added / improved

- `skeletonStyles.js` — pulse tokens with `motion-safe` / `motion-reduce`
- `SkeletonRegion` — single `aria-busy` + sr-only message
- `SkeletonPrimitives.jsx` — primitives, metrics, table, report, split-panel compositions
- `SkeletonBlock.test.js` — reduced-motion class coverage
- **LoadingStatesFeedbackPage** — full Workbench sections (overview, primitives, content, form, table, layout, live toggle, usage)
- **Module 1:** `SampleReportsPage` + `SampleDashboardPage` use `ReportResultsSkeleton` / `DashboardMetricsSkeleton` + `TableSkeleton`
- **Responsive:** `MODULE_MAIN_CLASS` / `MODULE_MAIN_INNER_CLASS` — `min-w-0`, `max-w-full`, responsive horizontal padding; `ReportSplitLayout` narrower filter column on small screens

## Variants available (exports)

Primitives: line, text lines, heading, circle, button, input, image  
Content: `MetricCardSkeleton`, `DashboardMetricsSkeleton`, `ListItemSkeleton`, `ProfileSkeleton`  
Forms: `FormSkeleton` (existing)  
Tables: `TableSkeleton`, `ProbityTableSkeletonBody`, `ProbityTablePageSkeleton`  
Pages: `PageCardSkeleton`, `PageHeaderSkeleton`, `ReportResultsSkeleton`, `SplitPanelSkeleton`, `SkeletonRegion`

## Routes

- Workbench: `/component-workbench/feedback/loading-states`
- Library doc route `lib-feedback:loading-states` now points at the interactive page (not docs-only tab)

## Verification

| Check | Result |
|-------|--------|
| `npm run test:run` | **369 tests** (73 files) after `SkeletonBlock.test.jsx` + `@vitest-environment happy-dom` |
| `npm run build` | **Success** (production Vite build after tests) |
| Registered routes | **252** keys in `DASHBOARD_PAGE_REGISTRY` (per `dashboardPageRegistry.test.js`) |
| Routes audited in browser | **Not exhaustive** — prior spot-checks on M1 dashboard, M2 tasks; loading-states page not re-opened this pass |
| Viewports | **Not matrix-tested** — responsive foundation only (`min-w-0`, fluid gutters, report split grid) |

## Files touched (this effort)

- `src/shared/components/skeleton/*` — styles, region, primitives, exports, test
- `src/shared/components/ui/Shimmer.jsx`
- `src/domain/component-workbench/feedback/LoadingStatesFeedbackPage.jsx`
- `src/domain/component-workbench/routes/index.js`
- `src/domain/component-workbench/data-display/ReportOverviewDemoPage.jsx`
- `src/domain/module-1/pages/SampleDashboardPage.jsx`, `SampleReportsPage.jsx`
- `src/shared/constants/moduleContentStyles.js`
- `src/shared/components/report/ReportSplitLayout.jsx`
- `src/shared/components/common/Footer/AppFooter.jsx`

## Remaining work

- Migrate ad-hoc `animate-pulse` blocks in other domains (administration asset modals already use domain skeletons)
- Optional: wire `DataTable` `loading` prop consistently on all M1/M2 list pages
- Full viewport matrix (320–3840) manual QA
- Module 2 report tabs if a dedicated workforce report page is added later
