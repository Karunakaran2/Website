# Performance and reliability

## Baseline measurement

After a production build, run:

```bash
npm run build:report
```

This prints the **15 largest files** under `dist/assets/` and total size. Record the output in your PR when making bundle-affecting changes.

**Note:** Baseline numbers vary by machine and dependency versions. Do not cite sizes from memory — run the script on your branch.

**Snapshot (2026-11-02, after vendor split + lazy export/charts/mock):**

| Asset | Size (minified) | gzip (Vite) |
|-------|-----------------|-------------|
| Main entry `index-*.js` | ~678 kB | ~188 kB |
| `react-vendor-*.js` | ~144 kB | ~46 kB |
| `mui-*.js` | ~81 kB | ~29 kB |
| `redux-*.js` | ~76 kB | ~26 kB |
| `charts-*.js` | ~177 kB | ~62 kB |
| `tailwreck-*.js` | ~411 kB | ~102 kB |
| `exceljs-*.js` | ~940 kB | ~271 kB (on-demand export) |
| `jspdf-*.js` | ~423 kB | ~139 kB (on-demand export) |
| `mockFetchInterceptor-*.js` | ~62 kB | ~16 kB (dev / `VITE_MOCK_API=true` only) |
| Route chunks | 219 files under `dist/assets` | lazy-loaded |

Production builds default to **real API** (`VITE_MOCK_API=false` + dynamic mock install in `main.jsx`). Excel/PDF libraries load only when export runs.

## Code splitting (current)

- Domain pages: `lazyPage()` in `src/app/routes/lazyPage.js` → `React.lazy` per registry entry.
- Route shell: `DashboardPage`, auth pages loaded via `lazyPages.js`.
- Heavy libs (ExcelJS, jsPDF, Chart.js) should remain reachable only from routes that import them.

## Optimization rules

1. **Measure** with `build:report` before optimizing.
2. Add **route-level** lazy imports for new heavy screens; avoid static imports of large docs/playgrounds in the app entry.
3. Do not memoize entire trees without evidence of render cost.
4. Prefer **pagination** on large tables (DataTable defaults) over rendering thousands of rows.
5. Keep **one** toast stack (`showAppToast` / react-toastify).
6. Avoid duplicate icon packs in new code (prefer `lucide-react` already in the bundle).

## Reliability checklist

- [ ] `npm run test:run` passes
- [ ] `npm run build` passes
- [ ] Login → seats → `/home` manually verified when touching auth/routes
- [ ] Setup Home return tested when touching `setupReturnNav.js` or header
- [ ] Deep link + browser refresh on a module URL
- [ ] Console free of new errors on primary module landing pages
- [ ] Registry test: `dashboardPageRegistry.test.js` passes after route changes

## Known bottlenecks

- **MUI + Emotion** and **Chart.js** increase vendor chunk size; only import used subpaths in new code.
- **Mock fetch interceptor** loads only when `isMockEnabled()` (dev default, or explicit `VITE_MOCK_API=true`).
- **Large workbench doc pages** (Foundations, Accessibility) are intentionally heavy; keep them lazy via registry only.

## Error recovery

- Lazy load retry: automatic once in `lazyPage.js`; `retryLazyPages()` for manual recovery after failed dynamic import in dev.

## Security / reliability

- Do not commit secrets in `.env*` (use `.env.development` locally; keep samples non-sensitive).
- Clear `setupReturnRoute` on logout (`clearSetupReturnRoute`).
