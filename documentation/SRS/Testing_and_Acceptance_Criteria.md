# Testing and Acceptance Criteria

**Date:** 2026-11-04

| Layer | Scope |
|-------|--------|
| Unit | Service domain logic, validators, mappers |
| Component | React shared library and MFE pages (Vitest/React Testing Library) |
| API | Contract tests from OpenAPI; auth and RBAC negative tests |
| Integration | MFE ↔ API Gateway ↔ services; Graph email stub |
| E2E | Playwright/Cypress: home, contact, job apply, admin login, news CRUD smoke |
| Security | OWASP ZAP baseline; dependency scanning |
| Performance | k6 load on public read APIs |
| Accessibility | axe-core on top public templates |
| UAT | Business sign-off per module in page inventory |

Major module acceptance: each FR in Functional_Requirements.md maps to test case `TC-<n>` in Requirements_Traceability_Matrix.xlsx.
