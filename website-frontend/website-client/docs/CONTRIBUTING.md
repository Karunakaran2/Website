# Contributing

## Scope

Changes should preserve:

- Auth, seat selection, and multi-tab session behavior ([HOST_SHELL_INTEGRATION.md](./HOST_SHELL_INTEGRATION.md))
- Shell navigation (URL per tab), scroll, and `/home` entry flow
- Clean module URLs (no `/dashboard`, no `:accountId` in paths)
- Probity-aligned shared components in `src/shared/components`

Do **not** modify **probity-client** from this repo.

## Conventions

- **UI:** Tailwind utilities; GIGW sizes `h-[36px]`, `text-[12px]` where required. **Always use shared components** per `.cursor/rules/kran-shared-components.mdc` (also responsive + skeleton rules). Map: [../AGENTS.md](../AGENTS.md).
- **Domain lists:** `DataTable`, domain list/modal pattern, `idMask` for row keys and API paths.
- **Forms:** React Hook Form + shared fields; validate before confirm dialogs.
- **Imports:** `@/` alias to `src/`; domain code under `@/domain/...`.

## Required checks before review

```bash
npm run test:run
npm run build
```

Run `npm run build:report` when adding heavy dependencies or new entry chunks.

## Documentation

Update when you change:

- Route prefixes or registry → `ARCHITECTURE.md`, `MODULE_DEVELOPMENT_GUIDE.md`
- Host routing, session sync, or scroll → `HOST_SHELL_INTEGRATION.md`, Design Guidelines → Architecture, Workbench Overview
- Shared component APIs → Component Workbench examples + `SHARED_COMPONENTS.md`
- Nav or Setup Home → `TROUBLESHOOTING.md`

## Accessibility

- Target WCAG 2.2 AA intent for touched UI.
- Do not claim full compliance without test evidence.
- Fix a11y in shared components when the issue is systemic.

## Pull request expectations

- Focused diff; avoid unrelated reformats.
- Meaningful commit messages (why, not only what).
- Note mock vs real API behavior in module changes.

## Module boundaries

- No imports of another domain’s private components.
- Share via `src/shared/` only.
- Register all navigable pages in `loadDomainPages.js`.
