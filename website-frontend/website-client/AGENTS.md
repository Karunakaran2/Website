# KRAN Design System — agent quick reference

Cursor loads **`.cursor/rules/*.mdc`** automatically. **All agents and developers must follow these rules** when changing this repo — use shared components from `src/shared/components`, not ad-hoc UI.

## Rules (always-on in Cursor)

| File | Purpose |
|------|---------|
| `.cursor/rules/kran-shared-components.mdc` | **Mandatory** imports, page wiring, do/don't for shared UI |
| `.cursor/rules/kran-responsive-layout.mdc` | Shell gutters, tables, modals, large screens |
| `.cursor/rules/kran-skeleton-loading.mdc` | Skeleton library, loading/empty/error states |
| `.cursor/rules/probity-ui-replication.mdc` | Visual tokens, GIGW look, layout safety |
| `.cursor/rules/design-system-portal.mdc` | Module 1/2 portal, domains, registry, routing |

## Human documentation (`docs/`)

| Doc | Topic |
|-----|--------|
| [docs/DEVELOPER_ONBOARDING.md](./docs/DEVELOPER_ONBOARDING.md) | Start here |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Host vs domain, registry, URLs |
| [docs/HOST_SHELL_INTEGRATION.md](./docs/HOST_SHELL_INTEGRATION.md) | **Mandatory** per-tab routing, session, scroll |
| [docs/MODULE_DEVELOPMENT_GUIDE.md](./docs/MODULE_DEVELOPMENT_GUIDE.md) | New domain modules |
| [docs/SHARED_COMPONENTS.md](./docs/SHARED_COMPONENTS.md) | Import conventions |
| [docs/RESPONSIVE_APPLICATION_REPORT.md](./docs/RESPONSIVE_APPLICATION_REPORT.md) | Responsive tokens & QA notes |
| [docs/SKELETON_RESPONSIVE_IMPLEMENTATION_REPORT.md](./docs/SKELETON_RESPONSIVE_IMPLEMENTATION_REPORT.md) | Skeleton variants & integration |
| [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md) | Conventions and review |
| [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) | Common failures |

## Verification

```bash
npm run dev          # .env.development — http://localhost:5174/design-system/
npm run build        # .env.production → dist/
npm run dev:production  # optional: local run with production env (no dev port in .env.production; Vite default 5173)
npm run test:run
```

Do not modify **probity-client** from this repo; treat it as read-only UI reference.
