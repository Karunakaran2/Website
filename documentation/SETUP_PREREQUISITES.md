# Setup Prerequisites

| Tool | Required | Notes |
|------|----------|-------|
| **JDK** | 21 LTS (recommended) | Each service POM uses Java 21 |
| **Maven** | 3.9+ | Run inside each `website-*-service` folder |
| **Node.js** | ≥ 26 | `website-client/package.json` |
| **PostgreSQL** | 18.x (optional locally) | Or Docker via `website-infrastructure` |

Example:

```powershell
cd website-auth-service
mvn verify
```
