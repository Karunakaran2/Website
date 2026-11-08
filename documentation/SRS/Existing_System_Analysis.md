# Existing System Analysis — KranConsulting Corporate Website

**Document status:** Generated from embedded reverse-engineering notes (not runtime analysis).  
**Scope:** As-is system supporting public marketing site and single-admin CMS.  
**Date:** 2026-11-04

## 1. Executive Summary

The KranConsulting website is a monolithic Java web application delivered as a Maven WAR. It combines Apache Struts 2 actions, Spring-managed services, Hibernate ORM, and JSP/Tiles views over a MariaDB database (`kran_website`). The site publishes company services, product/solution portfolios, case studies, news, blogs (labeled “Data Sheets” in admin), galleries, careers, and enquiry forms. A separate Struts package exposes authenticated admin CRUD for all dynamic content. Integrations include Microsoft Graph for outbound email, Google Analytics (property `G-9T4S2N58MP`) gated by cookie consent, and ESAPI-based XSS filtering.

The rebuild target replaces this stack with a React micro-frontend shell (Module Federation recommended) and Spring Boot microservices while preserving functional parity and remediating known security debt (hardcoded admin credentials).

## 2. Technology Stack (As-Is)

| Layer | Technology |
|-------|------------|
| Runtime | Java 11 Maven WAR |
| Web framework | Apache Struts 2.5.17 |
| DI / integration | Spring Framework 4.3.13 |
| Persistence | Hibernate 4.3.11 |
| Database | MariaDB schema `kran_website` |
| Presentation | JSP, Bootstrap, jQuery, Apache Tiles |
| Internal framework | kran-framework ES2-1.1 |
| Input sanitization | ESAPI XSS filter |
| Email | Microsoft Graph |
| Analytics | Google Analytics G-9T4S2N58MP with cookie consent |

## 3. Application Entry and Routing

- **Primary entry:** Struts `welcome → yCIMVQ5RMbA.jsp`.
- **Static welcome file:** `yCIMVQ5RMbA.html` (served when configured as welcome-file).
- **View composition:** Apache Tiles layouts wrap JSP fragments; Bootstrap and jQuery provide client behavior.

Public URLs map to Struts `.action` endpoints in the **login** package (naming reflects historical packaging, not unauthenticated-only scope). Admin URLs map to the **session** package and require an HTTP session carrying `userBean`.

## 4. Authentication and Session Model

| Aspect | Detail |
|--------|--------|
| Identity model | Single administrative operator |
| Login flow | `LoginAction.login` with `CaptchaInner` validation |
| Credential storage | Hardcoded in LoginAction.java; requires migration to secure credential store (password not documented). |
| Session attribute | `userBean` |
| Session guard | `SessionExpiredAction` interceptor |
| Timeout | 45 minutes |

**Security finding (document only):** Administrative authentication relies on hardcoded credentials in source. Rebuild must externalize secrets (vault, environment, or identity provider) and eliminate password material from the repository.

## 5. Public Struts Actions (login package)

The following capabilities are exposed without admin session (some accept POST submissions):

- welcome
- aboutus
- contact
- sendMsg
- getService
- solutions (?val= slug)
- projects
- readProject
- projectDetail
- kranprojects
- allsolutions
- domain
- clients
- casestudy/casestudies
- readCase
- categorycase
- datasheets (public blog)
- blog
- readBlog
- news
- newsDetail
- viewNews
- gallery
- galleryAjax
- galleryView
- career
- overview
- jobApply
- saveCandidate
- submitCareerForm
- submitEnquiry
- submitKProjects
- submitKSolutions
- enquire
- search/result
- teammanagement
- krancsr
- krantech
- timeline
- viewBanner
- viewTestimonial
- cookie consent actions
- captcha
- comingsoon
- successMessage

### 5.1 Services (`getService`)

Query parameter `val` selects one of:

- consultancy
- software-development
- mobile-app-development
- project-product-implementation
- maintenance-support
- porting-migration

### 5.2 Solutions (`solutions`)

Query parameter `val` selects solution detail slugs rendered via `Solutions.jsp`, including:

- probity-financials
- audit-management-system
- sirius
- charitable-endowments-platform
- comprehensive-loan-management-system
- project-monitoring-information-system
- report-monitoring-information-system
- inspection-management-system
- phoenix
- centralized-welfare-management-system
- stage
- integrated-human-resource-management-system
- financial-accounting-system
- budget-expenditure-monitoring-system
- smartNet
- general-administration-management-system
- fund-benefits-management-system
- smart-office
- saarathi
- galaxy
- application-lifecycle-management-solution
- galaxy-med
- training-administration-management-solution
- e-metier
- online-platform-logistics-management
- order-payment-processing-solution
- advertisement-management-information-repository
- digital-platform-clinical-trials-registry
- vtcres
- pfms360
- hrms
- kranps
- kranss

Additional mobile variants and combined listing actions (`allsolutions`, `kranprojects`, etc.) exist as documented in Struts configuration.

## 6. Admin Struts Actions (session package)

Authenticated admin capabilities include:

- dashboard
- sidemenu
- request
- solRequest
- adminCareer
- careerAdd
- saveJob
- editJob
- jobDeactivate
- NoVacancy
- jobApplications
- downloadDoc
- downloadDocu
- downloadFilteredResumes
- adminNews CRUD
- adminGallery groups/images
- adminKranProjects
- adminKranSolutions
- adminKranSeniors
- adminKranFaces
- adminKranTimeline CRUD
- getProjectProduct CRUD
- adminBanner
- adminBlogs (Data Sheets)
- adminCase
- mailSetup
- categorySetup
- solRequest

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

- contacts
- careers
- news
- application_request
- gallery
- gallgroup
- project_product
- banner
- blog
- comments
- mail_setup
- category
- submitted_resumes
- casestudy
- kran_faces
- kran_seniors
- kran_projects
- kran_solutions
- kran_timeline

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
