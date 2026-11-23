# Run KRAN Website Workspace (Probity-style)

Start order matches Probity: **registry → services → gateway → client**.

## Prerequisites

- Java 21, Maven 3.9+
- Node.js ≥ 26
- PostgreSQL `website_db` (pgAdmin — see `infrastructure/website-database/README.md`)
- **Redis** (required for JWT logout/revocation at auth-service + gateway)

## 0. Infrastructure (optional Docker)

```powershell
cd C:\Users\Karunakaran\git\Website\infrastructure\website-infrastructure
docker compose up -d postgres redis
```

Redis defaults: `localhost:6379`, password `pass` (matches Spring `REDIS_PASSWORD` default). PostgreSQL port from `.env` (often `5433`).

## 1. Service registry (Eureka)

```powershell
cd C:\Users\Karunakaran\git\Website\website-backend\website-service-registry
mvn spring-boot:run
```

Verify: http://localhost:8761

## 2. Microservices

Each in its own terminal (or IDE run config):

| Directory | `spring.application.name` | Port |
|-----------|---------------------------|------|
| `website-backend/website-auth-service` | auth-service | 8081 |
| `website-backend/website-content-service` | content-service | 8082 |
| `website-backend/website-catalog-service` | catalog-service | 8083 |
| `website-backend/website-media-service` | media-service | 8084 |
| `website-backend/website-careers-service` | careers-service | 8085 |
| `website-backend/website-engagement-service` | engagement-service | 8086 |
| `website-backend/website-notification-service` | notification-service | 8087 |

```powershell
cd website-backend\website-auth-service
mvn spring-boot:run
```

JPA services default to **Probity-style** DB: `jdbc:postgresql://localhost:5432/website_db`, user `postgres`, password `pass`. Override `WEBSITE_DB_*` only if your PostgreSQL differs.

## 3. API Gateway

```powershell
cd website-backend\website-api-gateway
mvn spring-boot:run
```

Default: http://localhost:8080 — routes use `lb://<service-id>` via Eureka.

Check routes: http://localhost:8080/actuator/gateway/routes (when exposed)

## 4. Frontend

```powershell
cd website-frontend\website-client
npm install
npm run dev
```

Dev server proxies `/api` to gateway (`vite.config.js`). Same pattern as `probity-client`.

## Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE` | `http://localhost:8761/eureka/` | All Eureka clients |
| `WEBSITE_GATEWAY_PORT` | `8080` | Gateway |
| `WEBSITE_REGISTRY_PORT` | `8761` | Eureka |
| `WEBSITE_DB_HOST` / `PORT` / `NAME` | `localhost` / `5432` / `website_db` | PostgreSQL (like Probity `probity` DB) |
| `WEBSITE_DB_USER` / `PASSWORD` | `postgres` / `pass` | Same as Probity local defaults |
| `REDIS_HOST` / `REDIS_PORT` / `REDIS_PASSWORD` | `localhost` / `6379` / `pass` | JWT revocation |
| `JWT_JWK_SET_URI` | `http://localhost:8081/api/v1/auth/.well-known/jwks.json` | Gateway JWT validation |
| `WEBSITE_DEV_ADMIN_USERNAME` | *(required for seed)* | First CMS admin username (auth-service, dev only) |
| `WEBSITE_DEV_ADMIN_PASSWORD` | *(required for seed)* | First CMS admin password (auth-service, dev only; never commit) |
| `WEBSITE_DEV_ADMIN_DISPLAY_NAME` | `KRAN Admin` | Optional display name for seeded admin |
| `WEBSITE_AUDIT_INGEST_SECRET` | `local-dev-audit-ingest` | Shared secret for gateway → auth-service CMS audit ingest (set the same on **auth-service** and **api-gateway**) |

## CMS login (real backend, no mock)

1. **Frontend:** `VITE_MOCK_API=false` in `.env.development` (default). Restart `npm run dev` after env changes.
2. **Database:** Flyway creates `auth.admin_user` but **does not insert any login rows**. Check users:

   ```sql
   -- pgAdmin on website_db (or scripts/003_check_cms_admin_users.sql)
   SELECT username, display_name, is_active FROM auth.admin_user;
   ```

   - **Empty result** → set admin env vars, then start **auth-service** once (see table below). It hashes the password with BCrypt and inserts one row.
   - **Rows present** → sign in with that **username** and the password you chose when the user was created (not stored in plain text in the DB).

3. **Login page:** username, password, and CAPTCHA from `GET /api/v1/captcha/getCaptcha` via gateway **8080**.

4. Stack must be up: Redis, Eureka, **auth-service**, **api-gateway**, then frontend proxy to **8080**.

Frontend API map: `website-frontend/website-client/docs/WEBSITE_API.md` and `src/shared/api/websiteEndpoints.js`.

## Verification checklist

- [ ] Eureka dashboard lists `API-GATEWAY`, `AUTH-SERVICE`, …
- [ ] `GET http://localhost:8081/api/v1/health` (direct) and via gateway when routed
- [ ] Frontend loads; network tab shows `/api/...` → gateway
- [ ] Redis running; logout revokes JWT (`401` on reuse)
- [ ] Login with your seeded CMS admin → JWT; `GET /api/v1/admin/news` requires Bearer
- [ ] Public `GET /api/v1/content/news` works without token

## Probity reference ports (do not mix)

| Probity | Port |
|---------|------|
| service-registry | 8761 |
| probity-api-gateway | **8070** |
| login-service | 8081 |

KRAN gateway intentionally uses **8080** to match existing client config.
