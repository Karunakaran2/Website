# PostgreSQL — Performance, Backup, and Recovery Requirements

---

## 1. Performance targets (proposed — Requires Business Confirmation)

| ID | Metric | Target |
|----|--------|--------|
| DB-PER-001 | Simple PK lookup | < 5 ms p95 at DB layer |
| DB-PER-002 | Paginated list (20 rows, indexed) | < 50 ms p95 |
| DB-PER-003 | Full-text search query | < 200 ms p95 or offload to OpenSearch |
| DB-PER-004 | Hikari pool wait | < 100 ms p95 under nominal load |

---

## 2. Query optimization

- `EXPLAIN (ANALYZE, BUFFERS)` for all admin list queries during development.
- Partial indexes for active/public content (`deleted_at IS NULL`).
- Avoid `SELECT *` in hot paths; DTO projections in repositories.
- Vacuum/analyze: autovacuum enabled; monitor bloat on `contacts` and `comments`.
- Connection pool sizing: start `maximum-pool-size = 20` per service instance; tune from metrics.

---

## 3. Read scaling

- Read replicas for reporting (optional phase 2).
- Public read APIs may cache at CDN/API gateway; not at DB unless materialized views for heavy dashboards.

---

## 4. Backup strategy

| Item | Requirement |
|------|-------------|
| DB-BKP-001 | Automated daily full backup per PostgreSQL database |
| DB-BKP-002 | WAL continuous archiving (PITR) with ≥ 7-day retention (adjust per policy) |
| DB-BKP-003 | Monthly restore drill to non-prod |
| DB-BKP-004 | Backup encryption at rest |
| DB-BKP-005 | Object storage (resumes/images) versioned separately from DB |

---

## 5. Recovery objectives (Requires Business Confirmation)

| Metric | Proposed |
|--------|----------|
| RPO | ≤ 1 hour (WAL) |
| RTO | ≤ 4 hours for full platform restore |

---

## 6. Disaster recovery

- Document runbook: restore single service DB without restoring others (bounded failure).
- Cross-region replica optional for `kran_content` + `kran_catalog` if marketing site SLA demands high availability.

---

## 7. Capacity planning

- Initial size estimate from MariaDB `information_schema` + file store size.
- Growth: enquiries and applications drive write volume; plan partition/archival for `contacts` > 10M rows (future).
