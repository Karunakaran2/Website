# Probity → KRAN Website Architecture Mapping

**Reference (read-only):** `C:\Users\Karunakaran\git\probity-*`, `service-registry`  
**Target:** `C:\Users\Karunakaran\git\Website`

## Executive summary

| Layer | Probity | KRAN today | Target |
|-------|---------|------------|--------|
| Frontend | `probity-client` — Vite, Redux auth, `shared/api/client.js`, gateway `/api` | `website-client` — **same lineage** (design-system / Probity patterns already present) | Wire env to KRAN gateway; trim SPFO/Probity-only flows for CMS admin |
| Registry | `service-registry` — Eureka `:8761` | **Missing** | `website-service-registry` |
| Gateway | `probity-api-gateway` — `:8070`, Eureka, `lb://`, JWT+Redis | `website-api-gateway` — Eureka, JWT+Redis revocation, public/admin paths | Harden routes per SRS |
| Auth | `probity-login-service` — JWT, Redis session, captcha, Feign | `website-auth-service` — JWT, PG refresh tokens, Redis revoke | Optional captcha later |
| Business | `probity-master-service`, `accounting-service`, … | 6 domain services + notification | Keep KRAN boundaries; adopt **package & API response** conventions |

## Probity project map

| Probity | Role | KRAN equivalent |
|---------|------|-----------------|
| `probity-client` | SPA | `website-client` |
| `service-registry` | Eureka server | `website-service-registry` |
| `probity-api-gateway` | Edge routing, CORS, JWT | `website-api-gateway` |
| `probity-login-service` | Login, JWT, refresh | `website-auth-service` |
| `probity-master-service` | Master data (multi-module JAR style) | **No 1:1** — split across `catalog`, `content`, `media`, … |
| `accounting-service` / `asset-service` | Domain services | **None** (not in KRAN SRS) |

## Frontend (probity-client → website-client)

Already aligned structurally:

- `src/shared/api/client.js` — `apiUrl`, Bearer session, refresh token
- `src/domain/auth/` — login, session, Redux, guards
- Vite proxy `/api` → gateway in dev

**KRAN adaptations (later phases):**

- Point `VITE_API_BASE_URL` / dev proxy to KRAN gateway (`8080`).
- Auth API paths: `/api/v1/auth/*` (KRAN) vs `/api/v1/login/*` (Probity) — update `authApi.js` when backend exists.
- Remove or gate Probity-only: SPFO exchange, seat context, department login, masking.

## Backend patterns to adopt (per service)

From `probity-login-service` / domain services:

```
web/          controllers, request/response DTOs, ApiResponse wrapper
application/  services, mappers, exceptions
domain/       entities, repositories
infrastructure/ config, security, clients (Feign)
```

KRAN skeleton uses flat `controller/service/repository/entity` — **migrate incrementally** when implementing SRS features.

## Communication

| Concern | Probity | KRAN target |
|---------|---------|-------------|
| Discovery | Eureka `@8761` | Same |
| External API | Gateway only | Same — browser → gateway → `lb://service-id` |
| Service-to-service | OpenFeign + Eureka | Feign only where SRS requires cross-service calls |
| Auth token | JWT validated at gateway | Phase 2 — optional Redis revocation like Probity |

## Implementation phases

### Phase 1 — Platform (this change set)

- [x] `website-service-registry`
- [x] Gateway: Eureka client, CORS, `lb://` routes
- [x] All KRAN services: Eureka client registration
- [x] `RUN_WORKSPACE.md`

### Phase 2 — Auth parity (KRAN SRS) — done

- [x] JWT issue/refresh/logout/me in `website-auth-service`
- [x] Redis JWT revocation (auth + gateway)
- [x] Gateway OAuth2 resource server (JWK from auth-service)
- [x] Frontend website auth login (`VITE_WEBSITE_AUTH`, `/api/v1/auth/*`)

### Phase 3 — Domain APIs — in progress

- [x] Content: public news + admin CRUD, `ApiResponse`, exception handler
- [x] Catalog: public products
- [x] Careers: public jobs list
- [x] Engagement: contact submit
- [ ] Media, notification, remaining SRS admin surfaces

### Phase 4 — Hardening — started

- [x] Redis in `docker-compose.yml`
- [x] CI template `website-infrastructure/ci/backend-verify.yml`
- [x] Auth `@WebMvcTest` smoke test
- [ ] Full Testcontainers matrix per service

## What we do **not** copy

- Probity business modules (accounting, asset, workflow setup, seat allotment)
- masking-sdk / Hashids (unless KRAN SRS requires ID masking)
- SPFO / department login integration
