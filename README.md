# Website (monorepo)

KRAN Consulting public website — React frontend, Spring Cloud microservices, PostgreSQL.

**SRS:** `documentation/SRS/`

## Repository layout

```text
website/                              ← GitHub repo root (clone folder name may vary)
├── README.md
├── documentation/
├── scripts/
├── website-frontend/
│   └── website-client/           # React / Vite
├── website-backend/
│   ├── website-service-registry/ # Eureka :8761
│   ├── website-api-gateway/      # :8080
│   ├── website-auth-service/     # :8081
│   ├── website-content-service/  # :8082
│   ├── website-catalog-service/  # :8083
│   ├── website-media-service/    # :8084
│   ├── website-careers-service/  # :8085
│   ├── website-engagement-service/ # :8086
│   └── website-notification-service/ # :8087
└── infrastructure/
    ├── website-database/         # DDL & pgAdmin scripts
    └── website-infrastructure/   # Docker Compose, CI templates
```

Each backend folder is a **standalone Maven** project (no root parent POM).

## Quick start

See `documentation/RUN_WORKSPACE.md`.

```powershell
cd website-backend\website-auth-service
mvn spring-boot:run

cd website-frontend\website-client
npm install && npm run dev
```

## Publish to GitHub

See `documentation/GITHUB.md`.
