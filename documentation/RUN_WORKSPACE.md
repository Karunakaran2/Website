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

Redis defaults: `localhost:6379`. PostgreSQL port from `.env` (often `5433`).

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
| `REDIS_HOST` / `REDIS_PORT` | `localhost` / `6379` | JWT revocation |
| `JWT_JWK_SET_URI` | `http://localhost:8081/api/v1/auth/.well-known/jwks.json` | Gateway JWT validation |
| `WEBSITE_DEV_ADMIN_PASSWORD` | `Admin@123` | First-run admin seed (auth-service) |

## Verification checklist

- [ ] Eureka dashboard lists `API-GATEWAY`, `AUTH-SERVICE`, …
- [ ] `GET http://localhost:8081/api/v1/health` (direct) and via gateway when routed
- [ ] Frontend loads; network tab shows `/api/...` → gateway
- [ ] Redis running; logout revokes JWT (`401` on reuse)
- [ ] Login `admin` / `Admin@123` → JWT; `GET /api/v1/admin/news` requires Bearer
- [ ] Public `GET /api/v1/content/news` works without token

## Probity reference ports (do not mix)

| Probity | Port |
|---------|------|
| service-registry | 8761 |
| probity-api-gateway | **8070** |
| login-service | 8081 |

KRAN gateway intentionally uses **8080** to match existing client config.
