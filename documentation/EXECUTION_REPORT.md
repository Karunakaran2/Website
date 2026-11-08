# Website — Initial Setup Execution Report

**Date:** 2026-11-04  
**Workspace:** `C:\Users\Karunakaran\git\Website`

## 1. Folder structure

```
website/   (clone as C:\Users\Karunakaran\git\Website)
├── README.md
├── documentation/
├── scripts/
├── website-frontend/
│   └── website-client/
├── website-backend/
│   ├── website-service-registry/
│   ├── website-api-gateway/
│   ├── website-auth-service/
│   ├── website-content-service/
│   ├── website-catalog-service/
│   ├── website-media-service/
│   ├── website-careers-service/
│   ├── website-engagement-service/
│   └── website-notification-service/
└── infrastructure/
    ├── website-database/
    └── website-infrastructure/
```

## 2. Reference project safety

| Project | Modified |
|---------|----------|
| `KranConsulting` | **No** |
| `design-system` (original) | **No** |

## 3. Frontend clone status

| Item | Value |
|------|-------|
| Path | `website-client/` |
| Git branch | `Karunakaran_Dev_DS` |
| Git remote | `origin` → `C:\Users\Karunakaran\git\design-system` (unchanged — repoint before push) |
| Package name | `website-client` v0.1.0 |
| Page title | Website — KRAN Consulting |
| `node_modules` | Not installed in this session |

### Micro frontends (SRS)

| # | MFE | Purpose |
|---|-----|---------|
| 1 | shell | Host layout, auth gate, module registry |
| 2 | public-site | Marketing / static public pages |
| 3 | catalog-mfe | Services, solutions, projects, clients |
| 4 | content-mfe | News, gallery, timeline, data sheets (public) |
| 5 | careers-mfe | Careers and applications |
| 6 | admin-mfe | CMS / admin |

**Architecture:** Documented Module Federation path (`@originjs/vite-plugin-federation`). Current dev entry remains monolithic `npm run dev` while remotes are extracted into `host/` and `micro-frontends/`.

## 4. Backend microservices

| # | Service | Port | Flyway baseline |
|---|---------|------|-----------------|
| 1 | api-gateway | 8080 | — |
| 2 | auth-service | 8081 | V001 from SRS |
| 3 | content-service | 8082 | V001 from SRS |
| 4 | catalog-service | 8083 | V001 from SRS |
| 5 | media-service | 8084 | V001 from SRS |
| 6 | careers-service | 8085 | V001 from SRS |
| 7 | engagement-service | 8086 | V001 from SRS |
| 8 | notification-service | 8087 | V001 from SRS |

| Technology | Version |
|------------|---------|
| Java (target) | 21 |
| Spring Boot | 3.3.5 |
| Spring Cloud | 2023.0.3 |

**Build:** `mvn` was **not** on PATH; `mvn verify` not executed. Install Maven 3.9+ (see `SETUP_PREREQUISITES.md`).

## 5. PostgreSQL

| Item | Status |
|------|--------|
| Server | PostgreSQL **18.3** — `pg_isready` OK on `:5432` |
| Database `website_db` | **Not created** — superuser password for `postgres` not available (no credentials guessed) |
| Docker fallback | **Docker not on PATH** — Compose file prepared |
| Dev model | Single DB, schemas: `auth`, `content`, `catalog`, `media`, `careers`, `engagement`, `notification` |
| Init script | `website-database/scripts/001_create_website_db.sql` |
| Migrations copied | Yes — into each `website-*-service` + `website-database/ddl/` |

**To create DB:** run init SQL as superuser, or install Docker and `docker compose up -d postgres` in `Website-infrastructure/`.

## 6. API Gateway & authentication

| Component | Status |
|-----------|--------|
| Gateway routes | Configured for all 7 business services + auth |
| JWT / login APIs | **Not implemented** — skeleton + dev security (health public) |
| Auth-service DDL | Ready (admin_user, admin_login_audit) |

## 7. Tests / builds

| Check | Result |
|-------|--------|
| `mvn verify` | Skipped — Maven missing |
| `npm test` | Skipped — dependencies not installed |
| Flyway on live DB | Skipped — DB not created |

## 8. Remaining implementation (Phases 9–17)

- JWT authentication, refresh, RBAC, prod security configs
- Business controllers/services/repositories per SRS APIs
- Extract and wire Module Federation remotes
- Map KranConsulting Struts workflows to MFE + service endpoints
- Seed data, ER diagrams, integration/E2E tests
- CI/CD pipeline wiring
- Repoint `website-client` git remote; optional monorepo git at workspace root

## 10. Workspace restructure (Option A)

**Date applied:** 2026-11-04

- Removed `Website-services/` Maven aggregator and `shared-libraries` stub.
- Each backend lives at `website-<name>/` with standalone `spring-boot-starter-parent` POM.
- Renamed `Website-client` → `website-client`, database and infrastructure folders to lowercase `website-*`.

## 9. Pending clarifications / dependencies

- SRS **Draft for Review** — await formal approval signatures in Document Control
- PostgreSQL superuser credentials or Docker install for automated DB creation
- Maven on PATH or IDE integration for backend builds
- Media storage backend (filesystem vs object store) per SRS deployment
- Email/SMTP for notification-service and careers applications
