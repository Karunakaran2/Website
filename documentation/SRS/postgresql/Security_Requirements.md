# PostgreSQL — Security and Access Control Requirements

**Applies to:** All `kran_*` PostgreSQL databases (target system)

---

## 1. Network and transport

| ID | Requirement |
|----|-------------|
| DB-SEC-001 | TLS required for all JDBC connections (`sslmode=require` or stricter). |
| DB-SEC-002 | PostgreSQL not exposed to public internet; private VPC/subnet only. |
| DB-SEC-003 | API Gateway is the only public entry; databases reachable only from service subnets. |

---

## 2. Authentication and roles

| Role pattern | Permissions | Used by |
|--------------|-------------|---------|
| `{db}_owner` | DDL in migration pipelines only | Flyway CI job |
| `{db}_app` | SELECT/INSERT/UPDATE/DELETE on owned schema | Spring Boot runtime |
| `{db}_readonly` | SELECT | Reporting replicas (optional) |
| `postgres` superuser | Not used by applications | Break-glass DBA only |

**DB-SEC-004:** Each microservice credential set scoped to **one database** only.  
**DB-SEC-005:** Passwords and connection strings in vault (Azure Key Vault / AWS Secrets Manager); never in git.

---

## 3. Authorization model

- **No cross-database grants** for application roles.
- Row-level security (RLS) optional for multi-tenant future; not required for single-tenant CMS v1.
- Admin identity from `kran_auth.admin_user`; JWT subject stored in `created_by` / `updated_by`.

---

## 4. Data protection

| Data class | Control |
|------------|---------|
| PII (name, email, mobile) | contacts, applications, resumes — encrypt at rest (disk/TDE); mask in non-prod |
| Resumes | Object storage with signed URLs; DB holds pointer only |
| mail_setup | No OAuth client secrets in DB |
| Passwords | bcrypt/argon2 in auth DB only |

**DB-SEC-006:** Non-production environments use anonymized or subset data.  
**DB-SEC-007:** Audit log of admin login and content publish (application + optional DB trigger for critical tables).

---

## 4. SQL injection and ORM

- Parameterized queries via JPA; no string-concatenated SQL in services.
- Flyway scripts reviewed in PR; no dynamic DDL from user input.

---

## 5. Compliance and retention

- Resume and enquiry retention per HR/legal (see Open Questions OQ-013).
- Right to erasure: soft-delete + purge job on `submitted_resumes` / `application_request` by request id.

---

## 6. Monitoring

- Log failed authentication to PostgreSQL (`log_connections`, `log_disconnections`).
- Alert on unusual connection counts per role.
- pgAudit or equivalent for DDL changes in production (Requires Business Confirmation).
