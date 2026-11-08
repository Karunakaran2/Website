# Micro Frontend Integration Guide

## Tooling

- **Bundler:** Vite 6
- **Federation:** `@originjs/vite-plugin-federation` (planned per remote)
- **Shared libraries:** React, React DOM, React Router, Redux Toolkit marked as `shared` in federation config to avoid duplicate bundles

## Host responsibilities

1. Load `configuration/mfe-remotes.<env>.json`
2. Register remotes before rendering routes
3. Provide `AuthProvider`, Redux `Provider`, and design-system theme
4. Lazy-load remote modules: `import('catalog_mfe/Routes')`

## Remote responsibilities

1. Expose route tables and feature entry components only — no duplicate shell layout
2. Use `@shared/*` aliases pointing to shared package path
3. Call APIs via gateway base URL `/api/v1`

## Cross-MFE events

Prefer:

- Redux actions in host store for global session
- Custom events (`kran:locale-changed`) for rare decoupled signals

Avoid ad-hoc `window` globals except federation shared scope.

## Build / deploy

Each MFE CI job publishes `dist/assets/remoteEntry.js` to static hosting; host JSON updated per environment.
