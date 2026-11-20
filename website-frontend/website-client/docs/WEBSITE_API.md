# Website backend API (frontend)

See `ALL_WEBSITE_API_OPERATIONS` in `domain/website/constants/allApiOperations.js` for the machine-readable catalog (hook, method, path, auth).

## Per-service modules

Each microservice domain has:

- `constants/endpoints.js` — paths
- `constants/apiOperations.js` — operation catalog
- `services/*Api.js` — RTK Query `injectEndpoints`
- `services/index.js` — barrel export
- `hooks/` — thin wrappers (where present)

| Domain | `services/` file | Implemented backend today |
|--------|------------------|---------------------------|
| `domain/auth` | `authApi.js`, `captchaApi.js` | login, refresh, logout, me, jwks, captcha |
| `domain/website-content` | `contentApi.js` | public/admin news, banners (gateway route) |
| `domain/website-catalog` | `catalogApi.js` | products; services/solutions (gateway, pending BE) |
| `domain/website-careers` | `careersApi.js` | jobs; careers root (gateway, pending BE) |
| `domain/website-engagement` | `engagementApi.js` | contact POST; engagement root (pending BE) |
| `domain/website-media` | `mediaApi.js` | media list/by id (pending BE) |
| `domain/website-notification` | `notificationApi.js` | notifications list (pending BE) |

Helpers: `shared/api/websiteApiBuilders.js` (`websiteGet`, `websiteMutate`, `websiteRaw`).

Store registration: `app/store/rootReducer.js` imports every `*Api.js`.

Aggregated paths: `shared/api/websiteEndpoints.js`.