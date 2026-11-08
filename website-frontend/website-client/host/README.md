# Website Host (Module Federation)

The host application loads SRS-defined micro frontends at runtime via `@originjs/vite-plugin-federation`.

## Development ports (proposed)

| Remote | Dev port |
|--------|----------|
| shell | 5000 |
| public-site | 5001 |
| catalog-mfe | 5002 |
| content-mfe | 5003 |
| careers-mfe | 5004 |
| admin-mfe | 5005 |

Remote URLs for local dev: `configuration/mfe-remotes.development.json`.

## Migration

Until each remote is extracted from `src/domain/`, run the consolidated app:

```powershell
npm run dev
```

See `documentation/architecture/FRONTEND_MFE_ARCHITECTURE.md`.
