# Existing Functionality Gap Analysis

**Date:** 2026-11-04  
**Legacy reference:** `C:\Users\Karunakaran\git\KranConsulting` (Struts 2 + JSP + MariaDB)  
**Target:** Unified enterprise website (React MFE + Spring Boot + PostgreSQL)

## 1. Methodology

- Inventoried Struts actions in `login-config.xml` (172 actions) and admin `SideMenu.jsp`.
- Mapped public header navigation in `Header.jsp`.
- Verified Hibernate entities (19 tables); no Redux/React in legacy (N/A).
- CRUD/applicability matrix per module; approval workflows **not found** in source.

## 2. Requirement classification

| Code | Meaning |
|------|---------|
| **A** | Existing functionality — must preserve |
| **B** | Existing functionality — must improve |
| **C** | Missing functionality — recommended addition |
| **D** | New enterprise functionality — future system |
| **E** | Requires business confirmation |

## 3. Gap register

| Gap ID | Module | Existing | Limitation / missing | Business impact | Recommended enhancement | Proposed FR | Priority | Implementation | Biz confirm |
|--------|--------|----------|----------------------|-----------------|-------------------------|-------------|----------|----------------|-------------|
| GAP-001 | Authentication | Single hardcoded admin user in LoginAction | No DB user management, no password reset, no MFA | High security and ops risk | auth-service with admin_user, vault credentials, optional MFA | FR-002, FR-AUTH-* (proposed) | High | auth-service + admin-mfe | Yes |
| GAP-002 | Authorization | Single session userBean; no roles | No RBAC, no module-level permissions | Cannot delegate CMS duties safely | Role/permission matrix; JWT claims | FR-USER-* (proposed) | High | auth-service | Yes |
| GAP-003 | CMS content | Immediate publish on save | No draft/review/publish workflow | Content errors go live instantly | Draft status + publish schedule (news already has publish_Date) | FR-CMS-DRAFT (proposed) | Medium | content-service | Yes |
| GAP-004 | CMS lifecycle | Deactivate pattern; limited hard delete | Inconsistent delete vs deactivate; gallery deleteImage only | Orphan media risk | Unified soft-delete + media GC job | DB-REQ-004 | Medium | all CMS services | No |
| GAP-005 | Approvals | Not present in legacy | No approval/reject/resubmit for any module | N/A for current CMS; needed if compliance required | Defer unless business mandates editorial approval | — | Low | — | Yes |
| GAP-006 | Dashboard | Dashboard.jsp minimal | No analytics cards, pending counts, activity feed | Admin lacks operational overview | Admin dashboard widgets per module counts | FR-ADM-DASH (proposed) | Medium | admin-service BFF | Yes |
| GAP-007 | Notifications | Email via Graph only | No in-app notification center | Admin must use email for all alerts | notification-service inbox + email | FR-NOT-* (proposed) | Medium | notification-service | Yes |
| GAP-008 | Audit | No content audit trail in DB | Cannot see who changed news/banner | Compliance and troubleshooting gap | Audit columns + audit_log table | NFR-SEC-008, PostgreSQL audit | High | each service | No |
| GAP-009 | Search | Basic search action | No advanced search/facets across modules | Poor discoverability on large content | PostgreSQL FTS or OpenSearch | OQ-005 | Medium | content-service | Yes |
| GAP-010 | Comments | saveComment on blogs | Moderation UI not verified in admin SideMenu | Spam/toxic comment risk | Admin comment moderation module | FR-ENG-COMMENT (proposed) | Medium | engagement-service | Yes |
| GAP-011 | Reports | No operational reports | No Excel/PDF exports except resume bulk download | HR/marketing reporting manual | Report export APIs for enquiries/applications | FR-REP-* (proposed) | Medium | engagement/careers | Yes |
| GAP-012 | User profile | Not present | No admin profile/password change UI | Password rotation difficult | Profile + change password in admin-mfe | FR-USER-PROFILE (proposed) | Medium | auth-service | No |
| GAP-013 | Forgot password | Not present | No self-service recovery | Lockout requires developer | Email-based reset flow | FR-AUTH-RESET (proposed) | Medium | auth-service | Yes |
| GAP-014 | Multi-admin | Not present | Only one logical operator | Bus factor and concurrency | Multiple admin_user records | FR-USER-001 (proposed) | High | auth-service | Yes |
| GAP-015 | Mobile JSP variants | mobilekranps, mobiletech, mobilekranss | Separate mobile pages vs responsive | Duplicate maintenance | Responsive MFE; retire mobile routes | NFR-UX-003 | Medium | catalog-mfe | Yes |
| GAP-016 | Solution pages | Large Solutions.jsp static branches | Content in JSP not CMS-driven | Marketing updates require deploy | CMS-driven solution pages or headless content | FR-CAT-SOL-CMS (proposed) | High | catalog-mfe | Yes |
| GAP-017 | Service pages | Service.jsp session.tab branches | Same as solutions — JSP-heavy | Slow content iteration | Structured content API + MFE templates | FR-CAT-SVC-CMS (proposed) | Medium | catalog-mfe | Yes |
| GAP-018 | API layer | Struts .action only | No REST for integrations | Cannot feed mobile/apps | REST API inventory (proposed) | API Requirements | High | api-gateway | No |
| GAP-019 | Database | MariaDB monolith | Not PostgreSQL; no service isolation | Blocks scalable microservices | PostgreSQL per service + migration | Database_Requirements.md | High | all services | No |
| GAP-020 | Captcha | Session Captcha/CaptchaInner | No modern bot protection option | Abuse on forms | reCAPTCHA/hCaptcha + rate limits | OQ-012 | Medium | engagement-service | Yes |
| GAP-021 | Job applications | downloadFilteredResumes | Filter UI capabilities require UI verification | HR bulk processing | Preserve + improve filter/export in admin-mfe | FR-005 | High | careers-service | No |
| GAP-022 | Mail setup | mail_setup table | Secrets in Graph code defaults observed | Credential leakage risk | Vault + notification-service | NFR-SEC-002 | High | notification-service | No |
| GAP-023 | Category | String category on blog/case | Weak FK to category table | Inconsistent taxonomy | Normalize category_id FK in PostgreSQL | catalog-service | Medium | catalog-service | No |
| GAP-024 | Global admin shell | Separate JSP admin layout | Different UX from public site | Disjoint experience | Unified shell MFE with admin zone | Future_State doc | High | shell | No |
| GAP-025 | Under construction | comingsoon action | Placeholder routes exist | Document or redirect | 404 or CMS redirect rules | FR-PUB-UC | Low | shell | Yes |

## 4. Preservation summary (Category A — sample)

All public modules (home, about, services, solutions, projects, case studies, data sheets, news, gallery, careers, contact, enquiries, search) and admin CMS modules listed in `SideMenu.jsp` **must reach functional parity** in the new system.

See `Complete_Application_Sitemap.md` and `Functional_Requirements.md` (FR-001–FR-080).

## 5. Non-applicable enterprise patterns (legacy)

The following were **not identified** in the existing application (do not assume they exist):

- Multi-level approval workflows, delegation, escalation
- Draft/submit/approve/reject for CMS content
- Organization/department master data
- In-application notification center
- Role management UI
- Scheduled operational reports

These appear in `Enterprise_Functionality_Recommendations.md` as evaluated additions.
