# Non-Functional Requirements

**Date:** 2026-11-04 | **Status:** Proposed targets (Requires Business Confirmation where noted)

## Performance (NFR-PER)

| ID | Requirement | Metric / Target |
|----|-------------|-----------------|
| NFR-PER-001 | Public marketing pages (cached shell + API) shall load primary content within 3 seconds on 4G for 95th percentile users. | Requires Business Confirmation |
| NFR-PER-002 | Public read APIs shall respond within 500 ms p95 under nominal load (100 concurrent users). | Requires Business Confirmation |
| NFR-PER-003 | Admin list endpoints shall support pagination default size 20, max 100. | Mandatory |
| NFR-PER-004 | Resume upload shall accept files up to 50 MB (parity with Struts multipart maxSize). | Existing: 50 MB |
| NFR-PER-005 | Gallery and media assets shall be served via CDN with cache headers. | Proposed |

## Security (NFR-SEC)

| ID | Requirement |
|----|-------------|
| NFR-SEC-001 | All traffic over HTTPS; HSTS enabled at gateway. |
| NFR-SEC-002 | Admin credentials shall not be stored in source code; secrets in vault/env. |
| NFR-SEC-003 | JWT/session tokens httpOnly where cookie-based; CSRF protection on state-changing browser forms. |
| NFR-SEC-004 | Input validation on all API DTOs; parameterized queries via JPA. |
| NFR-SEC-005 | XSS mitigation via React escaping + Content-Security-Policy headers. |
| NFR-SEC-006 | Rate limiting on login, enquiry, and job application endpoints. |
| NFR-SEC-007 | Resume downloads restricted to authenticated admin roles. |
| NFR-SEC-008 | Audit log for admin login and content publish events. |

## Scalability & Availability (NFR-SCA / NFR-AVL)

| ID | Requirement |
|----|-------------|
| NFR-SCA-001 | Each micro-frontend and microservice independently deployable. |
| NFR-SCA-002 | Stateless API instances horizontally scalable behind load balancer. |
| NFR-AVL-001 | Each service exposes `/actuator/health` (Spring Boot Actuator). |
| NFR-AVL-002 | Graceful degradation: public read pages remain available if admin services fail. |

## Maintainability (NFR-MNT)

| ID | Requirement |
|----|-------------|
| NFR-MNT-001 | OpenAPI 3 spec per service; shared error model. |
| NFR-MNT-002 | Unit test coverage minimum 70% for service business logic (proposed). |
| NFR-MNT-003 | Shared ESLint/Prettier and Java checkstyle aligned to org standards. |

## Accessibility & Usability (NFR-UX)

| ID | Requirement |
|----|-------------|
| NFR-UX-001 | Public site WCAG 2.2 Level AA compliance for new UI components. |
| NFR-UX-002 | Keyboard navigable main menu and forms; visible focus indicators. |
| NFR-UX-003 | Responsive layouts for desktop, tablet, and mobile (replace separate mobile JSP routes where feasible). |
| NFR-UX-004 | Cookie consent banner before non-essential analytics (parity with GA consent mode). |

## Compatibility (NFR-CMP)

| ID | Requirement |
|----|-------------|
| NFR-CMP-001 | Support latest two major versions of Chrome, Edge, Firefox, Safari. |
| NFR-CMP-002 | API versioning prefix `/api/v1/` with backward-compatible deprecation policy. |
