# Business Rules Catalog

**Date:** 2026-11-04  
**Source:** Legacy `LoginAction.java`, `Contacts` entity, `SideMenu.jsp`, `web.xml`, Struts config.

| Rule ID | Domain | Rule | Source |
|---------|--------|------|--------|
| BR-AUTH-001 | Authentication | Admin login requires CaptchaInner match and valid credentials | LoginAction.login |
| BR-AUTH-002 | Session | Admin routes require session attribute `userBean` | SessionExpiredAction |
| BR-AUTH-003 | Session | HTTP session timeout 45 minutes | web.xml |
| BR-FORM-001 | Contact | sendMsg defaults request_type to `G` if empty | LoginAction.sendMsg |
| BR-FORM-002 | Contact | request_type `C` changes email subject line | LoginAction.sendMsg |
| BR-FORM-003 | Enquiry | submitEnquiry requires session Captcha match | LoginAction.submitEnquiry |
| BR-FORM-004 | Applications | Resume stored under `kran_uploads/Resumes` with random prefix filename | LoginAction.saveCandidate |
| BR-MAIL-001 | Email | Mail routing uses mail_setup rows by type (G, S, H, …); fallback to info@kran.co.in | LoginAction mail blocks |
| BR-MAIL-002 | Email | Outbound mail via Microsoft Graph async CompletableFuture | GraphEmailService |
| BR-CAR-001 | Careers | Job linked applications via career_Id FK | ApplicationRequest |
| BR-CMS-001 | CMS | Deactivate pattern used vs hard delete for most content | *Deactivate actions |
| BR-CMS-002 | Banner | Display order updated via updateBannerOrder / tableDnD | Dashboard.jsp |
| BR-UPLOAD-001 | Upload | Struts multipart max 50MB | struts.xml constant |
| BR-CONSENT-001 | Analytics | GA loads per cookie consent / consent mode v2 | Header.jsp |
| BR-SEC-001 | Security | Direct JSP access blocked via web.xml security constraint | web.xml |

## Proposed rules (target system)

| Rule ID | Rule |
|---------|------|
| BR-PG-001 | All business timestamps stored as TIMESTAMPTZ (UTC) in PostgreSQL |
| BR-PG-002 | Soft-deleted CMS rows excluded from public APIs |
| BR-RBAC-001 | Admin module access enforced via role permissions (future) |
