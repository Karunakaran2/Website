# Website Database

PostgreSQL is mandatory. Approved DDL is under `ddl/` (from `documentation/SRS/postgresql/`).

## Development model

| Environment | Database | Isolation |
|-------------|----------|-----------|
| Local dev | `website_db` | One database, **schema per microservice** |
| Production (SRS) | `kran_*` per service | Separate database per microservice |

Spring Boot services use `currentSchema=<schema>` in each service `application.yml`.

## Fresh start from scratch (recommended)

Use **one** path only — do not mix manual `ddl/` import **and** Flyway on the same schema.

### Path A — Flyway builds tables (simplest)

1. **pgAdmin** → Databases → drop `website_db` if it exists  
   (Right-click → Delete/Drop, or Query Tool on `postgres`:  
   `DROP DATABASE IF EXISTS website_db WITH (FORCE);`)
2. **Create** database `website_db` (Encoding UTF8).
3. Connect to **`website_db`** → Query Tool → run  
   `scripts/000_fresh_schemas_only.sql`
4. **Do not** run files under `ddl/` and **do not** use Restore / `pg_restore` on `.sql` files.
5. Start microservices (auth, content, catalog, …). Each service **Flyway** applies  
   `src/main/resources/db/migration/V*.sql` into its schema (`auth`, `content`, …).
6. DB login matches **Probity local dev** — no env needed if PostgreSQL uses  
   `postgres` / `pass` on `localhost:5432` and database `website_db`.  
   Override with `WEBSITE_DB_*` when your password differs.  
   Optional production-style role: `website_app` in `001_create_website_db.sql`.

Verify:

```sql
SELECT table_schema, COUNT(*) FROM information_schema.tables
WHERE table_schema IN ('auth','content','catalog','media','careers','engagement','notification')
  AND table_type = 'BASE TABLE'
GROUP BY table_schema ORDER BY 1;
```

After all services have started once: auth **3** tables (incl. `refresh_token`), content **4**, catalog **7**, media **2**, careers **3**, engagement **2**, notification **2**.

### Path B — Manual pgAdmin import (no Flyway on first run)

Only if you will **not** start services until DDL is done. For each file in `ddl/`, open Query Tool, paste **first line** `SET search_path TO "<schema>";`, then the file contents, Execute. Include auth **V001** and **V002**. When you later start services, Flyway may error on “already exists” — ask for baseline help or use Path A instead.

---

## Setup in pgAdmin (manual)

1. **Create database** `website_db` (UTF8, template `template0`).
2. Connect to `website_db` → Query Tool.
3. **Extension & schemas** — run:

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS content;
CREATE SCHEMA IF NOT EXISTS catalog;
CREATE SCHEMA IF NOT EXISTS media;
CREATE SCHEMA IF NOT EXISTS careers;
CREATE SCHEMA IF NOT EXISTS engagement;
CREATE SCHEMA IF NOT EXISTS notification;
```

4. **Apply SRS baselines** — for each row below, open the SQL file in `ddl/`, prepend `SET search_path TO "<schema>";`, then execute in Query Tool:

| Schema | File |
|--------|------|
| `auth` | `ddl/kran_auth_service/V001__baseline.sql` |
| `content` | `ddl/kran_content_service/V001__baseline.sql` |
| `catalog` | `ddl/kran_catalog_service/V001__baseline.sql` |
| `media` | `ddl/kran_media_service/V001__baseline.sql` |
| `careers` | `ddl/kran_careers_service/V001__baseline.sql` |
| `engagement` | `ddl/kran_engagement_service/V001__baseline.sql` |
| `notification` | `ddl/kran_notification_service/V001__baseline.sql` |

Skip duplicate `CREATE EXTENSION` lines inside the auth baseline if you already ran step 3.

5. **App role (optional for local dev):** see `scripts/001_create_website_db.sql` for `website_app` grants (run the role/grant section only, connected to `website_db`).

Reference script (psql-oriented, includes `\c`): `scripts/001_create_website_db.sql`.

## Flyway (services)

Copies of baselines for Spring Boot:

`website-<service>/src/main/resources/db/migration/V001__baseline.sql`

Refresh from SRS:

```powershell
python scripts\sync_database_migrations.py
```
