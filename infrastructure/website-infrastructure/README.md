# Website Infrastructure

## Local PostgreSQL (Docker)

Does not modify an existing host PostgreSQL instance. Uses port **5433** by default to avoid clashing with local installs.

```powershell
copy .env.example .env
docker compose up -d postgres
```

JDBC URL for services when using Docker:

`jdbc:postgresql://localhost:5433/website_db?currentSchema=<schema>`

## Service ports (development)

| Service | Port |
|---------|------|
| api-gateway | 8080 |
| auth-service | 8081 |
| content-service | 8082 |
| catalog-service | 8083 |
| media-service | 8084 |
| careers-service | 8085 |
| engagement-service | 8086 |
| notification-service | 8087 |

## CI/CD

Pipeline templates are placeholders under `ci/` (to be wired to your Git host).
