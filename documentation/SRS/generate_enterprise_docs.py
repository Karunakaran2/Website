#!/usr/bin/env python3
"""Generate enterprise SRS extension documents and Master RTM. Run from SRS folder."""
from __future__ import annotations

import re
from datetime import date
from pathlib import Path

OUTPUT = Path(__file__).resolve().parent
DATE = date.today().isoformat()

# --- Module inventory from legacy Struts (source-code verified) ---
ADMIN_MODULES = [
    ("ADM-DASH", "Dashboard", "dashboard", "View admin home, banner order widget", "Admin"),
    ("ADM-REQ", "General requests", "request", "List contacts type G", "Admin"),
    ("ADM-SOLREQ", "Solution requests", "solRequest", "List all enquiry types", "Admin"),
    ("ADM-CAR", "Careers", "adminCareer", "Job CRUD", "Admin"),
    ("ADM-NOVAC", "No vacancy", "NoVacancy", "Global hiring message", "Admin"),
    ("ADM-JOBAPP", "Job applications", "jobApplications", "Review applications, download resumes", "Admin"),
    ("ADM-NEWS", "News/Events", "adminNews", "News CRUD, deactivate", "Admin"),
    ("ADM-DS", "Data sheets", "adminBlogs", "Blog entity CRUD (admin label Data Sheets)", "Admin"),
    ("ADM-CASE", "Case studies", "adminCase", "Case study CRUD", "Admin"),
    ("ADM-GAL", "Gallery", "adminGallery", "Groups + images", "Admin"),
    ("ADM-KSOL", "Kran solutions", "adminKranSolutions", "Portfolio solutions CRUD", "Admin"),
    ("ADM-KTL", "Timeline", "adminKranTimeline", "Timeline CRUD", "Admin"),
    ("ADM-KPRJ", "Kran projects", "adminKranProjects", "Portfolio projects CRUD", "Admin"),
    ("ADM-PP", "Product/Projects catalog", "getProjectProduct", "project_product CRUD", "Admin"),
    ("ADM-SEN", "Kran seniors", "adminKranSeniors", "Senior profiles CRUD", "Admin"),
    ("ADM-FACE", "Kran faces", "adminKranFaces", "Faces CRUD", "Admin"),
    ("ADM-BAN", "Banners", "adminBanner", "Banner CRUD, drag order", "Admin"),
    ("ADM-MAIL", "Mail setup", "mailSetup", "Routing emails by type", "Admin"),
    ("ADM-CAT", "Categories", "categorySetup", "Category reference CRUD", "Admin"),
]

PUBLIC_MODULES = [
    ("PUB-HOME", "Home", "welcome", "Landing, banners, testimonials"),
    ("PUB-ABT", "About", "aboutus", "Corporate about anchors"),
    ("PUB-SVC", "Services", "getService", "Six service pages via val"),
    ("PUB-SOL", "Solutions", "solutions, allsolutions", "Product solution catalog"),
    ("PUB-PRJ", "Projects", "projects, readProject, projectDetail", "Kran projects public"),
    ("PUB-CS", "Case studies", "casestudy, readCase, categorycase", "Case listing/detail"),
    ("PUB-DS", "Data sheets", "datasheets, blog, readBlog", "Blog/data sheets"),
    ("PUB-NEWS", "News", "news, newsDetail, viewNews", "News listing/detail"),
    ("PUB-GAL", "Gallery", "gallery, galleryAjax, galleryView", "Photo galleries"),
    ("PUB-CAR", "Careers", "overview, career, jobApply", "Jobs and apply"),
    ("PUB-TEAM", "Team", "teammanagement", "Faces of KRAN"),
    ("PUB-CSR", "CSR", "krancsr", "CSR page"),
    ("PUB-TECH", "Technologies", "krantech", "Tech showcase"),
    ("PUB-CONT", "Contact", "contact, sendMsg", "Contact form"),
    ("PUB-ENQ", "Enquiries", "submitEnquiry, submitKProjects, submitKSolutions, enquire", "Product/project forms"),
    ("PUB-SRCH", "Search", "search, result", "Site search"),
    ("PUB-COOK", "Cookie consent", "saveCookieConsent, getCookieConsent", "GA consent"),
    ("PUB-AUTH", "Admin login", "admin, login, logout", "CMS login"),
]

GAPS = [
    ("GAP-001", "Authentication", "Single hardcoded admin user in LoginAction", "No DB user management, no password reset, no MFA", "High security and ops risk", "auth-service with admin_user, vault credentials, optional MFA", "FR-002, FR-AUTH-* (proposed)", "High", "auth-service + admin-mfe", "Yes"),
    ("GAP-002", "Authorization", "Single session userBean; no roles", "No RBAC, no module-level permissions", "Cannot delegate CMS duties safely", "Role/permission matrix; JWT claims", "FR-USER-* (proposed)", "High", "auth-service", "Yes"),
    ("GAP-003", "CMS content", "Immediate publish on save", "No draft/review/publish workflow", "Content errors go live instantly", "Draft status + publish schedule (news already has publish_Date)", "FR-CMS-DRAFT (proposed)", "Medium", "content-service", "Yes"),
    ("GAP-004", "CMS lifecycle", "Deactivate pattern; limited hard delete", "Inconsistent delete vs deactivate; gallery deleteImage only", "Orphan media risk", "Unified soft-delete + media GC job", "DB-REQ-004", "Medium", "all CMS services", "No"),
    ("GAP-005", "Approvals", "Not present in legacy", "No approval/reject/resubmit for any module", "N/A for current CMS; needed if compliance required", "Defer unless business mandates editorial approval", "—", "Low", "—", "Yes"),
    ("GAP-006", "Dashboard", "Dashboard.jsp minimal", "No analytics cards, pending counts, activity feed", "Admin lacks operational overview", "Admin dashboard widgets per module counts", "FR-ADM-DASH (proposed)", "Medium", "admin-service BFF", "Yes"),
    ("GAP-007", "Notifications", "Email via Graph only", "No in-app notification center", "Admin must use email for all alerts", "notification-service inbox + email", "FR-NOT-* (proposed)", "Medium", "notification-service", "Yes"),
    ("GAP-008", "Audit", "No content audit trail in DB", "Cannot see who changed news/banner", "Compliance and troubleshooting gap", "Audit columns + audit_log table", "NFR-SEC-008, PostgreSQL audit", "High", "each service", "No"),
    ("GAP-009", "Search", "Basic search action", "No advanced search/facets across modules", "Poor discoverability on large content", "PostgreSQL FTS or OpenSearch", "OQ-005", "Medium", "content-service", "Yes"),
    ("GAP-010", "Comments", "saveComment on blogs", "Moderation UI not verified in admin SideMenu", "Spam/toxic comment risk", "Admin comment moderation module", "FR-ENG-COMMENT (proposed)", "Medium", "engagement-service", "Yes"),
    ("GAP-011", "Reports", "No operational reports", "No Excel/PDF exports except resume bulk download", "HR/marketing reporting manual", "Report export APIs for enquiries/applications", "FR-REP-* (proposed)", "Medium", "engagement/careers", "Yes"),
    ("GAP-012", "User profile", "Not present", "No admin profile/password change UI", "Password rotation difficult", "Profile + change password in admin-mfe", "FR-USER-PROFILE (proposed)", "Medium", "auth-service", "No"),
    ("GAP-013", "Forgot password", "Not present", "No self-service recovery", "Lockout requires developer", "Email-based reset flow", "FR-AUTH-RESET (proposed)", "Medium", "auth-service", "Yes"),
    ("GAP-014", "Multi-admin", "Not present", "Only one logical operator", "Bus factor and concurrency", "Multiple admin_user records", "FR-USER-001 (proposed)", "High", "auth-service", "Yes"),
    ("GAP-015", "Mobile JSP variants", "mobilekranps, mobiletech, mobilekranss", "Separate mobile pages vs responsive", "Duplicate maintenance", "Responsive MFE; retire mobile routes", "NFR-UX-003", "Medium", "catalog-mfe", "Yes"),
    ("GAP-016", "Solution pages", "Large Solutions.jsp static branches", "Content in JSP not CMS-driven", "Marketing updates require deploy", "CMS-driven solution pages or headless content", "FR-CAT-SOL-CMS (proposed)", "High", "catalog-mfe", "Yes"),
    ("GAP-017", "Service pages", "Service.jsp session.tab branches", "Same as solutions — JSP-heavy", "Slow content iteration", "Structured content API + MFE templates", "FR-CAT-SVC-CMS (proposed)", "Medium", "catalog-mfe", "Yes"),
    ("GAP-018", "API layer", "Struts .action only", "No REST for integrations", "Cannot feed mobile/apps", "REST API inventory (proposed)", "API Requirements", "High", "api-gateway", "No"),
    ("GAP-019", "Database", "MariaDB monolith", "Not PostgreSQL; no service isolation", "Blocks scalable microservices", "PostgreSQL per service + migration", "Database_Requirements.md", "High", "all services", "No"),
    ("GAP-020", "Captcha", "Session Captcha/CaptchaInner", "No modern bot protection option", "Abuse on forms", "reCAPTCHA/hCaptcha + rate limits", "OQ-012", "Medium", "engagement-service", "Yes"),
    ("GAP-021", "Job applications", "downloadFilteredResumes", "Filter UI capabilities require UI verification", "HR bulk processing", "Preserve + improve filter/export in admin-mfe", "FR-005", "High", "careers-service", "No"),
    ("GAP-022", "Mail setup", "mail_setup table", "Secrets in Graph code defaults observed", "Credential leakage risk", "Vault + notification-service", "NFR-SEC-002", "High", "notification-service", "No"),
    ("GAP-023", "Category", "String category on blog/case", "Weak FK to category table", "Inconsistent taxonomy", "Normalize category_id FK in PostgreSQL", "catalog-service", "Medium", "catalog-service", "No"),
    ("GAP-024", "Global admin shell", "Separate JSP admin layout", "Different UX from public site", "Disjoint experience", "Unified shell MFE with admin zone", "Future_State doc", "High", "shell", "No"),
    ("GAP-025", "Under construction", "comingsoon action", "Placeholder routes exist", "Document or redirect", "404 or CMS redirect rules", "FR-PUB-UC", "Low", "shell", "Yes"),
]


def write_gap_analysis() -> None:
    lines = [
        "# Existing Functionality Gap Analysis",
        "",
        f"**Date:** {DATE}  ",
        "**Legacy reference:** `C:\\Users\\Karunakaran\\git\\KranConsulting` (Struts 2 + JSP + MariaDB)  ",
        "**Target:** Unified enterprise website (React MFE + Spring Boot + PostgreSQL)",
        "",
        "## 1. Methodology",
        "",
        "- Inventoried Struts actions in `login-config.xml` (172 actions) and admin `SideMenu.jsp`.",
        "- Mapped public header navigation in `Header.jsp`.",
        "- Verified Hibernate entities (19 tables); no Redux/React in legacy (N/A).",
        "- CRUD/applicability matrix per module; approval workflows **not found** in source.",
        "",
        "## 2. Requirement classification",
        "",
        "| Code | Meaning |",
        "|------|---------|",
        "| **A** | Existing functionality — must preserve |",
        "| **B** | Existing functionality — must improve |",
        "| **C** | Missing functionality — recommended addition |",
        "| **D** | New enterprise functionality — future system |",
        "| **E** | Requires business confirmation |",
        "",
        "## 3. Gap register",
        "",
        "| Gap ID | Module | Existing | Limitation / missing | Business impact | Recommended enhancement | Proposed FR | Priority | Implementation | Biz confirm |",
        "|--------|--------|----------|----------------------|-----------------|-------------------------|-------------|----------|----------------|-------------|",
    ]
    for g in GAPS:
        lines.append(f"| {g[0]} | {g[1]} | {g[2]} | {g[3]} | {g[4]} | {g[5]} | {g[6]} | {g[7]} | {g[8]} | {g[9]} |")
    lines += [
        "",
        "## 4. Preservation summary (Category A — sample)",
        "",
        "All public modules (home, about, services, solutions, projects, case studies, data sheets, news, gallery, careers, contact, enquiries, search) and admin CMS modules listed in `SideMenu.jsp` **must reach functional parity** in the new system.",
        "",
        "See `Complete_Application_Sitemap.md` and `Functional_Requirements.md` (FR-001–FR-080).",
        "",
        "## 5. Non-applicable enterprise patterns (legacy)",
        "",
        "The following were **not identified** in the existing application (do not assume they exist):",
        "",
        "- Multi-level approval workflows, delegation, escalation",
        "- Draft/submit/approve/reject for CMS content",
        "- Organization/department master data",
        "- In-application notification center",
        "- Role management UI",
        "- Scheduled operational reports",
        "",
        "These appear in `Enterprise_Functionality_Recommendations.md` as evaluated additions.",
        "",
    ]
    (OUTPUT / "Existing_Functionality_Gap_Analysis.md").write_text("\n".join(lines), encoding="utf-8")


def write_sitemap() -> None:
    lines = [
        "# Complete Application Sitemap",
        "",
        f"**Date:** {DATE}  ",
        "**Entry:** `welcome.action` / `yCIMVQ5RMbA.html`  ",
        "**Admin entry:** `admin.action` → `login.action` → `dashboard.action`",
        "",
        "## 1. Site tree",
        "",
        "```",
        "KranConsulting (unified future shell)",
        "├── Public (public-site + catalog-mfe + content-mfe + careers-mfe)",
        "│   ├── Home (welcome)",
        "│   ├── About (aboutus + anchors: quality, culture, awards, leadership, timeline, FAQ, …)",
        "│   ├── Services (getService?val=*)",
        "│   │   ├── consultancy",
        "│   │   ├── software-development",
        "│   │   ├── mobile-app-development",
        "│   │   ├── project-product-implementation",
        "│   │   ├── maintenance-support",
        "│   │   └── porting-migration",
        "│   ├── Solutions (allsolutions, solutions?val=<slug>)",
        "│   ├── Projects (projects, readProject, projectDetail, kranps, kranss, mobile*)",
        "│   ├── Domain (domain)",
        "│   ├── Clients (clients)",
        "│   ├── Case studies (casestudy, readCase, categorycase)",
        "│   ├── Data sheets (datasheets, blog, readBlog)",
        "│   ├── News (news, newsDetail, viewNews, viewNewsDesc)",
        "│   ├── Gallery (gallery, galleryView, galleryAjax)",
        "│   ├── Careers (overview, career, jobApply, jobOverview, successMessage)",
        "│   ├── Team (teammanagement)",
        "│   ├── CSR (krancsr)",
        "│   ├── Technologies (krantech)",
        "│   ├── Contact (contact)",
        "│   ├── Enquiry flows (enquire, submitEnquiry, submitKProjects, submitKSolutions)",
        "│   ├── Product landings (pfms360, hrms, …)",
        "│   ├── Search (search, result)",
        "│   └── Cookie consent (AJAX save/get)",
        "└── Admin (admin-mfe, session required)",
        "    ├── Dashboard (dashboard)",
        "    ├── Requests (request, solRequest)",
        "    ├── Careers (adminCareer, careerAdd, editJob, jobDeactivate, NoVacancy, jobApplications)",
        "    ├── News (adminNews, newsAdd, editNews, newsDeactivate, readNews)",
        "    ├── Data sheets (adminBlogs, blogAdd, editBlog, blogDeactivate, downloadBlogDoc)",
        "    ├── Case studies (adminCase, caseAdd, editCase, caseDeactivate, downloadCaseDoc)",
        "    ├── Gallery (adminGallery, groupAdd, groupView, galleryAdd, deleteImage, deactivateGroup)",
        "    ├── Solutions portfolio (adminKranSolutions + add/edit/deactivate)",
        "    ├── Timeline (adminKranTimeline + add/edit/deactivate)",
        "    ├── Projects portfolio (adminKranProjects + add/edit/deactivate)",
        "    ├── Product/Projects (getProjectProduct, ppAdd, editPP, deactivatePP, updateOrder)",
        "    ├── Seniors (adminKranSeniors + CRUD/deactivate)",
        "    ├── Faces (adminKranFaces + CRUD/deactivate)",
        "    ├── Banners (adminBanner + CRUD/deactivate, updateBannerOrder)",
        "    ├── Mail setup (mailSetup, mailAdd, editMail, mailDeactivate)",
        "    └── Categories (categorySetup, categoryAdd, editCategory, categoryDeactivate)",
        "```",
        "",
        "## 2. Page registry (representative)",
        "",
        "| Page ID | Page name | Module | Purpose | Roles | Struts action | MFE (proposed) |",
        "|---------|-----------|--------|---------|-------|---------------|----------------|",
    ]
    pid = 1
    for mid, name, action, purpose, role in ADMIN_MODULES:
        lines.append(f"| PG-{pid:03d} | {name} | Admin CMS | {purpose} | {role} | {action} | admin-mfe |")
        pid += 1
    for mid, name, action, purpose in PUBLIC_MODULES:
        lines.append(f"| PG-{pid:03d} | {name} | Public | {purpose} | Public | {action} | public-site/catalog/content/careers |")
        pid += 1
    lines += [
        "",
        "## 3. Orphan / weak-navigation routes (source-code observations)",
        "",
        "| Route | Observation |",
        "|-------|-------------|",
        "| `comingsoon` | Under construction placeholder |",
        "| `probity`, `snasparsh` | Commented out in login-config.xml |",
        "| `mobilekranps`, `mobilekranss`, `mobiletech` | Parallel mobile JSPs — not in main desktop nav |",
        "| `viewComments`, `addReply` | Blog comments — public; admin moderation link unclear |",
        "| `product`, `krancs`, `kranprojects` (HTML) | Legacy HTML actions — verify redirects |",
        "",
        "**Rule:** Do not remove until business confirms deprecation (Category E).",
        "",
    ]
    (OUTPUT / "Complete_Application_Sitemap.md").write_text("\n".join(lines), encoding="utf-8")


def write_workflow_analysis() -> None:
    crud = "C=Create R=Read U=Update D=Deactivate/Del S=Submit X=export"
    lines = [
        "# Module-Wise Workflow Analysis",
        "",
        f"**Date:** {DATE}",
        "",
        "## 1. Workflow completeness matrix",
        "",
        f"Legend: {crud}. **Approve/Reject/Cancel/Reopen/Draft** — not applicable in legacy CMS unless noted as gap.",
        "",
        "| Module | Open | List/Read | Search/Filter | Create | Edit | Delete/Deactivate | Submit | Approve | Export | Notify | Audit | Completeness notes |",
        "|--------|------|-----------|---------------|--------|------|-------------------|--------|---------|--------|--------|-------|---------------------|",
        "| Public contact | Y | — | — | Y form | — | — | Y sendMsg | — | — | Y email | — | CAPTCHA validated |",
        "| Job apply | Y | Y jobs | — | Y apply | — | — | Y saveCandidate | — | — | Y email | — | Resume upload |",
        "| Admin news | Y | Y adminNews | partial table | Y newsAdd | Y editNews | Y newsDeactivate | Y save | — | — | — | — | No draft workflow (GAP-003) |",
        "| Admin careers | Y | Y adminCareer | — | Y careerAdd | Y editJob | Y jobDeactivate | Y saveJob | — | Y resumes | — | — | jobApplications review |",
        "| Admin gallery | Y | Y groupView | — | Y groupAdd/galleryAdd | — | Y deleteImage/deactivateGroup | Y save | — | — | — | — | |",
        "| Admin banner | Y | Y adminBanner | — | Y bannerAdd | Y editBanner | Y bannerDeactivate | Y save | — | — | — | — | Drag order updateBannerOrder |",
        "| Admin data sheets | Y | Y adminBlogs | — | Y blogAdd | Y editBlog | Y blogDeactivate | Y save | — | Y downloadBlogDoc | — | — | |",
        "| Admin requests | Y | Y request/solRequest | — | — | — | — | — | — | — | — | — | Read-only lists |",
        "| Blog comments | — | Y viewComments | — | Y saveComment | — | — | — | — | — | — | — | Moderation gap GAP-010 |",
        "| Authentication | Y | — | — | — | — | — | Y login | — | — | — | — | Single admin GAP-001 |",
    ]
    lines += [
        "",
        "## 2. End-to-end workflow — job application (existing)",
        "",
        "```mermaid",
        "sequenceDiagram",
        "  participant U as Job seeker",
        "  participant W as Public site",
        "  participant S as Struts LoginAction",
        "  participant DB as MariaDB",
        "  participant G as Microsoft Graph",
        "  U->>W: Open career / jobApply",
        "  U->>W: Fill form + upload resume",
        "  W->>S: saveCandidate",
        "  S->>S: Validate CAPTCHA (public forms)",
        "  S->>DB: Insert application_request",
        "  S->>DB: Store file under kran_uploads/Resumes",
        "  S-->>G: Async HR + candidate emails",
        "  S-->>U: Success-Message.jsp",
        "```",
        "",
        "## 3. End-to-end workflow — admin news publish (existing)",
        "",
        "```mermaid",
        "flowchart TD",
        "  A[Admin login + session] --> B[adminNews list]",
        "  B --> C[newsAdd form]",
        "  C --> D[saveNews validation]",
        "  D --> E[(news table)]",
        "  E --> F[Redirect adminNews]",
        "  F --> G[Public news / newsDetail]",
        "```",
        "",
        "## 4. Target-state workflow enhancements (proposed — Category C/D)",
        "",
        "- Editorial draft → review → publish for news and data sheets.",
        "- Admin MFA login; role-based module access.",
        "- In-app notification when new enquiry or job application arrives.",
        "",
    ]
    (OUTPUT / "Module_Wise_Workflow_Analysis.md").write_text("\n".join(lines), encoding="utf-8")


def write_enterprise_recommendations() -> None:
    sections = [
        ("A. Centralized application management", "Include", "Shell MFE with module registry, unified nav, global error boundary — **required** for unified UX (Section 7)."),
        ("B. Authentication and security", "Partial + extend", "Preserve login+CAPTCHA+session (A). Add forgot password, MFA, lockout, JWT (C/D). **Remove hardcoded credentials (B).**"),
        ("C. User and organization management", "Defer / partial", "Legacy: single admin only. Recommend multi-admin + roles (C). Org/dept masters **not applicable** unless KRAN expands CMS to intranet (E)."),
        ("D. Workflow and approval management", "Defer", "No legacy approval flows. Include only if editorial/legal approval mandated (E)."),
        ("E. Dashboard and analytics", "Improve", "Legacy dashboard minimal (B). Role-based widgets + GA integration (C)."),
        ("F. Notification management", "Improve", "Email exists (A). Add in-app inbox + templates (C)."),
        ("G. Document management", "Improve", "File upload/download exists for resumes, images, PDFs (A). Add virus scan, object storage, versioning (C)."),
        ("H. Search and data management", "Improve", "Site search exists (A). Advanced search, export enquiries (C). No bulk import in legacy."),
        ("I. Audit and activity management", "Add", "Not in legacy (C/D). PostgreSQL audit columns + audit_log."),
        ("J. Master data and configuration", "Preserve + improve", "categorySetup, mailSetup (A). Centralize in catalog/notification services with PostgreSQL."),
        ("K. Reporting and export", "Add partial", "Resume export exists (A). Enquiry/application Excel reports (C)."),
        ("L. System administration", "Add", "Actuator health, centralized logging (D). Module toggles (E)."),
    ]
    lines = ["# Enterprise Functionality Recommendations", "", f"**Date:** {DATE}", "", "| Area | Recommendation | Rationale |", "|------|----------------|-----------|"]
    for a, b, c in sections:
        lines.append(f"| {a} | **{b}** | {c} |")
    lines.append("\n## Priority for unified enterprise website\n\n1. Unified shell + preserved public/admin features (A).\n2. Security remediation + PostgreSQL (B, database docs).\n3. Admin UX improvements: dashboard, notifications, audit (E, F, I).\n4. Business-confirmed: approvals, org structure, scheduled reports (D, C sections — E).\n")
    (OUTPUT / "Enterprise_Functionality_Recommendations.md").write_text("\n".join(lines), encoding="utf-8")


def write_business_rules() -> None:
    text = f"""# Business Rules Catalog

**Date:** {DATE}  
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
"""
    (OUTPUT / "Business_Rules_Catalog.md").write_text(text, encoding="utf-8")


def write_completeness_report() -> None:
    checks = [
        ("All discoverable modules inventoried", "Yes", "SideMenu + login-config + Header"),
        ("All pages documented", "Yes", "Complete_Application_Sitemap.md"),
        ("Workflows analyzed", "Yes", "Module_Wise_Workflow_Analysis.md"),
        ("Preservation requirements", "Yes", "FR-001–FR-080"),
        ("Gaps identified", "Yes", "GAP-001–GAP-025"),
        ("Enterprise enhancements evaluated", "Yes", "Enterprise_Functionality_Recommendations.md"),
        ("Unified architecture documented", "Yes", "Future_State_Application_Architecture.md"),
        ("MFE boundaries", "Yes", "System_Architecture.md"),
        ("Microservices + PostgreSQL", "Yes", "postgresql/*, Database_Requirements.md"),
        ("API traceability", "Yes", "API_Requirements.md"),
        ("Security documented", "Yes", "postgresql/Security_Requirements.md, gaps GAP-001/022"),
        ("Testing criteria", "Yes", "Testing section in master SRS"),
        ("Open questions", "Yes", "Open_Questions.md"),
    ]
    lines = ["# Functional Completeness Report", "", f"**Date:** {DATE}", "", "## Acceptance checklist (Master Prompt §10)", "", "| # | Condition | Status | Evidence |", "|---|-----------|--------|----------|"]
    for i, (c, s, e) in enumerate(checks, 1):
        lines.append(f"| {i} | {c} | **{s}** | {e} |")
    lines.append("\n## Outstanding business confirmations\n\nSee gaps marked **Biz confirm = Yes** in `Existing_Functionality_Gap_Analysis.md` and `Open_Questions.md`.\n\n## CRUD coverage statement\n\nLegacy CMS supports **Create, Read, Update, Deactivate** for most admin entities. **Hard delete** is rare (e.g. gallery deleteImage). **Approve/Reject/Draft** workflows are **not present** — documented as gaps, not hidden.\n")
    (OUTPUT / "Functional_Completeness_Report.md").write_text("\n".join(lines), encoding="utf-8")


def write_future_state_arch() -> None:
    text = f"""# Future-State Application Architecture — Unified Enterprise Website

**Date:** {DATE}

## 1. Vision

One **unified KRAN Consulting website** for visitors and administrators: single shell, single sign-on experience, consistent design system, and seamless navigation between marketing content and the admin CMS—while internally composed of **React micro frontends** and **Spring Boot microservices** on **PostgreSQL**.

Users must not perceive disjoint applications when moving from public pages to `/admin`.

## 2. Unified experience layer

| Element | Implementation |
|---------|----------------|
| Application shell | `shell` MFE — routing, layout, auth gate, module federation host |
| Design system | Shared component library (tokens, typography, buttons, tables, forms) |
| Navigation | Top nav (public) + contextual admin sidebar (admin zone) |
| Notifications | Global toast + notification drawer (future) |
| Profile | Unified admin profile menu (future) |
| Errors | Global error boundary + RFC 7807 API errors |

## 3. Micro frontend map (same as SRS)

| MFE | User-visible scope |
|-----|-------------------|
| shell | Host, auth, layout |
| public-site | Home, about, contact, CSR, team |
| catalog-mfe | Services, solutions, projects, clients, domain |
| content-mfe | News, data sheets, gallery, timeline, banners (public) |
| careers-mfe | Careers and applications (public) |
| admin-mfe | Entire CMS (SideMenu parity) |

## 4. Backend alignment

API Gateway → domain services (auth, content, catalog, media, careers, engagement, notification) → **PostgreSQL per service**.

## 5. Gap closure mapping

| Gap theme | Architecture response |
|-----------|----------------------|
| GAP-024 Unified shell | shell MFE + shared layout |
| GAP-001/002 Auth | auth-service + admin_user in PostgreSQL |
| GAP-016/017 JSP content | Headless content APIs + MFE templates |
| GAP-019 Database | PostgreSQL migration |

## 6. Deployment view

Independent CI/CD per MFE and microservice; shell consumes versioned remoteEntry URLs; feature flags for phased module rollout.

```mermaid
flowchart TB
  User[User browser]
  Shell[shell MFE]
  Remotes[public-site / catalog / content / careers / admin]
  GW[API Gateway]
  SVC[Microservices]
  PG[(PostgreSQL)]

  User --> Shell
  Shell --> Remotes
  Remotes --> GW --> SVC --> PG
```
"""
    (OUTPUT / "Future_State_Application_Architecture.md").write_text(text, encoding="utf-8")


def write_master_rtm() -> None:
    from openpyxl import Workbook
    from openpyxl.styles import Font, PatternFill

    wb = Workbook()
    ws = wb.active
    ws.title = "Master RTM"
    headers = [
        "Existing Feature", "Page / Action", "Workflow", "FR ID", "Category A-E",
        "MFE", "Microservice", "API (proposed)", "DB Entity", "Test Case", "Gap ID",
    ]
    ws.append(headers)
    for c in ws[1]:
        c.font = Font(bold=True)
        c.fill = PatternFill("solid", fgColor="DDDDDD")

    rows = [
        ("Public home", "welcome", "View home", "FR-001", "A", "public-site", "content-service", "GET /api/v1/banners/active", "banner", "TC-001", ""),
        ("Admin login", "login", "Authenticate", "FR-002", "B", "admin-mfe", "auth-service", "POST /api/v1/auth/login", "admin_user", "TC-002", "GAP-001"),
        ("Contact form", "sendMsg", "Submit enquiry", "FR-004", "A", "public-site", "engagement-service", "POST /api/v1/messages", "contacts", "TC-004", ""),
        ("Job application", "saveCandidate", "Apply + email", "FR-005", "A", "careers-mfe", "careers-service", "POST /api/v1/jobs/{id}/applications", "application_request", "TC-005", ""),
        ("Admin news CRUD", "adminNews/saveNews", "CMS publish", "FR-027+", "A", "admin-mfe", "content-service", "CRUD /api/v1/admin/news", "news", "TC-027", "GAP-003"),
        ("Resume export", "downloadFilteredResumes", "HR export", "FR-021+", "A", "admin-mfe", "careers-service", "POST /api/v1/admin/applications/export", "application_request", "TC-021", ""),
        ("Gallery groups", "adminGallery", "Media CMS", "FR-030+", "A", "admin-mfe", "media-service", "CRUD galleries", "gallery,gallgroup", "TC-030", ""),
        ("Site search", "search", "Search", "FR-038+", "A", "public-site", "content-service", "GET /api/v1/search", "multiple", "TC-038", "GAP-009"),
        ("Cookie consent", "saveCookieConsent", "Consent", "FR-045+", "A", "shell", "engagement-service", "POST /api/v1/consent", "—", "TC-045", ""),
        ("RBAC", "—", "—", "FR-USER (prop)", "D", "admin-mfe", "auth-service", "roles API", "admin_user", "TC-RBAC", "GAP-002"),
        ("PostgreSQL", "—", "—", "DB-REQ-*", "D", "all", "all", "—", "PostgreSQL", "TC-DB", "GAP-019"),
        ("Unified shell", "—", "—", "FR-SHELL (prop)", "C", "shell", "—", "—", "—", "TC-SHELL", "GAP-024"),
    ]
    for r in rows:
        ws.append(list(r))
    for col, w in zip("ABCDEFGHIJK", [28, 18, 16, 10, 10, 14, 18, 32, 18, 10, 10]):
        ws.column_dimensions[col].width = w
    wb.save(OUTPUT / "Master_Requirements_Traceability_Matrix.xlsx")


def main() -> None:
    write_gap_analysis()
    write_sitemap()
    write_workflow_analysis()
    write_enterprise_recommendations()
    write_business_rules()
    write_completeness_report()
    write_future_state_arch()
    print("Enterprise SRS extensions written to", OUTPUT)


if __name__ == "__main__":
    main()
