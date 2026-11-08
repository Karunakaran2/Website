# Backend Microservices Architecture — Website

**SRS:** API_Requirements.md, Database_Requirements.md, System_Architecture.md  
**Stack:** Java 21, Spring Boot 3.3.5, Spring Cloud Gateway 2023.0.x, PostgreSQL, Flyway

## Workspace model

Each backend is an **independent Maven project** at the workspace root (no parent `pom.xml`, no `Website-services` folder).

| Folder | Service | Schema (dev) | Port |
|--------|---------|--------------|------|
| `website-api-gateway/` | Edge API | — | 8080 |
| `website-auth-service/` | Auth | `auth` | 8081 |
| `website-content-service/` | Content / CMS APIs | `content` | 8082 |
| `website-catalog-service/` | Catalog | `catalog` | 8083 |
| `website-media-service/` | Media | `media` | 8084 |
| `website-careers-service/` | Careers | `careers` | 8085 |
| `website-engagement-service/` | Engagement / contact | `engagement` | 8086 |
| `website-notification-service/` | Notifications | `notification` | 8087 |

Build one service:

```powershell
cd website-auth-service
mvn verify
```

Flyway migrations: `src/main/resources/db/migration/` inside each service folder.

Regenerate skeletons: `python scripts/bootstrap_backend.py`  
Sync SRS DDL: `python scripts/sync_database_migrations.py`

## Production database model (SRS)

Separate PostgreSQL databases `kran_auth`, `kran_content`, … — see `website-database/architecture/PostgreSQL_Database_Architecture.md`.
