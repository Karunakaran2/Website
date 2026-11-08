# Portal source ZIP download

## User-facing control

Footer **Download Source ZIP** (beside the KRAN mark) triggers a real archive download.

| Environment | Mechanism |
|-------------|-----------|
| **Development** (`npm run dev`) | Vite middleware `GET /api/portal/source-zip` builds a temp ZIP and streams it |
| **Production static host** | Run `npm run build` — `prebuild` step writes `public/releases/kran-design-system-source.zip`, copied into `dist/releases/` |

Filename pattern: `kran-design-system-source-YYYY-MM-DD.zip` (dev uses `Content-Disposition`; production uses the stable path above).

## Regenerate locally

```bash
npm run build:source-zip
```

## Inclusion policy

See `scripts/sourceArchivePolicy.js` — allowlisted roots (`src/`, `docs/`, `public/`, `scripts/`, `tailwreck/`, safe root files such as `package.json`, `package-lock.json`, `.env.example`).

**Excluded:** `node_modules/`, `dist/`, `.git/`, `.env` and other secret env files, `*.zip`, `*.log`, private keys, `public/releases/` (artifact output), editor caches.

Files whose content matches basic secret heuristics are skipped and logged at build time (paths only, no secret values).

## Deployment note

Static hosting must serve `dist/releases/kran-design-system-source.zip` alongside the app. If the file is missing, production download fails until a build that includes `build:source-zip` is deployed.

No separate backend is required beyond Vite dev middleware and the build-time archive step.
