# API Requirements — Proposed REST (vs Legacy Struts)

**Date:** 2026-11-04

## 1. Principles

- REST JSON over HTTPS; OpenAPI 3 document per service.
- Legacy Struts endpoints use `.action` suffix and mixed GET/POST; proposed APIs use nouns and HTTP verbs.
- Public read endpoints cached at CDN/gateway where safe.

## 2. API catalog

| Method | Path | Auth | Service | Legacy Struts | Description |
|--------|------|------|---------|---------------|-------------|
| POST | `/api/v1/auth/login` | Public | auth-service | LoginAction.login | Admin login with CAPTCHA |
| POST | `/api/v1/auth/logout` | Admin | auth-service | session invalidate | Invalidate session/token |
| GET | `/api/v1/auth/captcha` | Public | auth-service | captcha / CaptchaInner | Generate CAPTCHA challenge |
| GET | `/api/v1/auth/me` | Admin | auth-service | userBean session | Current admin profile |
| GET | `/api/v1/banners/active` | Public | content-service | viewBanner | Active banners |
| GET | `/api/v1/testimonials` | Public | content-service | viewTestimonial | Testimonials list |
| GET | `/api/v1/news` | Public | content-service | news, viewNews | Paginated news |
| GET | `/api/v1/news/{id}` | Public | content-service | newsDetail | News detail |
| GET | `/api/v1/blogs` | Public | content-service | blog | Blog list |
| GET | `/api/v1/blogs/{id}` | Public | content-service | readBlog | Blog detail |
| GET | `/api/v1/data-sheets` | Public | content-service | datasheets | Data sheets (blog alias) |
| GET | `/api/v1/timeline` | Public | content-service | timeline | Company timeline |
| GET | `/api/v1/galleries` | Public | media-service | gallery | Gallery groups |
| GET | `/api/v1/galleries/{id}` | Public | media-service | galleryView | Gallery detail |
| GET | `/api/v1/galleries/{id}/images` | Public | media-service | galleryAjax | Gallery images AJAX |
| GET | `/api/v1/solutions` | Public | catalog-service | allsolutions | All solutions |
| GET | `/api/v1/solutions/probity-financials` | Public | catalog-service | solutions?val=probity-financials | Solution detail probity-financials |
| GET | `/api/v1/solutions/audit-management-system` | Public | catalog-service | solutions?val=audit-management-system | Solution detail audit-management-system |
| GET | `/api/v1/solutions/sirius` | Public | catalog-service | solutions?val=sirius | Solution detail sirius |
| GET | `/api/v1/solutions/charitable-endowments-platform` | Public | catalog-service | solutions?val=charitable-endowments-platform | Solution detail charitable-endowments-platform |
| GET | `/api/v1/solutions/comprehensive-loan-management-system` | Public | catalog-service | solutions?val=comprehensive-loan-management-system | Solution detail comprehensive-loan-management-system |
| GET | `/api/v1/solutions/project-monitoring-information-system` | Public | catalog-service | solutions?val=project-monitoring-information-system | Solution detail project-monitoring-information-system |
| GET | `/api/v1/solutions/report-monitoring-information-system` | Public | catalog-service | solutions?val=report-monitoring-information-system | Solution detail report-monitoring-information-system |
| GET | `/api/v1/solutions/inspection-management-system` | Public | catalog-service | solutions?val=inspection-management-system | Solution detail inspection-management-system |
| GET | `/api/v1/solutions/phoenix` | Public | catalog-service | solutions?val=phoenix | Solution detail phoenix |
| GET | `/api/v1/solutions/centralized-welfare-management-system` | Public | catalog-service | solutions?val=centralized-welfare-management-system | Solution detail centralized-welfare-management-system |
| GET | `/api/v1/solutions/{slug}` | Public | catalog-service | solutions?val= | Solution detail by slug |
| GET | `/api/v1/services` | Public | catalog-service | getService | Service offerings list |
| GET | `/api/v1/services/consultancy` | Public | catalog-service | getService val=consultancy | Service detail consultancy |
| GET | `/api/v1/services/software-development` | Public | catalog-service | getService val=software-development | Service detail software-development |
| GET | `/api/v1/services/mobile-app-development` | Public | catalog-service | getService val=mobile-app-development | Service detail mobile-app-development |
| GET | `/api/v1/services/project-product-implementation` | Public | catalog-service | getService val=project-product-implementation | Service detail project-product-implementation |
| GET | `/api/v1/services/maintenance-support` | Public | catalog-service | getService val=maintenance-support | Service detail maintenance-support |
| GET | `/api/v1/services/porting-migration` | Public | catalog-service | getService val=porting-migration | Service detail porting-migration |
| GET | `/api/v1/projects` | Public | catalog-service | projects, kranprojects | Projects listing |
| GET | `/api/v1/projects/{id}` | Public | catalog-service | readProject, projectDetail | Project detail |
| GET | `/api/v1/case-studies` | Public | catalog-service | casestudies | Case studies |
| GET | `/api/v1/case-studies/{id}` | Public | catalog-service | readCase | Case study detail |
| GET | `/api/v1/clients` | Public | catalog-service | clients | Clients |
| GET | `/api/v1/pages/about` | Public | content-service | aboutus | Page content about |
| GET | `/api/v1/pages/contact` | Public | content-service | contact | Page content contact |
| GET | `/api/v1/pages/domain` | Public | content-service | domain | Page content domain |
| GET | `/api/v1/pages/csr` | Public | content-service | krancsr | Page content csr |
| GET | `/api/v1/pages/tech` | Public | content-service | krantech | Page content tech |
| GET | `/api/v1/pages/team` | Public | content-service | teammanagement | Page content team |
| GET | `/api/v1/pages/careers-overview` | Public | content-service | overview | Page content careers-overview |
| POST | `/api/v1/enquiries` | Public | engagement-service | submitEnquiry, enquire, contact | Contact/enquiry submit |
| POST | `/api/v1/messages` | Public | engagement-service | sendMsg | Send message |
| POST | `/api/v1/forms/k-projects` | Public | engagement-service | submitKProjects | K Projects form |
| POST | `/api/v1/forms/k-solutions` | Public | engagement-service | submitKSolutions | K Solutions form |
| POST | `/api/v1/consent` | Public | engagement-service | cookie consent actions | Cookie consent |
| GET | `/api/v1/search` | Public | content-service | search/result | Site search |
| GET | `/api/v1/jobs` | Public | careers-service | career | Open jobs |
| GET | `/api/v1/jobs/{id}` | Public | careers-service | jobApply | Job detail |
| POST | `/api/v1/jobs/{id}/applications` | Public | careers-service | saveCandidate, submitCareerForm | Submit application |
| GET | `/api/v1/admin/dashboard` | Admin | admin-service | dashboard | Dashboard metrics |
| GET | `/api/v1/admin/requests` | Admin | engagement-service | request | Contact requests |
| GET | `/api/v1/admin/solution-requests` | Admin | engagement-service | solRequest | Solution requests |
| GET | `/api/v1/admin/jobs` | Admin | careers-service | adminCareer | Jobs admin list |
| POST | `/api/v1/admin/jobs` | Admin | careers-service | saveJob, careerAdd | Create job |
| PUT | `/api/v1/admin/jobs/{id}` | Admin | careers-service | editJob | Update job |
| PATCH | `/api/v1/admin/jobs/{id}/deactivate` | Admin | careers-service | jobDeactivate | Deactivate job |
| PUT | `/api/v1/admin/jobs/no-vacancy` | Admin | careers-service | NoVacancy | Global no vacancy |
| GET | `/api/v1/admin/applications` | Admin | careers-service | jobApplications | Applications list |
| GET | `/api/v1/admin/applications/{id}/resume` | Admin | careers-service | downloadDoc | Download resume |
| POST | `/api/v1/admin/applications/export` | Admin | careers-service | downloadFilteredResumes | Bulk resume export |
| POST | `/api/v1/admin/news` | Admin | content-service | adminNews | Create news |
| PUT | `/api/v1/admin/news/{id}` | Admin | content-service | adminNews | Update news |
| DELETE | `/api/v1/admin/news/{id}` | Admin | content-service | adminNews | Delete news |
| CRUD | `/api/v1/admin/gallery-groups` | Admin | media-service | adminGallery groups | Gallery groups |
| CRUD | `/api/v1/admin/gallery-images` | Admin | media-service | adminGallery images | Gallery images |
| CRUD | `/api/v1/admin/kran-projects` | Admin | catalog-service | adminKranProjects | Kran projects |
| CRUD | `/api/v1/admin/kran-solutions` | Admin | catalog-service | adminKranSolutions | Kran solutions |
| CRUD | `/api/v1/admin/kran-seniors` | Admin | catalog-service | adminKranSeniors | Kran seniors |
| CRUD | `/api/v1/admin/kran-faces` | Admin | catalog-service | adminKranFaces | Kran faces |
| CRUD | `/api/v1/admin/timeline` | Admin | content-service | adminKranTimeline | Timeline entries |
| CRUD | `/api/v1/admin/project-products` | Admin | catalog-service | getProjectProduct | Project products |
| CRUD | `/api/v1/admin/banners` | Admin | content-service | adminBanner | Banners |
| CRUD | `/api/v1/admin/data-sheets` | Admin | content-service | adminBlogs | Data sheets/blogs |
| CRUD | `/api/v1/admin/case-studies` | Admin | catalog-service | adminCase | Case studies |
| CRUD | `/api/v1/admin/categories` | Admin | catalog-service | categorySetup | Categories |
| PUT | `/api/v1/admin/mail-setup` | Admin | notification-service | mailSetup | Mail/Graph settings |
| POST | `/api/v1/notifications/email` | Admin | notification-service | mail integration | Send email via Graph |
| GET | `/api/v1/admin/comments` | Admin | engagement-service | comments | List comments |
| DELETE | `/api/v1/admin/comments/{id}` | Admin | engagement-service | comments | Delete comment |

**Total proposed API operations/rows:** 85

## 3. Non-functional API requirements

- **NFR-API-001:** All admin routes require valid bearer token or session cookie issued by auth-service.
- **NFR-API-002:** Error model: RFC 7807 problem+json.
- **NFR-API-003:** Pagination: `page`, `size`, `sort` query parameters on list endpoints.
- **NFR-API-004:** Idempotency-Key header on enquiry/application POST endpoints.
