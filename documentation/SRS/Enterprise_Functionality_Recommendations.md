# Enterprise Functionality Recommendations

**Date:** 2026-11-04

| Area | Recommendation | Rationale |
|------|----------------|-----------|
| A. Centralized application management | **Include** | Shell MFE with module registry, unified nav, global error boundary — **required** for unified UX (Section 7). |
| B. Authentication and security | **Partial + extend** | Preserve login+CAPTCHA+session (A). Add forgot password, MFA, lockout, JWT (C/D). **Remove hardcoded credentials (B).** |
| C. User and organization management | **Defer / partial** | Legacy: single admin only. Recommend multi-admin + roles (C). Org/dept masters **not applicable** unless KRAN expands CMS to intranet (E). |
| D. Workflow and approval management | **Defer** | No legacy approval flows. Include only if editorial/legal approval mandated (E). |
| E. Dashboard and analytics | **Improve** | Legacy dashboard minimal (B). Role-based widgets + GA integration (C). |
| F. Notification management | **Improve** | Email exists (A). Add in-app inbox + templates (C). |
| G. Document management | **Improve** | File upload/download exists for resumes, images, PDFs (A). Add virus scan, object storage, versioning (C). |
| H. Search and data management | **Improve** | Site search exists (A). Advanced search, export enquiries (C). No bulk import in legacy. |
| I. Audit and activity management | **Add** | Not in legacy (C/D). PostgreSQL audit columns + audit_log. |
| J. Master data and configuration | **Preserve + improve** | categorySetup, mailSetup (A). Centralize in catalog/notification services with PostgreSQL. |
| K. Reporting and export | **Add partial** | Resume export exists (A). Enquiry/application Excel reports (C). |
| L. System administration | **Add** | Actuator health, centralized logging (D). Module toggles (E). |

## Priority for unified enterprise website

1. Unified shell + preserved public/admin features (A).
2. Security remediation + PostgreSQL (B, database docs).
3. Admin UX improvements: dashboard, notifications, audit (E, F, I).
4. Business-confirmed: approvals, org structure, scheduled reports (D, C sections — E).
