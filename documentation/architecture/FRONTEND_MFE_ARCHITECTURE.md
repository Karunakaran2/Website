# Frontend Micro Frontend Architecture — Website

**SRS reference:** `Future_State_Application_Architecture.md`, `System_Architecture.md`  
**Design reference:** cloned KRAN Design System in `website-client/`

## Boundaries (approved)

| MFE | Responsibility | Route prefix (proposed) |
|-----|----------------|-------------------------|
| `shell` | Host layout, auth gate, module registry, error boundary | `/` |
| `public-site` | Marketing home, about, contact, static public pages | `/`, `/about`, `/contact` |
| `catalog-mfe` | Services, solutions, projects, clients | `/services`, `/solutions`, `/projects`, `/clients` |
| `content-mfe` | News, data sheets, gallery, timeline, banners (public) | `/news`, `/gallery`, … |
| `careers-mfe` | Job listings and applications | `/careers` |
| `admin-mfe` | CMS (SideMenu parity) | `/admin` |

Shared UI, tokens, hooks, and auth client live in `website-client/src/shared/` (migrating to `shared/` package consumed by all remotes).

## Integration strategy

1. **Current state:** single Vite SPA (design-system lineage) with domain folders under `src/domain/`.
2. **Target state:** Vite + [`@originjs/vite-plugin-federation`](https://github.com/originjs/vite-plugin-federation) — one build per MFE plus a **host** shell that loads `remoteEntry.js` URLs at runtime.
3. **Transitional:** monolith dev server remains `npm run dev`; federation builds added under `host/` and `micro-frontends/*` without removing working shared components.

## Repository layout

```
website-client/
  host/                    # Federation host (shell)
  micro-frontends/
    shell/                 # Optional: shell remote if split from host
    public-site/
    catalog-mfe/
    content-mfe/
    careers-mfe/
    admin-mfe/
  configuration/
    mfe-remotes.development.json
  src/                     # Legacy monolith + shared library (migration source)
```

## Contracts

- **Routing:** host owns React Router; remotes expose route components via federation `exposes`.
- **Auth:** shared `@shared/services/auth` (token storage, refresh, API client headers).
- **State:** Redux store owned by host; remotes receive store via `Provider` or shared module federation `shared` config.
- **Design system:** `@shared/components`, Tailwind tokens, Poppins/Montserrat — no duplicate component libraries per MFE.

## Independent deployment

Each MFE produces its own `dist/` and `remoteEntry.js`. Environment-specific remote URLs are listed in `configuration/mfe-remotes.<env>.json`.

See also: `MFE_INTEGRATION_GUIDE.md`, `LOCAL_DEVELOPMENT.md`.
