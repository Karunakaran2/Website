#!/usr/bin/env python3
"""
Generate all SRS deliverables for the KranConsulting website rebuild project.
Content is embedded from prior system analysis; no runtime codebase scan.
"""
from __future__ import annotations

import os
import re
import sys
from datetime import date
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

OUTPUT_DIR = Path(__file__).resolve().parent
PROJECT_NAME = "KranConsulting Website Rebuild"
DOC_VERSION = "1.0"
DOC_DATE = date.today().isoformat()

# --- Embedded analysis (existing system) ---
EXISTING_STACK = {
    "packaging": "Java 11 Maven WAR",
    "web_mvc": "Apache Struts 2.5.17",
    "spring": "Spring Framework 4.3.13",
    "orm": "Hibernate 4.3.11",
    "database": "MariaDB schema `kran_website`",
    "ui": "JSP, Bootstrap, jQuery, Apache Tiles",
    "framework": "kran-framework ES2-1.1",
    "security_filter": "ESAPI XSS filter",
    "email": "Microsoft Graph",
    "analytics": "Google Analytics G-9T4S2N58MP with cookie consent",
}

ENTRY = {
    "welcome_action": "welcome → yCIMVQ5RMbA.jsp",
    "welcome_file": "yCIMVQ5RMbA.html",
}

AUTH = {
    "model": "Single admin via LoginAction.login",
    "captcha": "CaptchaInner",
    "credentials": "Hardcoded in LoginAction.java; requires migration to secure credential store (password not documented).",
    "session_key": "userBean",
    "session_interceptor": "SessionExpiredAction",
    "session_timeout_minutes": 45,
}

SERVICE_VALS = [
    "consultancy",
    "software-development",
    "mobile-app-development",
    "project-product-implementation",
    "maintenance-support",
    "porting-migration",
]

SOLUTION_SLUGS = [
    "probity-financials",
    "audit-management-system",
    "sirius",
    "charitable-endowments-platform",
    "comprehensive-loan-management-system",
    "project-monitoring-information-system",
    "report-monitoring-information-system",
    "inspection-management-system",
    "phoenix",
    "centralized-welfare-management-system",
    "stage",
    "integrated-human-resource-management-system",
    "financial-accounting-system",
    "budget-expenditure-monitoring-system",
    "smartNet",
    "general-administration-management-system",
    "fund-benefits-management-system",
    "smart-office",
    "saarathi",
    "galaxy",
    "application-lifecycle-management-solution",
    "galaxy-med",
    "training-administration-management-solution",
    "e-metier",
    "online-platform-logistics-management",
    "order-payment-processing-solution",
    "advertisement-management-information-repository",
    "digital-platform-clinical-trials-registry",
    "vtcres",
    "pfms360",
    "hrms",
    "kranps",
    "kranss",
]

PUBLIC_STRUTS_ACTIONS = [
    "welcome", "aboutus", "contact", "sendMsg", "getService",
    "solutions (?val= slug)", "projects", "readProject", "projectDetail",
    "kranprojects", "allsolutions", "domain", "clients",
    "casestudy/casestudies", "readCase", "categorycase",
    "datasheets (public blog)", "blog", "readBlog",
    "news", "newsDetail", "viewNews",
    "gallery", "galleryAjax", "galleryView",
    "career", "overview", "jobApply", "saveCandidate", "submitCareerForm",
    "submitEnquiry", "submitKProjects", "submitKSolutions", "enquire",
    "search/result", "teammanagement", "krancsr", "krantech", "timeline",
    "viewBanner", "viewTestimonial",
    "cookie consent actions", "captcha", "comingsoon", "successMessage",
]

ADMIN_STRUTS_ACTIONS = [
    "dashboard", "sidemenu", "request", "solRequest",
    "adminCareer", "careerAdd", "saveJob", "editJob", "jobDeactivate", "NoVacancy",
    "jobApplications", "downloadDoc", "downloadDocu", "downloadFilteredResumes",
    "adminNews CRUD", "adminGallery groups/images",
    "adminKranProjects", "adminKranSolutions", "adminKranSeniors", "adminKranFaces",
    "adminKranTimeline CRUD", "getProjectProduct CRUD",
    "adminBanner", "adminBlogs (Data Sheets)", "adminCase",
    "mailSetup", "categorySetup", "solRequest",
]

DB_ENTITIES = [
    "contacts", "careers", "news", "application_request", "gallery", "gallgroup",
    "project_product", "banner", "blog", "comments", "mail_setup", "category",
    "submitted_resumes", "casestudy", "kran_faces", "kran_seniors", "kran_projects",
    "kran_solutions", "kran_timeline",
]

PROPOSED_SERVICES = [
    ("api-gateway", "Edge routing, rate limiting, JWT validation"),
    ("auth-service", "Admin authentication, session/token issuance"),
    ("content-service", "News, blog/data sheets, banners, timeline, static pages metadata"),
    ("catalog-service", "Solutions, services, project products, Kran projects/solutions"),
    ("media-service", "Gallery groups/images, file uploads"),
    ("careers-service", "Job postings, applications, resume storage"),
    ("engagement-service", "Contact/enquiry forms, comments, application requests"),
    ("admin-service", "Aggregated admin operations or BFF for admin UI"),
    ("notification-service", "Microsoft Graph email dispatch"),
]

PROPOSED_MFES = [
    ("shell", "Host app, routing, layout, Module Federation"),
    ("public-site", "Marketing pages, solutions, services, CSR, tech"),
    ("catalog-mfe", "Projects, case studies, clients, domain"),
    ("content-mfe", "News, blog/data sheets, gallery, timeline"),
    ("careers-mfe", "Careers listing and application"),
    ("admin-mfe", "Authenticated admin console"),
]

FR_FIELDS = [
    "Requirement ID", "Title", "Description", "Priority", "Stakeholder / Source",
    "Actor(s)", "Preconditions", "Trigger", "Main Flow", "Alternate / Exception Flows",
    "Data Requirements", "Existing Implementation (Struts 2)", "Proposed Implementation",
    "Acceptance Criteria",
]


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def bullet_list(items: List[str]) -> str:
    return "\n".join(f"- {i}" for i in items)


def generate_existing_system_analysis() -> str:
    return f"""# Existing System Analysis — KranConsulting Corporate Website

**Document status:** Generated from embedded reverse-engineering notes (not runtime analysis).  
**Scope:** As-is system supporting public marketing site and single-admin CMS.  
**Date:** {DOC_DATE}

## 1. Executive Summary

The KranConsulting website is a monolithic Java web application delivered as a Maven WAR. It combines Apache Struts 2 actions, Spring-managed services, Hibernate ORM, and JSP/Tiles views over a MariaDB database (`kran_website`). The site publishes company services, product/solution portfolios, case studies, news, blogs (labeled “Data Sheets” in admin), galleries, careers, and enquiry forms. A separate Struts package exposes authenticated admin CRUD for all dynamic content. Integrations include Microsoft Graph for outbound email, Google Analytics (property `G-9T4S2N58MP`) gated by cookie consent, and ESAPI-based XSS filtering.

The rebuild target replaces this stack with a React micro-frontend shell (Module Federation recommended) and Spring Boot microservices while preserving functional parity and remediating known security debt (hardcoded admin credentials).

## 2. Technology Stack (As-Is)

| Layer | Technology |
|-------|------------|
| Runtime | {EXISTING_STACK['packaging']} |
| Web framework | {EXISTING_STACK['web_mvc']} |
| DI / integration | {EXISTING_STACK['spring']} |
| Persistence | {EXISTING_STACK['orm']} |
| Database | {EXISTING_STACK['database']} |
| Presentation | {EXISTING_STACK['ui']} |
| Internal framework | {EXISTING_STACK['framework']} |
| Input sanitization | {EXISTING_STACK['security_filter']} |
| Email | {EXISTING_STACK['email']} |
| Analytics | {EXISTING_STACK['analytics']} |

## 3. Application Entry and Routing

- **Primary entry:** Struts `{ENTRY['welcome_action']}`.
- **Static welcome file:** `{ENTRY['welcome_file']}` (served when configured as welcome-file).
- **View composition:** Apache Tiles layouts wrap JSP fragments; Bootstrap and jQuery provide client behavior.

Public URLs map to Struts `.action` endpoints in the **login** package (naming reflects historical packaging, not unauthenticated-only scope). Admin URLs map to the **session** package and require an HTTP session carrying `userBean`.

## 4. Authentication and Session Model

| Aspect | Detail |
|--------|--------|
| Identity model | Single administrative operator |
| Login flow | `LoginAction.login` with `CaptchaInner` validation |
| Credential storage | {AUTH['credentials']} |
| Session attribute | `{AUTH['session_key']}` |
| Session guard | `{AUTH['session_interceptor']}` interceptor |
| Timeout | {AUTH['session_timeout_minutes']} minutes |

**Security finding (document only):** Administrative authentication relies on hardcoded credentials in source. Rebuild must externalize secrets (vault, environment, or identity provider) and eliminate password material from the repository.

## 5. Public Struts Actions (login package)

The following capabilities are exposed without admin session (some accept POST submissions):

{bullet_list(PUBLIC_STRUTS_ACTIONS)}

### 5.1 Services (`getService`)

Query parameter `val` selects one of:

{bullet_list(SERVICE_VALS)}

### 5.2 Solutions (`solutions`)

Query parameter `val` selects solution detail slugs rendered via `Solutions.jsp`, including:

{bullet_list(SOLUTION_SLUGS)}

Additional mobile variants and combined listing actions (`allsolutions`, `kranprojects`, etc.) exist as documented in Struts configuration.

## 6. Admin Struts Actions (session package)

Authenticated admin capabilities include:

{bullet_list(ADMIN_STRUTS_ACTIONS)}

Notable behaviors:

- **Careers:** Job CRUD, vacancy toggle (`NoVacancy`), application review, resume download (single and filtered bulk).
- **Content:** News, gallery (groups + images), banners, blogs/data sheets, case studies, categories.
- **Kran-specific catalogs:** Projects, solutions, senior leadership, faces, timeline entries.
- **Operational:** Contact/application requests, solution requests (`solRequest`), mail setup.

## 7. Page and Function Inventory

The table below maps observed modules to Struts actions, primary JSP views, roles, and rebuild priority. Static/marketing sections without dedicated Hibernate entities are noted as **content-in-JSP** (Requires Business Confirmation for CMS migration scope).

| Module | Page / Route (legacy) | Primary JSP / View | Functionality | User Role | Priority |
|--------|------------------------|-------------------|---------------|-----------|----------|
| Home | `welcome.action` | yCIMVQ5RMbA.jsp | Home, banners, testimonials | Public | High |
| About | `aboutus.action` | AboutUs.jsp | Company overview, anchors (quality, culture, awards, leadership, timeline, FAQ) | Public | High |
| Services | `getService?val=` | Service.jsp | Six service offering pages | Public | High |
| Solutions catalog | `allsolutions`, `solutions?val=` | AllSolutions.jsp, Solutions.jsp | Solution listing and ~30 product detail slugs | Public | High |
| Projects | `projects`, `readProject`, `projectDetail` | AllKranProjects.jsp, ReadProjects.jsp, ProjectDetail.jsp | Kran project portfolio | Public | High |
| Kran PS/SS | `kranps`, `kranss`, mobile variants | Kranps.jsp, KranSolutions.jsp, Mobile*.jsp | Legacy product/solution landing pages | Public | Medium |
| Domain | `domain.action` | Domain.jsp | Domain consulting | Public | Medium |
| Clients | `clients.action` | Clients-Kran.jsp | Client showcase | Public | Medium |
| Case studies | `casestudy`, `readCase`, `categorycase` | Case.jsp, CaseDetails.jsp, CategoryCase.jsp | Filterable case studies | Public | High |
| Data sheets | `datasheets`, `blog`, `readBlog` | DataSheets.jsp, Blog.jsp, BlogDetails.jsp | Blog entity; admin label "Data Sheets" | Public | High |
| News | `news`, `newsDetail`, `viewNews` | AllNews.jsp, NewsDetail.jsp, News.jsp | News and events | Public | High |
| Gallery | `gallery`, `galleryAjax`, `galleryView` | Gallery.jsp, GalleryAjax.jsp, GalleryView.jsp | Photo galleries by group | Public | Medium |
| Careers | `overview`, `career`, `jobApply` | CareerOverview.jsp, Career.jsp, JobApply.jsp | Jobs and applications | Public | High |
| Team | `teammanagement.action` | TeamManagement.jsp | Faces of KRAN / team | Public | Medium |
| CSR | `krancsr.action` | KranCsr.jsp | CSR initiatives | Public | Medium |
| Technologies | `krantech.action` | KranTechnologies.jsp | Technology stack showcase | Public | Low |
| Contact | `contact.action` | ContactUs.jsp | Contact form | Public | High |
| Enquiry | `enquire`, `submitEnquiry`, `submitKProjects`, `submitKSolutions` | Enquiry.jsp, ajax Result.jsp | Product/project/solution enquiries | Public | High |
| Search | `search`, `result` | SearchResult.jsp | Site search | Public | Medium |
| PFMS / HRMS | `pfms360`, `hrms` | Pfms.jsp, Hrms.jsp | Dedicated solution landing pages | Public | Medium |
| Admin login | `admin`, `login` | AdminLogin.jsp | Admin authentication | Admin | High |
| Admin dashboard | `dashboard.action` | Dashboard.jsp | Admin home | Admin | High |
| Admin enquiries | `request`, `solRequest` | Request.jsp, SolRequest.jsp | Review contact/solution requests | Admin | High |
| Admin careers | `adminCareer`, `jobApplications`, etc. | AdminCareer*.jsp, JobApplications.jsp | Job CRUD and applications | Admin | High |
| Admin content | `adminNews`, `adminBlogs`, `adminCase`, `adminBanner`, `adminGallery` | Admin*.jsp | CMS for news, data sheets, cases, banners, gallery | Admin | High |
| Admin Kran catalogs | `adminKranProjects`, `adminKranSolutions`, `adminKranSeniors`, `adminKranFaces`, `adminKranTimeline` | Admin*.jsp | Portfolio and people content | Admin | High |
| Admin config | `mailSetup`, `categorySetup`, `getProjectProduct` | MailSetup.jsp, CategorySetup.jsp, ProjectProduct.jsp | Mail routing, categories, legacy product catalog | Admin | Medium |
| System | `sessionexpired`, `error`, `PageNotFound` | sessionexpired.jsp, error.jsp | Error and session handling | All | High |

## 8. Data Model (Hibernate Entities)

Nineteen mapped entities align to MariaDB tables:

{bullet_list(DB_ENTITIES)}

Relationships are primarily foreign keys managed in Hibernate mappings and admin UI workflows (e.g., gallery images → `gallgroup`, blog comments → `blog`, resumes → `careers`).

## 9. Cross-Cutting Concerns

### 9.1 Email

Outbound messages (enquiries, career notifications, admin-triggered mail) use **Microsoft Graph** configuration stored in `mail_setup`.

### 9.2 Analytics and consent

Google Analytics tag `G-9T4S2N58MP` loads only after cookie consent actions record user preference.

### 9.3 Security controls

- ESAPI XSS filter sanitizes request data.
- CAPTCHA protects login and selected public forms.
- Session expiration redirects unauthenticated admin access.

### 9.4 Known limitations driving rebuild

- Monolithic deployment and coupled UI (JSP) hinder independent release of marketing vs admin features.
- Struts 2.5 / Spring 4 / Hibernate 4 stack is end-of-life relative to current support policies.
- Hardcoded admin credentials and single-user model limit operational security.
- No first-class REST API; mobile and future channels cannot consume content without HTML scraping.

## 10. Rebuild Implications

| Existing artifact | Rebuild direction |
|-------------------|-------------------|
| Struts `.action` URLs | Versioned REST APIs + SPA routes |
| JSP/Tiles | React MFEs with shared design system |
| Hibernate monolith | Service-owned schemas or shared DB with bounded contexts |
| Session `userBean` | JWT or server-side session via auth-service |
| `mail_setup` table | notification-service + secure config store |

## 11. Glossary

- **Data Sheets:** Admin label for `blog` entity content exposed publicly as datasheets/blog.
- **Kran catalog entities:** `kran_projects`, `kran_solutions`, `kran_faces`, `kran_seniors`, `kran_timeline` power differentiated site sections.
- **MFE:** Micro-frontend; independently deployable UI bundle integrated via Module Federation.
"""


def _fr_major(
    fr_id: str,
    title: str,
    description: str,
    priority: str,
    stakeholder: str,
    actors: str,
    pre: str,
    trigger: str,
    main: str,
    alt: str,
    data: str,
    existing: str,
    proposed: str,
    acceptance: str,
) -> Dict[str, str]:
    return {
        "Requirement ID": fr_id,
        "Title": title,
        "Description": description,
        "Priority": priority,
        "Stakeholder / Source": stakeholder,
        "Actor(s)": actors,
        "Preconditions": pre,
        "Trigger": trigger,
        "Main Flow": main,
        "Alternate / Exception Flows": alt,
        "Data Requirements": data,
        "Existing Implementation (Struts 2)": existing,
        "Proposed Implementation": proposed,
        "Acceptance Criteria": acceptance,
    }


def build_functional_requirements() -> Tuple[List[Dict[str, str]], str]:
    majors = [
        _fr_major(
            "FR-001", "Public home page",
            "Visitors shall view the corporate home page with banners and testimonials consistent with current welcome flow.",
            "Must", "Marketing / Existing welcome action",
            "Anonymous visitor",
            "Site is reachable; CDN/cache configured.",
            "User navigates to `/` or welcome route.",
            "System loads hero content, active banners, testimonials; records analytics only if consent granted.",
            "Missing banner data shows safe empty state; no server stack trace to client.",
            "banner, kran_timeline (optional teasers)",
            "`welcome`, `viewBanner`, `viewTestimonial` Struts actions; JSP `yCIMVQ5RMbA.jsp`.",
            "shell MFE route `/`; `GET /api/v1/banners/active`, `GET /api/v1/testimonials/active`; content-service.",
            "Lighthouse smoke pass; API p95 < 500ms for banner list; parity with legacy home sections.",
        ),
        _fr_major(
            "FR-002", "Admin login with CAPTCHA",
            "Administrative users shall authenticate with username, password, and CAPTCHA before accessing CMS.",
            "Must", "Security / LoginAction",
            "Admin user",
            "Auth service available; CAPTCHA endpoint reachable.",
            "Admin submits login form.",
            "Validate CAPTCHA, verify credentials from secure store, issue session/JWT, redirect to dashboard.",
            "Invalid CAPTCHA or credentials return generic error; account lockout policy TBD (see Open Questions).",
            "No passwords in logs; audit login success/failure.",
            "`LoginAction.login`, `CaptchaInner`, session key `userBean`.",
            "auth-service `POST /api/v1/auth/login`; CAPTCHA `GET /api/v1/auth/captcha`; admin-mfe login page.",
            "Pen test: no hardcoded credentials in repo; CAPTCHA required; session expires at 45 min idle.",
        ),
        _fr_major(
            "FR-003", "Session expiration for admin",
            "Expired or missing admin sessions shall be rejected from admin routes.",
            "Must", "SessionExpiredAction interceptor",
            "Admin user, System",
            "Admin was previously authenticated.",
            "Session idle exceeds 45 minutes or session invalidated.",
            "Interceptor/guard returns 401 or redirects to login; no partial admin data rendered.",
            "Concurrent session handling per Open Questions.",
            "Session TTL configurable.",
            "`SessionExpiredAction`, 45-minute HTTP session.",
            "API Gateway JWT expiry + refresh policy; auth-service session registry if server-side sessions.",
            "Automated test: expired token cannot call admin APIs; user prompted to re-login.",
        ),
        _fr_major(
            "FR-004", "Contact enquiry submission",
            "Visitors shall submit contact/enquiry forms that persist and trigger email notification.",
            "Must", "contact, sendMsg, submitEnquiry",
            "Anonymous visitor",
            "Form displayed; rate limits configured.",
            "User submits valid enquiry form.",
            "Validate input, persist contact/application_request, enqueue email via Graph.",
            "Validation errors inline; email failure retries and surfaces ops alert without losing record.",
            "contacts, application_request, mail_setup",
            "`contact`, `sendMsg`, `submitEnquiry`, `enquire` actions.",
            "engagement-service `POST /api/v1/enquiries`; notification-service email dispatch.",
            "E2E: record in DB + email sent in staging Graph tenant.",
        ),
        _fr_major(
            "FR-005", "Career job application",
            "Applicants shall view openings and submit applications with resume upload.",
            "Must", "career, jobApply, saveCandidate",
            "Job seeker",
            "Active job exists or NoVacancy disabled.",
            "User applies from job detail page.",
            "Validate fields, store submitted_resumes, attach file, notify recruiters.",
            "Oversized/disallowed file types rejected; vacancy closed shows message.",
            "careers, submitted_resumes",
            "`career`, `overview`, `jobApply`, `saveCandidate`, `submitCareerForm`.",
            "careers-service APIs; object storage for resumes; virus scan hook (proposed).",
            "Resume downloadable by admin; GDPR retention policy documented.",
        ),
        _fr_major(
            "FR-006", "News publishing (admin)",
            "Admin shall create, edit, publish, and retire news articles displayed on public site.",
            "Must", "adminNews CRUD",
            "Admin user",
            "Authenticated admin session.",
            "Admin saves news item.",
            "Persist news record with publish flag and timestamps; invalidate public cache.",
            "Delete/archival rules per content policy.",
            "news",
            "adminNews Struts CRUD in session package.",
            "content-service admin APIs; public `GET /api/v1/news`.",
            "Published news visible within 60s cache TTL; draft not public.",
        ),
        _fr_major(
            "FR-007", "Gallery management",
            "Admin shall manage gallery groups and images; public site displays galleries and AJAX views.",
            "Must", "adminGallery, gallery, galleryAjax",
            "Admin, Visitor",
            "Media storage available.",
            "Admin uploads image or visitor opens gallery page.",
            "CRUD on gallgroup/gallery; public read with pagination.",
            "Broken image URLs show placeholder.",
            "gallery, gallgroup",
            "`gallery`, `galleryAjax`, `galleryView`, admin gallery actions.",
            "media-service + content-service; `GET /api/v1/galleries`.",
            "Image upload max size enforced; EXIF stripped (proposed).",
        ),
        _fr_major(
            "FR-008", "Solution catalog by slug",
            "Visitors shall open solution detail pages for all legacy slugs under `solutions?val=`.",
            "Must", "Solutions.jsp slugs",
            "Anonymous visitor",
            "Catalog seeded with slug list.",
            "User selects solution from menu or deep link.",
            "Resolve slug to catalog entry; render rich content and related assets.",
            "Unknown slug returns 404 page.",
            "kran_solutions, project_product as applicable",
            "`solutions` action with `val` parameter; slugs in Solutions.jsp.",
            "catalog-service `GET /api/v1/solutions/{{slug}}`; catalog-mfe route `/solutions/:slug`.",
            "All documented slugs resolve; redirect map for renamed slugs if any.",
        ),
        _fr_major(
            "FR-009", "Service detail pages",
            "Visitors shall view six service offering pages via `getService` values.",
            "Must", "getService action",
            "Anonymous visitor",
            "Service definitions configured.",
            "User navigates to service URL.",
            "Map `val` to content template and metadata.",
            "Invalid `val` → 404.",
            "Static/content metadata",
            "`getService` with vals: {', '.join(SERVICE_VALS)}.",
            "public-site MFE; `GET /api/v1/services/{{slug}}`.",
            "Each of six slugs renders distinct content block.",
        ),
        _fr_major(
            "FR-010", "Cookie consent and analytics",
            "Site shall record cookie consent before loading Google Analytics `G-9T4S2N58MP`.",
            "Must", "Cookie consent actions + GA",
            "Anonymous visitor",
            "Consent banner configured.",
            "First visit or consent change.",
            "Persist preference; load GA script only if accepted.",
            "Withdraw consent disables tracking and clears cookies where possible.",
            "Consent audit log (proposed)",
            "Cookie consent Struts actions; GA tag in layout.",
            "shell MFE consent module; `POST /api/v1/consent`; no GA until opt-in.",
            "Automated check: network tab shows no GA before accept.",
        ),
        _fr_major(
            "FR-011", "Site search",
            "Users shall search public content and view results.",
            "Should", "search/result actions",
            "Anonymous visitor",
            "Search index populated.",
            "User submits search query.",
            "Query index across news, blog, solutions, projects; paginate results.",
            "Empty results page with suggestions.",
            "Indexed entities: news, blog, casestudy, kran_projects, kran_solutions",
            "`search`, `result` Struts actions.",
            "content-service + catalog-service search API or dedicated search index.",
            "Search returns relevant hits for sample queries documented in test cases.",
        ),
        _fr_major(
            "FR-012", "Admin resume export",
            "Admin shall download individual and filtered bulk resumes.",
            "Must", "downloadDoc, downloadFilteredResumes",
            "Admin user",
            "Authenticated; applications exist.",
            "Admin clicks download.",
            "Authorize admin; stream file(s) with audit log.",
            "Missing file returns 404 without path disclosure.",
            "submitted_resumes binary storage",
            "`downloadDoc`, `downloadDocu`, `downloadFilteredResumes`.",
            "careers-service `GET /api/v1/admin/applications/{{id}}/resume` and bulk export job.",
            "Download matches uploaded file hash; bulk export completes async for large sets.",
        ),
    ]

    compact_specs: List[Tuple[str, str, str, str, str]] = [
        ("FR-013", "About Us page", "aboutus", "public-site", "GET /api/v1/pages/about"),
        ("FR-014", "Contact page display", "contact", "public-site", "GET /api/v1/pages/contact"),
        ("FR-015", "Send message from contact", "sendMsg", "engagement-service", "POST /api/v1/messages"),
        ("FR-016", "Projects listing", "projects, kranprojects", "catalog-mfe", "GET /api/v1/projects"),
        ("FR-017", "Project detail", "readProject, projectDetail", "catalog-mfe", "GET /api/v1/projects/{id}"),
        ("FR-018", "All solutions listing", "allsolutions", "catalog-mfe", "GET /api/v1/solutions"),
        ("FR-019", "Domain expertise page", "domain", "public-site", "GET /api/v1/pages/domain"),
        ("FR-020", "Clients showcase", "clients", "catalog-mfe", "GET /api/v1/clients"),
        ("FR-021", "Case studies list", "casestudies", "catalog-mfe", "GET /api/v1/case-studies"),
        ("FR-022", "Case study detail", "readCase", "catalog-mfe", "GET /api/v1/case-studies/{id}"),
        ("FR-023", "Case study by category", "categorycase", "catalog-mfe", "GET /api/v1/case-studies?category="),
        ("FR-024", "Data sheets public list", "datasheets/blog", "content-mfe", "GET /api/v1/data-sheets"),
        ("FR-025", "Blog list", "blog", "content-mfe", "GET /api/v1/blogs"),
        ("FR-026", "Blog detail", "readBlog", "content-mfe", "GET /api/v1/blogs/{id}"),
        ("FR-027", "News list", "news, viewNews", "content-mfe", "GET /api/v1/news"),
        ("FR-028", "News detail", "newsDetail", "content-mfe", "GET /api/v1/news/{id}"),
        ("FR-029", "Gallery view page", "galleryView", "content-mfe", "GET /api/v1/galleries/{id}"),
        ("FR-030", "Careers listing", "career", "careers-mfe", "GET /api/v1/jobs"),
        ("FR-031", "Career overview", "overview", "careers-mfe", "GET /api/v1/pages/careers-overview"),
        ("FR-032", "Submit K Projects form", "submitKProjects", "engagement-service", "POST /api/v1/forms/k-projects"),
        ("FR-033", "Submit K Solutions form", "submitKSolutions", "engagement-service", "POST /api/v1/forms/k-solutions"),
        ("FR-034", "Team management page", "teammanagement", "public-site", "GET /api/v1/team"),
        ("FR-035", "Kran CSR section", "krancsr", "public-site", "GET /api/v1/pages/csr"),
        ("FR-036", "Kran Tech section", "krantech", "public-site", "GET /api/v1/pages/tech"),
        ("FR-037", "Timeline display", "timeline", "content-mfe", "GET /api/v1/timeline"),
        ("FR-038", "Banner rotation public", "viewBanner", "content-service", "GET /api/v1/banners/active"),
        ("FR-039", "Testimonials public", "viewTestimonial", "content-service", "GET /api/v1/testimonials"),
        ("FR-040", "CAPTCHA image for forms", "captcha", "auth-service", "GET /api/v1/auth/captcha"),
        ("FR-041", "Coming soon placeholder", "comingsoon", "public-site", "Static route /coming-soon"),
        ("FR-042", "Success message page", "successMessage", "public-site", "Route /success"),
        ("FR-043", "Admin dashboard", "dashboard", "admin-mfe", "GET /api/v1/admin/dashboard"),
        ("FR-044", "Admin side menu", "sidemenu", "admin-mfe", "Client-side layout"),
        ("FR-045", "View contact requests", "request", "admin-mfe", "GET /api/v1/admin/requests"),
        ("FR-046", "Solution requests admin", "solRequest", "admin-mfe", "GET /api/v1/admin/solution-requests"),
        ("FR-047", "Admin careers list", "adminCareer", "careers-service", "GET /api/v1/admin/jobs"),
        ("FR-048", "Add career form", "careerAdd", "careers-service", "GET /api/v1/admin/jobs/new"),
        ("FR-049", "Save job posting", "saveJob", "careers-service", "POST /api/v1/admin/jobs"),
        ("FR-050", "Edit job posting", "editJob", "careers-service", "PUT /api/v1/admin/jobs/{id}"),
        ("FR-051", "Deactivate job", "jobDeactivate", "careers-service", "PATCH /api/v1/admin/jobs/{id}/deactivate"),
        ("FR-052", "No vacancy mode", "NoVacancy", "careers-service", "PUT /api/v1/admin/jobs/no-vacancy"),
        ("FR-053", "Job applications list", "jobApplications", "careers-service", "GET /api/v1/admin/applications"),
        ("FR-054", "Admin news create", "adminNews create", "content-service", "POST /api/v1/admin/news"),
        ("FR-055", "Admin news update", "adminNews update", "content-service", "PUT /api/v1/admin/news/{id}"),
        ("FR-056", "Admin news delete", "adminNews delete", "content-service", "DELETE /api/v1/admin/news/{id}"),
        ("FR-057", "Admin gallery group CRUD", "adminGallery groups", "media-service", "CRUD /api/v1/admin/gallery-groups"),
        ("FR-058", "Admin gallery image CRUD", "adminGallery images", "media-service", "CRUD /api/v1/admin/gallery-images"),
        ("FR-059", "Admin Kran projects CRUD", "adminKranProjects", "catalog-service", "CRUD /api/v1/admin/kran-projects"),
        ("FR-060", "Admin Kran solutions CRUD", "adminKranSolutions", "catalog-service", "CRUD /api/v1/admin/kran-solutions"),
        ("FR-061", "Admin Kran seniors CRUD", "adminKranSeniors", "catalog-service", "CRUD /api/v1/admin/kran-seniors"),
        ("FR-062", "Admin Kran faces CRUD", "adminKranFaces", "catalog-service", "CRUD /api/v1/admin/kran-faces"),
        ("FR-063", "Admin timeline CRUD", "adminKranTimeline", "content-service", "CRUD /api/v1/admin/timeline"),
        ("FR-064", "Project product CRUD", "getProjectProduct", "catalog-service", "CRUD /api/v1/admin/project-products"),
        ("FR-065", "Banner admin CRUD", "adminBanner", "content-service", "CRUD /api/v1/admin/banners"),
        ("FR-066", "Data sheets admin (blogs)", "adminBlogs", "content-service", "CRUD /api/v1/admin/data-sheets"),
        ("FR-067", "Case study admin", "adminCase", "catalog-service", "CRUD /api/v1/admin/case-studies"),
        ("FR-068", "Mail setup configuration", "mailSetup", "notification-service", "PUT /api/v1/admin/mail-setup"),
        ("FR-069", "Category setup", "categorySetup", "catalog-service", "CRUD /api/v1/admin/categories"),
        ("FR-070", "Comments moderation", "comments entity", "engagement-service", "GET/DELETE /api/v1/admin/comments"),
        ("FR-071", "ESAPI-equivalent input validation", "ESAPI XSS filter", "api-gateway", "WAF + validation middleware"),
        ("FR-072", "Microsoft Graph email send", "mail_setup + Graph", "notification-service", "POST /api/v1/notifications/email"),
        ("FR-073", "Multi-language readiness", "Not in legacy", "shell MFE", "i18n resource bundles (future)"),
        ("FR-074", "Accessibility WCAG 2.1 AA", "Rebuild goal", "all MFEs", "axe-core CI gate"),
        ("FR-075", "Audit admin mutations", "Operational", "admin-service", "Append-only audit log"),
        ("FR-076", "Rate limit public forms", "Anti-abuse", "api-gateway", "Per-IP rate limits on POST forms"),
        ("FR-077", "Health checks for deploy", "Ops", "each microservice", "GET /actuator/health"),
        ("FR-078", "Structured logging correlation", "Ops", "all services", "Trace ID in logs"),
        ("FR-079", "Backup/restore MariaDB", "Ops", "DBA runbook", "Nightly backup of kran_website"),
        ("FR-080", "Migration cutover plan", "Program", "Release mgmt", "Dual-run or big-bang documented"),
    ]

    all_frs: List[Dict[str, str]] = list(majors)
    for fr_id, title, existing, module, api in compact_specs:
        all_frs.append(
            _fr_major(
                fr_id, title,
                f"The system shall support «{title}» with functional parity to the legacy Struts feature.",
                "Must" if int(fr_id.split("-")[1]) <= 70 else "Should",
                "Legacy Struts action mapping",
                "Visitor or Admin as applicable",
                "Dependent services available.",
                f"User invokes feature equivalent to `{existing}`.",
                "Execute read or write operation; return UI or API response.",
                "Standard HTTP error handling; validation errors for writes.",
                "See entity mapping in Database_Requirements.md",
                f"Struts actions: {existing}.",
                f"Module: {module}; API: {api}.",
                "Automated regression test TC-{0} passes.".format(fr_id.split("-")[1]),
            )
        )

    lines = [
        "# Functional Requirements — KranConsulting Rebuild",
        "",
        f"**Version:** {DOC_VERSION} | **Date:** {DOC_DATE}",
        "",
        "## 1. Introduction",
        "",
        "Requirements below distinguish **Existing Implementation (Struts 2)** from **Proposed Implementation** "
        "(React MFEs + Spring Boot microservices). IDs use prefix `FR-`.",
        "",
        "## 2. Requirement template (14 fields)",
        "",
        bullet_list(FR_FIELDS),
        "",
        "## 3. Detailed requirements (major features)",
        "",
    ]

    for fr in majors:
        lines.append(f"### {fr['Requirement ID']}: {fr['Title']}")
        lines.append("")
        for field in FR_FIELDS:
            if field == "Requirement ID":
                continue
            lines.append(f"- **{field}:** {fr[field]}")
        lines.append("")

    lines.extend([
        "## 4. Additional functional requirements (compact 14-field)",
        "",
        "The following requirements use the same 14-field structure with concise flows.",
        "",
    ])

    for fr in all_frs[len(majors):]:
        lines.append(f"### {fr['Requirement ID']}: {fr['Title']}")
        lines.append("")
        for field in FR_FIELDS:
            if field == "Requirement ID":
                continue
            lines.append(f"- **{field}:** {fr[field]}")
        lines.append("")

    lines.append(f"## 5. Traceability note\n\nSee `Requirements_Traceability_Matrix.xlsx` for FR → module → API → service → test case mapping.\n")
    lines.append(f"**Total functional requirements:** {len(all_frs)}\n")

    return all_frs, "\n".join(lines)


def generate_system_architecture() -> str:
    mfe_table = "\n".join(f"| {n} | {d} |" for n, d in PROPOSED_MFES)
    svc_table = "\n".join(f"| {n} | {d} |" for n, d in PROPOSED_SERVICES)
    return f"""# System Architecture — Proposed Target State

**Status:** Proposed (rebuild) — not present in existing WAR.  
**Date:** {DOC_DATE}

## 1. Architecture overview

The rebuild adopts a **micro-frontend (MFE)** presentation tier and **Spring Boot microservices** backend, replacing the monolithic Struts/Spring/Hibernate WAR. **PostgreSQL** is the mandatory target RDBMS (database-per-microservice in production). Legacy **MariaDB** `kran_website` is the migration source only — see `Database_Requirements.md` and `postgresql/`.

```mermaid
flowchart TB
  subgraph Client
    Browser[Web Browser]
  end
  subgraph MFE_Layer[React Micro Frontends]
    Shell[shell - Module Federation Host]
    Pub[public-site]
    Cat[catalog-mfe]
    Cont[content-mfe]
    Car[careers-mfe]
    Adm[admin-mfe]
  end
  subgraph Edge
    GW[api-gateway]
  end
  subgraph Services[Spring Boot Microservices]
    Auth[auth-service]
    Content[content-service]
    Catalog[catalog-service]
    Media[media-service]
    Careers[careers-service]
    Eng[engagement-service]
    Notif[notification-service]
  end
  DB[(PostgreSQL per service)]
  Graph[Microsoft Graph]
  GA[Google Analytics]

  Browser --> Shell
  Shell --> Pub & Cat & Cont & Car & Adm
  Pub & Cat & Cont & Car & Adm --> GW
  GW --> Auth & Content & Catalog & Media & Careers & Eng & Notif
  Content & Catalog & Media & Careers & Eng --> DB
  Notif --> Graph
  Shell -. consent .-> GA
```

## 2. Micro-frontends (Module Federation recommended)

| MFE | Responsibility |
|-----|----------------|
{mfe_table}

**Integration pattern:** Webpack Module Federation (or equivalent) exposes remote modules loaded by `shell`. Shared component library (design tokens, header/footer, cookie consent) ships as a shared package to avoid duplication.

**Routing:** Shell owns top-level routes (`/`, `/solutions/:slug`, `/admin/*`). Legacy Struts `.action` URLs redirect via gateway rules during migration.

## 3. Backend microservices

| Service | Responsibility |
|---------|----------------|
{svc_table}

**Communication:** Synchronous REST for reads; async messaging (optional) for email and bulk exports. No invented services beyond this list for v1 parity.

## 4. Comparison to existing stack

| Concern | Existing (As-Is) | Proposed (To-Be) |
|---------|------------------|------------------|
| UI | JSP + Tiles + jQuery | React MFEs |
| API | Struts `.action` | REST `/api/v1/*` |
| Auth | HTTP session `userBean` | JWT / server session via auth-service |
| Deployment | Single WAR | Independent service + MFE pipelines |
| Database | MariaDB monolith `kran_website` | PostgreSQL per microservice (Flyway, HikariCP) |
| ORM | Hibernate 4 monolith | Spring Data JPA / Hibernate 6 per service |
| XSS | ESAPI filter | Gateway + framework validators |

## 5. Security architecture

- Externalize admin credentials (remediation of `LoginAction.java` hardcoding).
- CAPTCHA on login and sensitive public POST endpoints.
- OWASP ASVS L2 targets for auth and input validation.
- Secrets for Microsoft Graph in vault, not `mail_setup` plaintext fields where avoidable.

## 6. Observability

- Centralized logging with correlation IDs propagated from gateway.
- Metrics: request rate, error rate, latency per service.
- Health: Spring Boot Actuator endpoints behind gateway allow-list.

## 7. Deployment view

```mermaid
flowchart LR
  CI[CI/CD Pipeline] --> MFE_Build[MFE artifacts to CDN]
  CI --> SVC_Build[Container images]
  SVC_Build --> K8s[Kubernetes or VM scale sets]
  MFE_Build --> CDN[CDN / static host]
  K8s --> PG[(PostgreSQL cluster)]
```

## 8. Migration strategy (high level)

1. Strangle legacy: expose read APIs over existing tables.
2. Stand up MFE shell with public read-only routes.
3. Move admin CRUD to admin-mfe + APIs.
4. Decommission Struts actions per route group with redirect map.
"""


def build_api_catalog() -> Tuple[List[Dict[str, str]], str]:
    apis: List[Dict[str, str]] = []

    def add(method: str, path: str, desc: str, legacy: str, service: str, auth: str = "Public"):
        apis.append({
            "method": method,
            "path": path,
            "description": desc,
            "legacy_struts": legacy,
            "service": service,
            "auth": auth,
        })

    # Auth
    add("POST", "/api/v1/auth/login", "Admin login with CAPTCHA", "LoginAction.login", "auth-service", "Public")
    add("POST", "/api/v1/auth/logout", "Invalidate session/token", "session invalidate", "auth-service", "Admin")
    add("GET", "/api/v1/auth/captcha", "Generate CAPTCHA challenge", "captcha / CaptchaInner", "auth-service", "Public")
    add("GET", "/api/v1/auth/me", "Current admin profile", "userBean session", "auth-service", "Admin")

    # Public content
    add("GET", "/api/v1/banners/active", "Active banners", "viewBanner", "content-service")
    add("GET", "/api/v1/testimonials", "Testimonials list", "viewTestimonial", "content-service")
    add("GET", "/api/v1/news", "Paginated news", "news, viewNews", "content-service")
    add("GET", "/api/v1/news/{id}", "News detail", "newsDetail", "content-service")
    add("GET", "/api/v1/blogs", "Blog list", "blog", "content-service")
    add("GET", "/api/v1/blogs/{id}", "Blog detail", "readBlog", "content-service")
    add("GET", "/api/v1/data-sheets", "Data sheets (blog alias)", "datasheets", "content-service")
    add("GET", "/api/v1/timeline", "Company timeline", "timeline", "content-service")
    add("GET", "/api/v1/galleries", "Gallery groups", "gallery", "media-service")
    add("GET", "/api/v1/galleries/{id}", "Gallery detail", "galleryView", "media-service")
    add("GET", "/api/v1/galleries/{id}/images", "Gallery images AJAX", "galleryAjax", "media-service")

    # Catalog
    add("GET", "/api/v1/solutions", "All solutions", "allsolutions", "catalog-service")
    for slug in SOLUTION_SLUGS[:10]:
        add("GET", f"/api/v1/solutions/{slug}", f"Solution detail {slug}", f"solutions?val={slug}", "catalog-service")
    add("GET", "/api/v1/solutions/{slug}", "Solution detail by slug", "solutions?val=", "catalog-service")
    add("GET", "/api/v1/services", "Service offerings list", "getService", "catalog-service")
    for s in SERVICE_VALS:
        add("GET", f"/api/v1/services/{s}", f"Service detail {s}", f"getService val={s}", "catalog-service")
    add("GET", "/api/v1/projects", "Projects listing", "projects, kranprojects", "catalog-service")
    add("GET", "/api/v1/projects/{id}", "Project detail", "readProject, projectDetail", "catalog-service")
    add("GET", "/api/v1/case-studies", "Case studies", "casestudies", "catalog-service")
    add("GET", "/api/v1/case-studies/{id}", "Case study detail", "readCase", "catalog-service")
    add("GET", "/api/v1/clients", "Clients", "clients", "catalog-service")

    # Static pages
    for page, legacy in [
        ("about", "aboutus"), ("contact", "contact"), ("domain", "domain"),
        ("csr", "krancsr"), ("tech", "krantech"), ("team", "teammanagement"),
        ("careers-overview", "overview"),
    ]:
        add("GET", f"/api/v1/pages/{page}", f"Page content {page}", legacy, "content-service")

    # Engagement
    add("POST", "/api/v1/enquiries", "Contact/enquiry submit", "submitEnquiry, enquire, contact", "engagement-service")
    add("POST", "/api/v1/messages", "Send message", "sendMsg", "engagement-service")
    add("POST", "/api/v1/forms/k-projects", "K Projects form", "submitKProjects", "engagement-service")
    add("POST", "/api/v1/forms/k-solutions", "K Solutions form", "submitKSolutions", "engagement-service")
    add("POST", "/api/v1/consent", "Cookie consent", "cookie consent actions", "engagement-service")
    add("GET", "/api/v1/search", "Site search", "search/result", "content-service")

    # Careers public
    add("GET", "/api/v1/jobs", "Open jobs", "career", "careers-service")
    add("GET", "/api/v1/jobs/{id}", "Job detail", "jobApply", "careers-service")
    add("POST", "/api/v1/jobs/{id}/applications", "Submit application", "saveCandidate, submitCareerForm", "careers-service")

    # Admin
    add("GET", "/api/v1/admin/dashboard", "Dashboard metrics", "dashboard", "admin-service", "Admin")
    add("GET", "/api/v1/admin/requests", "Contact requests", "request", "engagement-service", "Admin")
    add("GET", "/api/v1/admin/solution-requests", "Solution requests", "solRequest", "engagement-service", "Admin")
    add("GET", "/api/v1/admin/jobs", "Jobs admin list", "adminCareer", "careers-service", "Admin")
    add("POST", "/api/v1/admin/jobs", "Create job", "saveJob, careerAdd", "careers-service", "Admin")
    add("PUT", "/api/v1/admin/jobs/{id}", "Update job", "editJob", "careers-service", "Admin")
    add("PATCH", "/api/v1/admin/jobs/{id}/deactivate", "Deactivate job", "jobDeactivate", "careers-service", "Admin")
    add("PUT", "/api/v1/admin/jobs/no-vacancy", "Global no vacancy", "NoVacancy", "careers-service", "Admin")
    add("GET", "/api/v1/admin/applications", "Applications list", "jobApplications", "careers-service", "Admin")
    add("GET", "/api/v1/admin/applications/{id}/resume", "Download resume", "downloadDoc", "careers-service", "Admin")
    add("POST", "/api/v1/admin/applications/export", "Bulk resume export", "downloadFilteredResumes", "careers-service", "Admin")
    add("POST", "/api/v1/admin/news", "Create news", "adminNews", "content-service", "Admin")
    add("PUT", "/api/v1/admin/news/{id}", "Update news", "adminNews", "content-service", "Admin")
    add("DELETE", "/api/v1/admin/news/{id}", "Delete news", "adminNews", "content-service", "Admin")
    add("CRUD", "/api/v1/admin/gallery-groups", "Gallery groups", "adminGallery groups", "media-service", "Admin")
    add("CRUD", "/api/v1/admin/gallery-images", "Gallery images", "adminGallery images", "media-service", "Admin")
    add("CRUD", "/api/v1/admin/kran-projects", "Kran projects", "adminKranProjects", "catalog-service", "Admin")
    add("CRUD", "/api/v1/admin/kran-solutions", "Kran solutions", "adminKranSolutions", "catalog-service", "Admin")
    add("CRUD", "/api/v1/admin/kran-seniors", "Kran seniors", "adminKranSeniors", "catalog-service", "Admin")
    add("CRUD", "/api/v1/admin/kran-faces", "Kran faces", "adminKranFaces", "catalog-service", "Admin")
    add("CRUD", "/api/v1/admin/timeline", "Timeline entries", "adminKranTimeline", "content-service", "Admin")
    add("CRUD", "/api/v1/admin/project-products", "Project products", "getProjectProduct", "catalog-service", "Admin")
    add("CRUD", "/api/v1/admin/banners", "Banners", "adminBanner", "content-service", "Admin")
    add("CRUD", "/api/v1/admin/data-sheets", "Data sheets/blogs", "adminBlogs", "content-service", "Admin")
    add("CRUD", "/api/v1/admin/case-studies", "Case studies", "adminCase", "catalog-service", "Admin")
    add("CRUD", "/api/v1/admin/categories", "Categories", "categorySetup", "catalog-service", "Admin")
    add("PUT", "/api/v1/admin/mail-setup", "Mail/Graph settings", "mailSetup", "notification-service", "Admin")
    add("POST", "/api/v1/notifications/email", "Send email via Graph", "mail integration", "notification-service", "Admin")
    add("GET", "/api/v1/admin/comments", "List comments", "comments", "engagement-service", "Admin")
    add("DELETE", "/api/v1/admin/comments/{id}", "Delete comment", "comments", "engagement-service", "Admin")

    # Deduplicate by method+path keeping first
    seen = set()
    unique: List[Dict[str, str]] = []
    for a in apis:
        key = (a["method"], a["path"])
        if key in seen:
            continue
        seen.add(key)
        unique.append(a)
    apis = unique

    lines = [
        "# API Requirements — Proposed REST (vs Legacy Struts)",
        "",
        f"**Date:** {DOC_DATE}",
        "",
        "## 1. Principles",
        "",
        "- REST JSON over HTTPS; OpenAPI 3 document per service.",
        "- Legacy Struts endpoints use `.action` suffix and mixed GET/POST; proposed APIs use nouns and HTTP verbs.",
        "- Public read endpoints cached at CDN/gateway where safe.",
        "",
        "## 2. API catalog",
        "",
        "| Method | Path | Auth | Service | Legacy Struts | Description |",
        "|--------|------|------|---------|---------------|-------------|",
    ]
    for a in apis:
        lines.append(
            f"| {a['method']} | `{a['path']}` | {a['auth']} | {a['service']} | {a['legacy_struts']} | {a['description']} |"
        )
    lines.append("")
    lines.append(f"**Total proposed API operations/rows:** {len(apis)}")
    lines.append("")
    lines.append("## 3. Non-functional API requirements")
    lines.append("")
    lines.append("- **NFR-API-001:** All admin routes require valid bearer token or session cookie issued by auth-service.")
    lines.append("- **NFR-API-002:** Error model: RFC 7807 problem+json.")
    lines.append("- **NFR-API-003:** Pagination: `page`, `size`, `sort` query parameters on list endpoints.")
    lines.append("- **NFR-API-004:** Idempotency-Key header on enquiry/application POST endpoints.")
    lines.append("")

    return apis, "\n".join(lines)


PG_ARCH_APPENDIX_MARKER = "## Appendix: PostgreSQL architecture (full)"


def load_database_requirements() -> str:
    """Source of truth: Database_Requirements.md (PostgreSQL mandatory)."""
    db_path = OUTPUT_DIR / "Database_Requirements.md"
    if db_path.exists():
        return db_path.read_text(encoding="utf-8")
    return f"# Database Requirements\n\n**Mandatory:** PostgreSQL. See postgresql/ folder.\n**Date:** {DOC_DATE}\n"


def _strip_pg_arch_appendix(body: str) -> str:
    """Remove embedded PostgreSQL architecture appendix (avoid duplicate chapters in SRS)."""
    idx = body.find(PG_ARCH_APPENDIX_MARKER)
    if idx >= 0:
        body = body[:idx]
    return body.rstrip() + "\n"


def _demote_markdown_headings(text: str) -> str:
    """Demote ATX headings one level so appendix stays under Database Requirements."""
    def repl(match: re.Match[str]) -> str:
        level = len(match.group(1))
        if level >= 6:
            return match.group(0)
        return "#" * (level + 1) + match.group(2)

    return re.sub(r"^(#{1,5})(\s.+)$", repl, text, flags=re.MULTILINE)


def load_database_base() -> str:
    """Database requirements index only (no full architecture appendix)."""
    return _strip_pg_arch_appendix(load_database_requirements())


def database_section_for_master() -> str:
    """Master SRS: index doc + full PostgreSQL architecture appendix (once)."""
    body = load_database_base()
    pg_arch = OUTPUT_DIR / "postgresql" / "PostgreSQL_Database_Architecture.md"
    if pg_arch.exists():
        arch = pg_arch.read_text(encoding="utf-8")
        arch = re.sub(r"^# [^\n]+\n+", "", arch, count=1)
        arch = _demote_markdown_headings(arch.strip())
        body += f"\n\n---\n\n{PG_ARCH_APPENDIX_MARKER}\n\n"
        body += f"## PostgreSQL Database Architecture — KranConsulting Rebuild\n\n{arch}\n"
    return body


def generate_business_workflows() -> str:
    return f"""# Business Workflows

**Date:** {DOC_DATE}

## 1. Admin authentication (existing vs proposed)

```mermaid
sequenceDiagram
  participant U as Admin User
  participant UI as Admin UI (JSP / admin-mfe)
  participant CAP as CAPTCHA
  participant AUTH as LoginAction / auth-service
  participant SES as HTTP Session / JWT

  U->>UI: Open admin login
  UI->>CAP: Request CAPTCHA
  CAP-->>UI: CAPTCHA image/token
  U->>UI: Submit credentials + CAPTCHA
  UI->>AUTH: login
  alt Valid CAPTCHA and credentials
    AUTH->>SES: Create userBean / issue token
    AUTH-->>UI: Redirect dashboard
  else Invalid
    AUTH-->>UI: Error message
  end
  Note over AUTH: Legacy: hardcoded credentials in LoginAction.java
  Note over AUTH: Proposed: secure credential store only
```

## 2. Public enquiry submission

```mermaid
flowchart TD
  A[Visitor opens Contact] --> B[Fill form]
  B --> C{{Validation OK?}}
  C -->|No| B
  C -->|Yes| D[Persist contacts / application_request]
  D --> E[notification-service sends Graph email]
  E --> F[Success message page]
  E -->|Failure| G[Queue retry + show success with ops alert]
```

## 3. Job application

```mermaid
flowchart TD
  J[Visitor views career listing] --> K[Select job / jobApply]
  K --> L{{Vacancy open?}}
  L -->|No| M[NoVacancy message]
  L -->|Yes| N[Upload resume + details]
  N --> O{{File valid?}}
  O -->|No| N
  O -->|Yes| P[Save submitted_resumes]
  P --> Q[Email notification]
  Q --> R[successMessage]
```

## 4. Admin CRUD (generic content)

```mermaid
stateDiagram-v2
  [*] --> List: admin opens module
  List --> Edit: select item
  List --> Create: add new
  Edit --> Saved: saveJob / save news / etc.
  Create --> Saved
  Saved --> List: redirect
  Edit --> Deactivated: jobDeactivate / unpublish
  Deactivated --> List
  note right of Saved: SessionExpiredAction blocks if session idle > 45 min
```

## 5. Cookie consent and analytics

```mermaid
flowchart LR
  V[First page load] --> B[Show consent banner]
  B --> A{{Accept?}}
  A -->|Yes| G[Load GA G-9T4S2N58MP]
  A -->|No| N[Functional cookies only]
  G --> P[Persist consent]
  N --> P
```
"""


def generate_open_questions() -> str:
    return f"""# Open Questions

**Date:** {DOC_DATE}

| ID | Topic | Question | Impact |
|----|-------|----------|--------|
| OQ-001 | Identity | Will admin remain single-user or integrate Azure AD / SSO? | auth-service design |
| OQ-002 | Credentials | Target secret store (Azure Key Vault, HashiCorp Vault, env-only)? | deployment |
| OQ-003 | URL migration | Permanent 301 map for every `.action` URL? | SEO, gateway rules |
| OQ-004 | Resume storage | Keep BLOB in MariaDB vs S3-compatible object store? | careers-service |
| OQ-005 | Search | MariaDB FULLTEXT vs Elasticsearch/OpenSearch? | content-service |
| OQ-006 | Mobile variants | Separate mobile solution slugs — deprecate or responsive only? | catalog-mfe |
| OQ-007 | Comments | Public comment submission on blogs — retain? | engagement-service |
| OQ-008 | Mail setup | Which mail_setup fields may remain in DB vs vault? | notification-service |
| OQ-009 | Session vs JWT | Pure JWT or server-side session cluster? | gateway auth |
| OQ-010 | Cutover | Big-bang vs phased strangler per route group? | release plan |
| OQ-011 | Data Sheets | Public URL naming: `/blog` vs `/data-sheets` canonical? | routing |
| OQ-012 | CAPTCHA | reCAPTCHA vs retained CaptchaInner equivalent? | auth-service |
| OQ-013 | HR retention | Resume retention period and right-to-erasure process? | compliance |
| OQ-014 | kran-framework | Reuse ES2-1.1 utilities in services or reimplement? | shared libraries |
| OQ-015 | Analytics | Additional tags (LinkedIn, Meta) beyond GA? | consent banner |
"""


def generate_supplementary_srs_sections() -> Dict[str, str]:
    """NFR, UI/UX, testing, migration — proposed targets unless noted."""
    nfr = f"""# Non-Functional Requirements

**Date:** {DOC_DATE} | **Status:** Proposed targets (Requires Business Confirmation where noted)

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
"""

    ui = f"""# User Interface Requirements

**Date:** {DOC_DATE}

## Brand and layout (as-is reference)

- **Brand:** KRAN Consulting corporate identity; red accent (`#c80808` in admin sidebar active state).
- **Typography:** Montserrat, Roboto, Lato, Poppins, Raleway (Google Fonts) — consolidate to design tokens in rebuild.
- **Header:** Multi-level navigation (Services mega-menu, About, Careers, Case Studies, Data Sheets, News, Gallery, Contact); external link to cpart.in.
- **Footer:** Social links (Facebook, LinkedIn, Instagram, YouTube).
- **Admin:** Bootstrap-based sidebar (`SideMenu.jsp`), DataTables, datetime pickers, drag-and-drop banner ordering.

## Reusable UI architecture (proposed)

- Shared component library: Header, Footer, CookieBanner, CaptchaField, DataTable, RichTextEditor, FileUpload, ConfirmDialog, Toast notifications.
- Form patterns: inline validation, consistent error messages, loading/disabled submit states.
- Table patterns: sort, filter, pagination for admin lists matching current DataTables behavior.
- Empty/error states for all public list pages (news, careers, gallery).
"""

    testing = f"""# Testing and Acceptance Criteria

**Date:** {DOC_DATE}

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
"""

    migration = f"""# Migration and Implementation Roadmap

**Date:** {DOC_DATE} | No dates assigned — dependency order only.

| Phase | Activities |
|-------|------------|
| 1 | SRS review, open question resolution, architecture sign-off |
| 2 | Design system + shell MFE + API Gateway skeleton |
| 3 | auth-service, notification-service (Graph), reference data |
| 4 | content-service + public news/gallery/banner MFE routes |
| 5 | catalog-service + solutions/projects MFE (largest content migration) |
| 6 | careers-service + engagement-service + forms |
| 7 | admin-mfe feature parity with SideMenu modules |
| 8 | URL redirects from `.action` to SPA routes; SEO validation |
| 9 | SIT, security/performance testing, UAT |
| 10 | Production cutover (phased strangler recommended — see OQ-010) |

**Dependencies:** Auth before admin MFE; media-service before gallery; notification-service before form go-live.
"""

    return {"nfr": nfr, "ui": ui, "testing": testing, "migration": migration}


def _load_optional_md(filename: str, fallback_title: str = "") -> str:
    p = OUTPUT_DIR / filename
    if p.exists():
        return p.read_text(encoding="utf-8")
    return f"## {fallback_title or filename}\n\n*Not generated — run generate_enterprise_docs.py*\n"


def build_master_md(sections: Dict[str, str]) -> str:
    order = [
        ("Document Control", _document_control_md()),
        ("Introduction and Purpose", _introduction_md()),
        ("Future-State Application Architecture", _load_optional_md("Future_State_Application_Architecture.md")),
        ("Existing System Analysis", sections["existing"]),
        ("Complete Application Sitemap", _load_optional_md("Complete_Application_Sitemap.md")),
        ("Existing Functionality Gap Analysis", _load_optional_md("Existing_Functionality_Gap_Analysis.md")),
        ("Module-Wise Workflow Analysis", _load_optional_md("Module_Wise_Workflow_Analysis.md")),
        ("Enterprise Functionality Recommendations", _load_optional_md("Enterprise_Functionality_Recommendations.md")),
        ("Business Rules Catalog", _load_optional_md("Business_Rules_Catalog.md")),
        ("Functional Requirements", sections["fr"]),
        ("System Architecture", sections["arch"]),
        ("API Requirements", sections["api"]),
        ("Database Requirements", sections["db"]),
        ("Business Workflows", sections["workflows"]),
        ("Non-Functional Requirements", sections["nfr"]),
        ("User Interface Requirements", sections["ui"]),
        ("Testing and Acceptance Criteria", sections["testing"]),
        ("Migration and Implementation Roadmap", sections["migration"]),
        ("Functional Completeness Report", _load_optional_md("Functional_Completeness_Report.md")),
        ("Open Questions", sections["open"]),
    ]
    parts = [
        f"# {PROJECT_NAME} — Software Requirements Specification (MASTER)",
        "",
        f"**Version:** {DOC_VERSION} | **Date:** {DOC_DATE}",
        "",
        "---",
        "",
    ]
    for title, body in order:
        parts.append(f"# {title}")
        parts.append("")
        # Strip duplicate top heading from section files
        body_clean = re.sub(r"^# [^\n]+\n+", "", body, count=1)
        parts.append(body_clean.strip())
        parts.append("")
        parts.append("---")
        parts.append("")
    return "\n".join(parts)


def _introduction_md() -> str:
    return f"""## Purpose

This Software Requirements Specification defines a **complete future-state unified enterprise website** for KRAN Consulting: preserving all discoverable legacy business capabilities, documenting gaps and improvements, and specifying a React micro-frontend and Spring Boot microservices architecture on **PostgreSQL**.

## Scope

In scope: full public marketing and admin CMS functional parity; functionality gap analysis; enterprise enhancement evaluation; unified UX shell; PostgreSQL architecture; MariaDB-to-PostgreSQL migration; API inventory; traceability; Microsoft Graph email; Google Analytics with consent. Out of scope: implementation code changes to the existing WAR during SRS preparation.

## Stakeholders

| Stakeholder | Interest |
|-------------|----------|
| KRAN Marketing / BD | Public content, enquiries, SEO |
| HR | Careers and applications |
| IT Operations | Deployment, security, monitoring |
| Development team | MFE and microservice delivery |

## User classes

| Class | Description |
|-------|-------------|
| Public visitor | Anonymous browsing and form submission |
| Job seeker | Career pages and resume upload |
| Administrator | Single-role CMS operator (existing); RBAC expansion proposed |

## Assumptions and constraints

- Existing `kran_website` schema remains initial data source.
- No development on legacy WAR until SRS approval.
- Hardcoded admin credentials must not be carried forward.
"""


def _document_control_md() -> str:
    return f"""## Document Metadata

| Field | Value |
|-------|-------|
| Project Name | KranConsulting Website |
| Document Title | KranConsulting Website – Software Requirements Specification (SRS) |
| Document Type | Software Requirements Specification |
| Document Version | {DOC_VERSION} |
| Prepared For | KranConsulting |
| Prepared By | Karunakaran S |
| Document Status | Draft for Review |
| Date | {DOC_DATE} |

## Revision History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| {DOC_VERSION} | {DOC_DATE} | Karunakaran S | Initial draft SRS — website rebuild, gap analysis, PostgreSQL architecture |

## Approvals

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Technical Lead | | | |
| QA Lead | | | |

## Scope

This SRS covers functional and non-functional requirements to rebuild the KranConsulting public website and admin CMS from the legacy Struts monolith to React MFEs and Spring Boot microservices with **PostgreSQL** as the target database (migrated from legacy MariaDB `kran_website`).
"""


def generate_rtm_xlsx(frs: List[Dict[str, str]], apis: List[Dict[str, str]], path: Path) -> None:
    from openpyxl import Workbook
    from openpyxl.styles import Font, PatternFill

    wb = Workbook()
    ws = wb.active
    ws.title = "RTM"
    headers = ["FR ID", "Title", "Module (MFE/Area)", "API", "Microservice", "Test Case ID", "Priority"]
    ws.append(headers)
    for cell in ws[1]:
        cell.font = Font(bold=True)
        cell.fill = PatternFill("solid", fgColor="DDDDDD")

    api_by_fr_hint: Dict[str, Tuple[str, str]] = {}
    for a in apis:
        api_by_fr_hint[a["path"]] = (a["path"], a["service"])

    for fr in frs:
        fr_id = fr["Requirement ID"]
        proposed = fr.get("Proposed Implementation", "")
        api = "TBD"
        service = "TBD"
        module = "TBD"
        if "Module:" in proposed:
            try:
                module = proposed.split("Module:")[1].split(";")[0].strip()
                api = proposed.split("API:")[1].strip().rstrip(".")
            except IndexError:
                pass
        if "content-service" in proposed:
            service = "content-service"
        elif "catalog-service" in proposed:
            service = "catalog-service"
        elif "careers-service" in proposed:
            service = "careers-service"
        elif "auth-service" in proposed:
            service = "auth-service"
        elif "engagement-service" in proposed:
            service = "engagement-service"
        elif "media-service" in proposed:
            service = "media-service"
        elif "notification-service" in proposed:
            service = "notification-service"
        elif "admin-service" in proposed:
            service = "admin-service"
        elif "api-gateway" in proposed:
            service = "api-gateway"
        elif "all MFEs" in proposed:
            service = "N/A (frontend)"
            module = "all MFEs"

        ws.append([
            fr_id,
            fr["Title"],
            module,
            api,
            service,
            f"TC-{fr_id.split('-')[1]}",
            fr.get("Priority", "Must"),
        ])

    ws.column_dimensions["A"].width = 10
    ws.column_dimensions["B"].width = 36
    ws.column_dimensions["C"].width = 22
    ws.column_dimensions["D"].width = 42
    ws.column_dimensions["E"].width = 22
    ws.column_dimensions["F"].width = 14
    ws.column_dimensions["G"].width = 10

    wb.save(path)


def _add_page_number_field(paragraph) -> None:
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn

    run = paragraph.add_run()
    fld_begin = OxmlElement("w:fldChar")
    fld_begin.set(qn("w:fldCharType"), "begin")
    run._r.append(fld_begin)

    run2 = paragraph.add_run()
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = "PAGE"
    run2._r.append(instr)

    run3 = paragraph.add_run()
    fld_sep = OxmlElement("w:fldChar")
    fld_sep.set(qn("w:fldCharType"), "separate")
    run3._r.append(fld_sep)

    run4 = paragraph.add_run("1")
    run5 = paragraph.add_run()
    fld_end = OxmlElement("w:fldChar")
    fld_end.set(qn("w:fldCharType"), "end")
    run5._r.append(fld_end)


def _add_toc_paragraph(doc) -> None:
    from docx.oxml import OxmlElement
    from docx.oxml.ns import qn

    p = doc.add_paragraph()
    run = p.add_run()
    fld_begin = OxmlElement("w:fldChar")
    fld_begin.set(qn("w:fldCharType"), "begin")
    run._r.append(fld_begin)
    run2 = p.add_run()
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = r'TOC \o "1-3" \h \z \u'
    run2._r.append(instr)
    run3 = p.add_run()
    fld_separate = OxmlElement("w:fldChar")
    fld_separate.set(qn("w:fldCharType"), "separate")
    run3._r.append(fld_separate)
    run4 = p.add_run("Table of Contents — update field in Word to refresh")
    run5 = p.add_run()
    fld_end = OxmlElement("w:fldChar")
    fld_end.set(qn("w:fldCharType"), "end")
    run5._r.append(fld_end)


def markdown_to_docx(md_path: Path, docx_path: Path) -> None:
    from docx import Document
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from docx.shared import Pt, Inches

    doc = Document()
    section = doc.sections[0]
    header = section.header.paragraphs[0]
    header.text = f"{PROJECT_NAME} — SRS v{DOC_VERSION}"
    footer = section.footer.paragraphs[0]
    footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
    footer.text = "Page "
    _add_page_number_field(footer)

    # Cover
    for _ in range(6):
        doc.add_paragraph("")
    t = doc.add_paragraph(PROJECT_NAME)
    t.alignment = WD_ALIGN_PARAGRAPH.CENTER
    t.runs[0].font.size = Pt(24)
    t.runs[0].bold = True
    st = doc.add_paragraph("Software Requirements Specification (IEEE 830-style)")
    st.alignment = WD_ALIGN_PARAGRAPH.CENTER
    doc.add_paragraph(f"Version {DOC_VERSION}").alignment = WD_ALIGN_PARAGRAPH.CENTER
    doc.add_paragraph(DOC_DATE).alignment = WD_ALIGN_PARAGRAPH.CENTER
    doc.add_page_break()

    doc.add_heading("Revision History", level=1)
    table = doc.add_table(rows=2, cols=4)
    hdr = table.rows[0].cells
    hdr[0].text = "Version"
    hdr[1].text = "Date"
    hdr[2].text = "Author"
    hdr[3].text = "Description"
    row = table.rows[1].cells
    row[0].text = DOC_VERSION
    row[1].text = DOC_DATE
    row[2].text = "SRS Generator"
    row[3].text = "Initial release from embedded analysis"
    doc.add_page_break()

    doc.add_heading("Table of Contents", level=1)
    _add_toc_paragraph(doc)
    doc.add_page_break()

    text = md_path.read_text(encoding="utf-8")
    in_code = False
    for raw_line in text.splitlines():
        line = raw_line.rstrip()
        if line.startswith("```"):
            in_code = not in_code
            continue
        if in_code:
            p = doc.add_paragraph(line)
            p.style = "Intense Quote"
            continue
        if line.startswith("# "):
            doc.add_heading(line[2:].strip(), level=1)
        elif line.startswith("## "):
            doc.add_heading(line[3:].strip(), level=2)
        elif line.startswith("### "):
            doc.add_heading(line[4:].strip(), level=3)
        elif line.startswith("|") and "---" not in line:
            # simple table row as monospace paragraph
            doc.add_paragraph(line, style="List Paragraph")
        elif line.startswith("- "):
            doc.add_paragraph(line[2:], style="List Bullet")
        elif line.strip() == "":
            continue
        else:
            doc.add_paragraph(line)

    for s in doc.sections:
        s.top_margin = Inches(1)
        s.bottom_margin = Inches(1)
        s.left_margin = Inches(1)
        s.right_margin = Inches(1)

    doc.save(docx_path)


def _reportlab_pdf_from_markdown(md_path: Path, pdf_path: Path) -> None:
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas

    text = md_path.read_text(encoding="utf-8")
    # Strip fenced code blocks for plain-text PDF readability
    text = re.sub(r"```[\s\S]*?```", "\n[diagram/table omitted in PDF fallback]\n", text)
    c = canvas.Canvas(str(pdf_path), pagesize=letter)
    width, height = letter
    x, y = 50, height - 50
    c.setFont("Helvetica", 9)
    for line in text.splitlines():
        if y < 50:
            c.showPage()
            c.setFont("Helvetica", 9)
            y = height - 50
        chunk = line[:110]
        c.drawString(x, y, chunk)
        y -= 12
    c.save()


def docx_to_pdf(docx_path: Path, pdf_path: Path, md_fallback: Optional[Path] = None) -> str:
    try:
        from docx2pdf import convert
        convert(str(docx_path), str(pdf_path))
        return "docx2pdf"
    except Exception as exc:
        try:
            src = md_fallback or docx_path
            if md_fallback and md_fallback.exists():
                _reportlab_pdf_from_markdown(md_fallback, pdf_path)
                note_path = pdf_path.with_suffix(".pdf.generation.txt")
                note_path.write_text(
                    f"docx2pdf failed ({exc}); PDF created via reportlab from {md_fallback.name}.\n"
                    "For Word-quality PDF, open KranConsulting_SRS.docx and export to PDF.\n",
                    encoding="utf-8",
                )
                return "reportlab (fallback)"
        except Exception as rl_exc:
            note_path = pdf_path.with_suffix(".pdf.generation.txt")
            note_path.write_text(
                f"PDF not generated: docx2pdf ({exc}); reportlab ({rl_exc}).\n"
                "Install Microsoft Word for docx2pdf, or export KranConsulting_SRS.docx manually.\n",
                encoding="utf-8",
            )
            return f"failed: {exc}; reportlab: {rl_exc}"
        note_path = pdf_path.with_suffix(".pdf.generation.txt")
        note_path.write_text(
            f"PDF not generated automatically: {exc}\n"
            "Install Microsoft Word for docx2pdf on Windows, or export manually from Word.\n",
            encoding="utf-8",
        )
        return f"failed: {exc}"


def report_sizes(paths: List[Path]) -> None:
    print("\nGenerated deliverables:")
    for p in sorted(paths):
        if p.exists():
            print(f"  {p.name}: {p.stat().st_size:,} bytes")
        else:
            print(f"  {p.name}: MISSING")


def main() -> int:
    os.chdir(OUTPUT_DIR)
    # Generate enterprise extension docs if script present
    ent_script = OUTPUT_DIR / "generate_enterprise_docs.py"
    if ent_script.exists():
        import importlib.util
        spec = importlib.util.spec_from_file_location("gen_ent", ent_script)
        if spec and spec.loader:
            mod = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(mod)
            mod.main()
    frs, fr_md = build_functional_requirements()
    apis, api_md = build_api_catalog()
    supplementary = generate_supplementary_srs_sections()
    sections = {
        "existing": generate_existing_system_analysis(),
        "fr": fr_md,
        "arch": generate_system_architecture(),
        "api": api_md,
        "db": database_section_for_master(),
        "workflows": generate_business_workflows(),
        "open": generate_open_questions(),
        **supplementary,
    }

    outputs: List[Path] = []
    # One .md per SRS chapter (body matches KranConsulting_SRS_MASTER.md / Word DOCX).
    mapping = {
        "Document_Control.md": f"# Document Control\n\n{_document_control_md().strip()}\n",
        "Introduction_and_Purpose.md": (
            f"# Introduction and Purpose\n\n{_introduction_md().strip()}\n"
        ),
        "Existing_System_Analysis.md": sections["existing"],
        "Functional_Requirements.md": sections["fr"],
        "System_Architecture.md": sections["arch"],
        "API_Requirements.md": sections["api"],
        "Database_Requirements.md": sections["db"],
        "Business_Workflows.md": sections["workflows"],
        "Non-Functional_Requirements.md": supplementary["nfr"],
        "User_Interface_Requirements.md": supplementary["ui"],
        "Testing_and_Acceptance_Criteria.md": supplementary["testing"],
        "Migration_and_Implementation_Roadmap.md": supplementary["migration"],
        "Open_Questions.md": sections["open"],
    }
    for name, content in mapping.items():
        p = OUTPUT_DIR / name
        write_text(p, content)
        outputs.append(p)

    master = build_master_md(sections)
    master_path = OUTPUT_DIR / "KranConsulting_SRS_MASTER.md"
    write_text(master_path, master)
    outputs.append(master_path)

    rtm_path = OUTPUT_DIR / "Requirements_Traceability_Matrix.xlsx"
    generate_rtm_xlsx(frs, apis, rtm_path)
    outputs.append(rtm_path)

    # SPFO reference template formatting (mandatory layout)
    import generate_spfo_formatted_srs as spfo_fmt

    docx_path = OUTPUT_DIR / "KranConsulting_SRS.docx"
    spfo_fmt.build_kran_srs_docx(master_path, docx_path)
    outputs.append(docx_path)

    pdf_path = OUTPUT_DIR / "KranConsulting_SRS.pdf"
    try:
        method = spfo_fmt.export_docx_to_pdf(docx_path, pdf_path)
    except RuntimeError as pdf_exc:
        method = str(pdf_exc)
    audit_script = OUTPUT_DIR / "_audit_docx.py"
    if audit_script.exists():
        import subprocess

        subprocess.run([sys.executable, str(audit_script)], cwd=OUTPUT_DIR, check=False)
    if pdf_path.exists() and pdf_path.stat().st_size > 50_000:
        outputs.append(pdf_path)
    else:
        alt = pdf_path.with_suffix(".pdf.generation.txt")
        if alt.exists():
            outputs.append(alt)

    outputs.append(OUTPUT_DIR / "generate_deliverables.py")
    report_sizes(outputs)
    nfr_count = supplementary["nfr"].count("NFR-")
    print(f"\nFunctional requirements: {len(frs)}")
    print(f"Non-functional requirement IDs: {nfr_count}")
    print(f"API catalog rows: {len(apis)}")
    print(f"PDF generation: {method}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
