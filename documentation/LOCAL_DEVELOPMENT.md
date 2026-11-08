# Local Development Guide

## Workspace root

`C:\Users\Karunakaran\git\Website` (folder name may appear as `Website` on case-insensitive volumes)

## PostgreSQL

**Host install:** run `infrastructure/website-database/scripts/001_create_website_db.sql` as superuser.

**Docker:** `infrastructure/website-infrastructure/docker-compose.yml` (port 5433).

Services default to **Probity-style** JDBC: `localhost:5432/website_db`, `postgres` / `pass`. Use `infrastructure/website-database/scripts/000_fresh_schemas_only.sql` then start services (Flyway). Override `WEBSITE_DB_*` from `infrastructure/website-infrastructure/.env.example` if needed.

## Backend (one service at a time)

```powershell
cd website-backend\website-api-gateway
mvn spring-boot:run
```

Repeat in separate terminals for other `website-*-service` folders as needed.

## Frontend

```powershell
cd website-frontend\website-client
npm install
npm run dev
```

Proxy `/api` → `http://localhost:8080` (see `vite.config.js`).

## SRS

`documentation/SRS/KranConsulting_SRS.docx` (v1.0, Draft for Review).
