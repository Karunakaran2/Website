# Flyway DDL Scripts — PostgreSQL

Apply per microservice database. Naming: `V001__baseline.sql`.

```bash
# Example: content-service
flyway -url=jdbc:postgresql://localhost:5432/kran_content -user=kran_content_migrate -password=*** -locations=filesystem:./kran_content_service migrate
```

| Directory | Database (prod) |
|-----------|-------------------|
| kran_auth_service | kran_auth |
| kran_content_service | kran_content |
| kran_catalog_service | kran_catalog |
| kran_media_service | kran_media |
| kran_careers_service | kran_careers |
| kran_engagement_service | kran_engagement |
| kran_notification_service | kran_notification |

After migration from MariaDB, run sequence reset scripts documented in `Migration_Strategy_MariaDB_to_PostgreSQL.md`.
