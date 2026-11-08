# CI/CD Templates

Add pipeline definitions here for:

- `website-client` — lint, test, build per MFE + host
- Each `website-*-service` — independent `mvn verify` and container image
- Flyway migration validation against ephemeral PostgreSQL (Testcontainers)

Each backend job should use `working-directory` pointing at a single service folder (no monorepo Maven reactor).
