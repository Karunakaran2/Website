# Micro Frontends

SRS-aligned remotes (independent Vite builds):

| Directory | MFE | SRS modules |
|-----------|-----|-------------|
| `public-site/` | public-site | Home, about, contact, static marketing |
| `catalog-mfe/` | catalog-mfe | Services, solutions, projects, clients |
| `content-mfe/` | content-mfe | News, gallery, timeline, data sheets (public) |
| `careers-mfe/` | careers-mfe | Careers listing and application |
| `admin-mfe/` | admin-mfe | Full CMS / admin SideMenu parity |
| `shell/` | shell | Layout + auth gate (optional split from host) |

Each folder will contain its own `package.json`, `vite.config.js` (federation remote), and routes exposed to the host.

Shared code: `../src/shared/` (transition) → extracted npm workspace package later.
