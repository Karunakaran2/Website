# Functional Requirements — KranConsulting Rebuild

**Version:** 1.0 | **Date:** 2026-11-04

## 1. Introduction

Requirements below distinguish **Existing Implementation (Struts 2)** from **Proposed Implementation** (React MFEs + Spring Boot microservices). IDs use prefix `FR-`.

## 2. Requirement template (14 fields)

- Requirement ID
- Title
- Description
- Priority
- Stakeholder / Source
- Actor(s)
- Preconditions
- Trigger
- Main Flow
- Alternate / Exception Flows
- Data Requirements
- Existing Implementation (Struts 2)
- Proposed Implementation
- Acceptance Criteria

## 3. Detailed requirements (major features)

### FR-001: Public home page

- **Title:** Public home page
- **Description:** Visitors shall view the corporate home page with banners and testimonials consistent with current welcome flow.
- **Priority:** Must
- **Stakeholder / Source:** Marketing / Existing welcome action
- **Actor(s):** Anonymous visitor
- **Preconditions:** Site is reachable; CDN/cache configured.
- **Trigger:** User navigates to `/` or welcome route.
- **Main Flow:** System loads hero content, active banners, testimonials; records analytics only if consent granted.
- **Alternate / Exception Flows:** Missing banner data shows safe empty state; no server stack trace to client.
- **Data Requirements:** banner, kran_timeline (optional teasers)
- **Existing Implementation (Struts 2):** `welcome`, `viewBanner`, `viewTestimonial` Struts actions; JSP `yCIMVQ5RMbA.jsp`.
- **Proposed Implementation:** shell MFE route `/`; `GET /api/v1/banners/active`, `GET /api/v1/testimonials/active`; content-service.
- **Acceptance Criteria:** Lighthouse smoke pass; API p95 < 500ms for banner list; parity with legacy home sections.

### FR-002: Admin login with CAPTCHA

- **Title:** Admin login with CAPTCHA
- **Description:** Administrative users shall authenticate with username, password, and CAPTCHA before accessing CMS.
- **Priority:** Must
- **Stakeholder / Source:** Security / LoginAction
- **Actor(s):** Admin user
- **Preconditions:** Auth service available; CAPTCHA endpoint reachable.
- **Trigger:** Admin submits login form.
- **Main Flow:** Validate CAPTCHA, verify credentials from secure store, issue session/JWT, redirect to dashboard.
- **Alternate / Exception Flows:** Invalid CAPTCHA or credentials return generic error; account lockout policy TBD (see Open Questions).
- **Data Requirements:** No passwords in logs; audit login success/failure.
- **Existing Implementation (Struts 2):** `LoginAction.login`, `CaptchaInner`, session key `userBean`.
- **Proposed Implementation:** auth-service `POST /api/v1/auth/login`; CAPTCHA `GET /api/v1/auth/captcha`; admin-mfe login page.
- **Acceptance Criteria:** Pen test: no hardcoded credentials in repo; CAPTCHA required; session expires at 45 min idle.

### FR-003: Session expiration for admin

- **Title:** Session expiration for admin
- **Description:** Expired or missing admin sessions shall be rejected from admin routes.
- **Priority:** Must
- **Stakeholder / Source:** SessionExpiredAction interceptor
- **Actor(s):** Admin user, System
- **Preconditions:** Admin was previously authenticated.
- **Trigger:** Session idle exceeds 45 minutes or session invalidated.
- **Main Flow:** Interceptor/guard returns 401 or redirects to login; no partial admin data rendered.
- **Alternate / Exception Flows:** Concurrent session handling per Open Questions.
- **Data Requirements:** Session TTL configurable.
- **Existing Implementation (Struts 2):** `SessionExpiredAction`, 45-minute HTTP session.
- **Proposed Implementation:** API Gateway JWT expiry + refresh policy; auth-service session registry if server-side sessions.
- **Acceptance Criteria:** Automated test: expired token cannot call admin APIs; user prompted to re-login.

### FR-004: Contact enquiry submission

- **Title:** Contact enquiry submission
- **Description:** Visitors shall submit contact/enquiry forms that persist and trigger email notification.
- **Priority:** Must
- **Stakeholder / Source:** contact, sendMsg, submitEnquiry
- **Actor(s):** Anonymous visitor
- **Preconditions:** Form displayed; rate limits configured.
- **Trigger:** User submits valid enquiry form.
- **Main Flow:** Validate input, persist contact/application_request, enqueue email via Graph.
- **Alternate / Exception Flows:** Validation errors inline; email failure retries and surfaces ops alert without losing record.
- **Data Requirements:** contacts, application_request, mail_setup
- **Existing Implementation (Struts 2):** `contact`, `sendMsg`, `submitEnquiry`, `enquire` actions.
- **Proposed Implementation:** engagement-service `POST /api/v1/enquiries`; notification-service email dispatch.
- **Acceptance Criteria:** E2E: record in DB + email sent in staging Graph tenant.

### FR-005: Career job application

- **Title:** Career job application
- **Description:** Applicants shall view openings and submit applications with resume upload.
- **Priority:** Must
- **Stakeholder / Source:** career, jobApply, saveCandidate
- **Actor(s):** Job seeker
- **Preconditions:** Active job exists or NoVacancy disabled.
- **Trigger:** User applies from job detail page.
- **Main Flow:** Validate fields, store submitted_resumes, attach file, notify recruiters.
- **Alternate / Exception Flows:** Oversized/disallowed file types rejected; vacancy closed shows message.
- **Data Requirements:** careers, submitted_resumes
- **Existing Implementation (Struts 2):** `career`, `overview`, `jobApply`, `saveCandidate`, `submitCareerForm`.
- **Proposed Implementation:** careers-service APIs; object storage for resumes; virus scan hook (proposed).
- **Acceptance Criteria:** Resume downloadable by admin; GDPR retention policy documented.

### FR-006: News publishing (admin)

- **Title:** News publishing (admin)
- **Description:** Admin shall create, edit, publish, and retire news articles displayed on public site.
- **Priority:** Must
- **Stakeholder / Source:** adminNews CRUD
- **Actor(s):** Admin user
- **Preconditions:** Authenticated admin session.
- **Trigger:** Admin saves news item.
- **Main Flow:** Persist news record with publish flag and timestamps; invalidate public cache.
- **Alternate / Exception Flows:** Delete/archival rules per content policy.
- **Data Requirements:** news
- **Existing Implementation (Struts 2):** adminNews Struts CRUD in session package.
- **Proposed Implementation:** content-service admin APIs; public `GET /api/v1/news`.
- **Acceptance Criteria:** Published news visible within 60s cache TTL; draft not public.

### FR-007: Gallery management

- **Title:** Gallery management
- **Description:** Admin shall manage gallery groups and images; public site displays galleries and AJAX views.
- **Priority:** Must
- **Stakeholder / Source:** adminGallery, gallery, galleryAjax
- **Actor(s):** Admin, Visitor
- **Preconditions:** Media storage available.
- **Trigger:** Admin uploads image or visitor opens gallery page.
- **Main Flow:** CRUD on gallgroup/gallery; public read with pagination.
- **Alternate / Exception Flows:** Broken image URLs show placeholder.
- **Data Requirements:** gallery, gallgroup
- **Existing Implementation (Struts 2):** `gallery`, `galleryAjax`, `galleryView`, admin gallery actions.
- **Proposed Implementation:** media-service + content-service; `GET /api/v1/galleries`.
- **Acceptance Criteria:** Image upload max size enforced; EXIF stripped (proposed).

### FR-008: Solution catalog by slug

- **Title:** Solution catalog by slug
- **Description:** Visitors shall open solution detail pages for all legacy slugs under `solutions?val=`.
- **Priority:** Must
- **Stakeholder / Source:** Solutions.jsp slugs
- **Actor(s):** Anonymous visitor
- **Preconditions:** Catalog seeded with slug list.
- **Trigger:** User selects solution from menu or deep link.
- **Main Flow:** Resolve slug to catalog entry; render rich content and related assets.
- **Alternate / Exception Flows:** Unknown slug returns 404 page.
- **Data Requirements:** kran_solutions, project_product as applicable
- **Existing Implementation (Struts 2):** `solutions` action with `val` parameter; slugs in Solutions.jsp.
- **Proposed Implementation:** catalog-service `GET /api/v1/solutions/{{slug}}`; catalog-mfe route `/solutions/:slug`.
- **Acceptance Criteria:** All documented slugs resolve; redirect map for renamed slugs if any.

### FR-009: Service detail pages

- **Title:** Service detail pages
- **Description:** Visitors shall view six service offering pages via `getService` values.
- **Priority:** Must
- **Stakeholder / Source:** getService action
- **Actor(s):** Anonymous visitor
- **Preconditions:** Service definitions configured.
- **Trigger:** User navigates to service URL.
- **Main Flow:** Map `val` to content template and metadata.
- **Alternate / Exception Flows:** Invalid `val` → 404.
- **Data Requirements:** Static/content metadata
- **Existing Implementation (Struts 2):** `getService` with vals: {', '.join(SERVICE_VALS)}.
- **Proposed Implementation:** public-site MFE; `GET /api/v1/services/{{slug}}`.
- **Acceptance Criteria:** Each of six slugs renders distinct content block.

### FR-010: Cookie consent and analytics

- **Title:** Cookie consent and analytics
- **Description:** Site shall record cookie consent before loading Google Analytics `G-9T4S2N58MP`.
- **Priority:** Must
- **Stakeholder / Source:** Cookie consent actions + GA
- **Actor(s):** Anonymous visitor
- **Preconditions:** Consent banner configured.
- **Trigger:** First visit or consent change.
- **Main Flow:** Persist preference; load GA script only if accepted.
- **Alternate / Exception Flows:** Withdraw consent disables tracking and clears cookies where possible.
- **Data Requirements:** Consent audit log (proposed)
- **Existing Implementation (Struts 2):** Cookie consent Struts actions; GA tag in layout.
- **Proposed Implementation:** shell MFE consent module; `POST /api/v1/consent`; no GA until opt-in.
- **Acceptance Criteria:** Automated check: network tab shows no GA before accept.

### FR-011: Site search

- **Title:** Site search
- **Description:** Users shall search public content and view results.
- **Priority:** Should
- **Stakeholder / Source:** search/result actions
- **Actor(s):** Anonymous visitor
- **Preconditions:** Search index populated.
- **Trigger:** User submits search query.
- **Main Flow:** Query index across news, blog, solutions, projects; paginate results.
- **Alternate / Exception Flows:** Empty results page with suggestions.
- **Data Requirements:** Indexed entities: news, blog, casestudy, kran_projects, kran_solutions
- **Existing Implementation (Struts 2):** `search`, `result` Struts actions.
- **Proposed Implementation:** content-service + catalog-service search API or dedicated search index.
- **Acceptance Criteria:** Search returns relevant hits for sample queries documented in test cases.

### FR-012: Admin resume export

- **Title:** Admin resume export
- **Description:** Admin shall download individual and filtered bulk resumes.
- **Priority:** Must
- **Stakeholder / Source:** downloadDoc, downloadFilteredResumes
- **Actor(s):** Admin user
- **Preconditions:** Authenticated; applications exist.
- **Trigger:** Admin clicks download.
- **Main Flow:** Authorize admin; stream file(s) with audit log.
- **Alternate / Exception Flows:** Missing file returns 404 without path disclosure.
- **Data Requirements:** submitted_resumes binary storage
- **Existing Implementation (Struts 2):** `downloadDoc`, `downloadDocu`, `downloadFilteredResumes`.
- **Proposed Implementation:** careers-service `GET /api/v1/admin/applications/{{id}}/resume` and bulk export job.
- **Acceptance Criteria:** Download matches uploaded file hash; bulk export completes async for large sets.

## 4. Additional functional requirements (compact 14-field)

The following requirements use the same 14-field structure with concise flows.

### FR-013: About Us page

- **Title:** About Us page
- **Description:** The system shall support «About Us page» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `aboutus`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: aboutus.
- **Proposed Implementation:** Module: public-site; API: GET /api/v1/pages/about.
- **Acceptance Criteria:** Automated regression test TC-013 passes.

### FR-014: Contact page display

- **Title:** Contact page display
- **Description:** The system shall support «Contact page display» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `contact`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: contact.
- **Proposed Implementation:** Module: public-site; API: GET /api/v1/pages/contact.
- **Acceptance Criteria:** Automated regression test TC-014 passes.

### FR-015: Send message from contact

- **Title:** Send message from contact
- **Description:** The system shall support «Send message from contact» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `sendMsg`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: sendMsg.
- **Proposed Implementation:** Module: engagement-service; API: POST /api/v1/messages.
- **Acceptance Criteria:** Automated regression test TC-015 passes.

### FR-016: Projects listing

- **Title:** Projects listing
- **Description:** The system shall support «Projects listing» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `projects, kranprojects`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: projects, kranprojects.
- **Proposed Implementation:** Module: catalog-mfe; API: GET /api/v1/projects.
- **Acceptance Criteria:** Automated regression test TC-016 passes.

### FR-017: Project detail

- **Title:** Project detail
- **Description:** The system shall support «Project detail» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `readProject, projectDetail`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: readProject, projectDetail.
- **Proposed Implementation:** Module: catalog-mfe; API: GET /api/v1/projects/{id}.
- **Acceptance Criteria:** Automated regression test TC-017 passes.

### FR-018: All solutions listing

- **Title:** All solutions listing
- **Description:** The system shall support «All solutions listing» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `allsolutions`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: allsolutions.
- **Proposed Implementation:** Module: catalog-mfe; API: GET /api/v1/solutions.
- **Acceptance Criteria:** Automated regression test TC-018 passes.

### FR-019: Domain expertise page

- **Title:** Domain expertise page
- **Description:** The system shall support «Domain expertise page» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `domain`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: domain.
- **Proposed Implementation:** Module: public-site; API: GET /api/v1/pages/domain.
- **Acceptance Criteria:** Automated regression test TC-019 passes.

### FR-020: Clients showcase

- **Title:** Clients showcase
- **Description:** The system shall support «Clients showcase» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `clients`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: clients.
- **Proposed Implementation:** Module: catalog-mfe; API: GET /api/v1/clients.
- **Acceptance Criteria:** Automated regression test TC-020 passes.

### FR-021: Case studies list

- **Title:** Case studies list
- **Description:** The system shall support «Case studies list» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `casestudies`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: casestudies.
- **Proposed Implementation:** Module: catalog-mfe; API: GET /api/v1/case-studies.
- **Acceptance Criteria:** Automated regression test TC-021 passes.

### FR-022: Case study detail

- **Title:** Case study detail
- **Description:** The system shall support «Case study detail» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `readCase`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: readCase.
- **Proposed Implementation:** Module: catalog-mfe; API: GET /api/v1/case-studies/{id}.
- **Acceptance Criteria:** Automated regression test TC-022 passes.

### FR-023: Case study by category

- **Title:** Case study by category
- **Description:** The system shall support «Case study by category» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `categorycase`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: categorycase.
- **Proposed Implementation:** Module: catalog-mfe; API: GET /api/v1/case-studies?category=.
- **Acceptance Criteria:** Automated regression test TC-023 passes.

### FR-024: Data sheets public list

- **Title:** Data sheets public list
- **Description:** The system shall support «Data sheets public list» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `datasheets/blog`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: datasheets/blog.
- **Proposed Implementation:** Module: content-mfe; API: GET /api/v1/data-sheets.
- **Acceptance Criteria:** Automated regression test TC-024 passes.

### FR-025: Blog list

- **Title:** Blog list
- **Description:** The system shall support «Blog list» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `blog`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: blog.
- **Proposed Implementation:** Module: content-mfe; API: GET /api/v1/blogs.
- **Acceptance Criteria:** Automated regression test TC-025 passes.

### FR-026: Blog detail

- **Title:** Blog detail
- **Description:** The system shall support «Blog detail» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `readBlog`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: readBlog.
- **Proposed Implementation:** Module: content-mfe; API: GET /api/v1/blogs/{id}.
- **Acceptance Criteria:** Automated regression test TC-026 passes.

### FR-027: News list

- **Title:** News list
- **Description:** The system shall support «News list» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `news, viewNews`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: news, viewNews.
- **Proposed Implementation:** Module: content-mfe; API: GET /api/v1/news.
- **Acceptance Criteria:** Automated regression test TC-027 passes.

### FR-028: News detail

- **Title:** News detail
- **Description:** The system shall support «News detail» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `newsDetail`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: newsDetail.
- **Proposed Implementation:** Module: content-mfe; API: GET /api/v1/news/{id}.
- **Acceptance Criteria:** Automated regression test TC-028 passes.

### FR-029: Gallery view page

- **Title:** Gallery view page
- **Description:** The system shall support «Gallery view page» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `galleryView`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: galleryView.
- **Proposed Implementation:** Module: content-mfe; API: GET /api/v1/galleries/{id}.
- **Acceptance Criteria:** Automated regression test TC-029 passes.

### FR-030: Careers listing

- **Title:** Careers listing
- **Description:** The system shall support «Careers listing» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `career`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: career.
- **Proposed Implementation:** Module: careers-mfe; API: GET /api/v1/jobs.
- **Acceptance Criteria:** Automated regression test TC-030 passes.

### FR-031: Career overview

- **Title:** Career overview
- **Description:** The system shall support «Career overview» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `overview`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: overview.
- **Proposed Implementation:** Module: careers-mfe; API: GET /api/v1/pages/careers-overview.
- **Acceptance Criteria:** Automated regression test TC-031 passes.

### FR-032: Submit K Projects form

- **Title:** Submit K Projects form
- **Description:** The system shall support «Submit K Projects form» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `submitKProjects`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: submitKProjects.
- **Proposed Implementation:** Module: engagement-service; API: POST /api/v1/forms/k-projects.
- **Acceptance Criteria:** Automated regression test TC-032 passes.

### FR-033: Submit K Solutions form

- **Title:** Submit K Solutions form
- **Description:** The system shall support «Submit K Solutions form» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `submitKSolutions`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: submitKSolutions.
- **Proposed Implementation:** Module: engagement-service; API: POST /api/v1/forms/k-solutions.
- **Acceptance Criteria:** Automated regression test TC-033 passes.

### FR-034: Team management page

- **Title:** Team management page
- **Description:** The system shall support «Team management page» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `teammanagement`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: teammanagement.
- **Proposed Implementation:** Module: public-site; API: GET /api/v1/team.
- **Acceptance Criteria:** Automated regression test TC-034 passes.

### FR-035: Kran CSR section

- **Title:** Kran CSR section
- **Description:** The system shall support «Kran CSR section» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `krancsr`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: krancsr.
- **Proposed Implementation:** Module: public-site; API: GET /api/v1/pages/csr.
- **Acceptance Criteria:** Automated regression test TC-035 passes.

### FR-036: Kran Tech section

- **Title:** Kran Tech section
- **Description:** The system shall support «Kran Tech section» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `krantech`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: krantech.
- **Proposed Implementation:** Module: public-site; API: GET /api/v1/pages/tech.
- **Acceptance Criteria:** Automated regression test TC-036 passes.

### FR-037: Timeline display

- **Title:** Timeline display
- **Description:** The system shall support «Timeline display» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `timeline`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: timeline.
- **Proposed Implementation:** Module: content-mfe; API: GET /api/v1/timeline.
- **Acceptance Criteria:** Automated regression test TC-037 passes.

### FR-038: Banner rotation public

- **Title:** Banner rotation public
- **Description:** The system shall support «Banner rotation public» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `viewBanner`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: viewBanner.
- **Proposed Implementation:** Module: content-service; API: GET /api/v1/banners/active.
- **Acceptance Criteria:** Automated regression test TC-038 passes.

### FR-039: Testimonials public

- **Title:** Testimonials public
- **Description:** The system shall support «Testimonials public» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `viewTestimonial`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: viewTestimonial.
- **Proposed Implementation:** Module: content-service; API: GET /api/v1/testimonials.
- **Acceptance Criteria:** Automated regression test TC-039 passes.

### FR-040: CAPTCHA image for forms

- **Title:** CAPTCHA image for forms
- **Description:** The system shall support «CAPTCHA image for forms» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `captcha`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: captcha.
- **Proposed Implementation:** Module: auth-service; API: GET /api/v1/auth/captcha.
- **Acceptance Criteria:** Automated regression test TC-040 passes.

### FR-041: Coming soon placeholder

- **Title:** Coming soon placeholder
- **Description:** The system shall support «Coming soon placeholder» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `comingsoon`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: comingsoon.
- **Proposed Implementation:** Module: public-site; API: Static route /coming-soon.
- **Acceptance Criteria:** Automated regression test TC-041 passes.

### FR-042: Success message page

- **Title:** Success message page
- **Description:** The system shall support «Success message page» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `successMessage`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: successMessage.
- **Proposed Implementation:** Module: public-site; API: Route /success.
- **Acceptance Criteria:** Automated regression test TC-042 passes.

### FR-043: Admin dashboard

- **Title:** Admin dashboard
- **Description:** The system shall support «Admin dashboard» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `dashboard`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: dashboard.
- **Proposed Implementation:** Module: admin-mfe; API: GET /api/v1/admin/dashboard.
- **Acceptance Criteria:** Automated regression test TC-043 passes.

### FR-044: Admin side menu

- **Title:** Admin side menu
- **Description:** The system shall support «Admin side menu» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `sidemenu`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: sidemenu.
- **Proposed Implementation:** Module: admin-mfe; API: Client-side layout.
- **Acceptance Criteria:** Automated regression test TC-044 passes.

### FR-045: View contact requests

- **Title:** View contact requests
- **Description:** The system shall support «View contact requests» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `request`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: request.
- **Proposed Implementation:** Module: admin-mfe; API: GET /api/v1/admin/requests.
- **Acceptance Criteria:** Automated regression test TC-045 passes.

### FR-046: Solution requests admin

- **Title:** Solution requests admin
- **Description:** The system shall support «Solution requests admin» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `solRequest`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: solRequest.
- **Proposed Implementation:** Module: admin-mfe; API: GET /api/v1/admin/solution-requests.
- **Acceptance Criteria:** Automated regression test TC-046 passes.

### FR-047: Admin careers list

- **Title:** Admin careers list
- **Description:** The system shall support «Admin careers list» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `adminCareer`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: adminCareer.
- **Proposed Implementation:** Module: careers-service; API: GET /api/v1/admin/jobs.
- **Acceptance Criteria:** Automated regression test TC-047 passes.

### FR-048: Add career form

- **Title:** Add career form
- **Description:** The system shall support «Add career form» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `careerAdd`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: careerAdd.
- **Proposed Implementation:** Module: careers-service; API: GET /api/v1/admin/jobs/new.
- **Acceptance Criteria:** Automated regression test TC-048 passes.

### FR-049: Save job posting

- **Title:** Save job posting
- **Description:** The system shall support «Save job posting» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `saveJob`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: saveJob.
- **Proposed Implementation:** Module: careers-service; API: POST /api/v1/admin/jobs.
- **Acceptance Criteria:** Automated regression test TC-049 passes.

### FR-050: Edit job posting

- **Title:** Edit job posting
- **Description:** The system shall support «Edit job posting» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `editJob`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: editJob.
- **Proposed Implementation:** Module: careers-service; API: PUT /api/v1/admin/jobs/{id}.
- **Acceptance Criteria:** Automated regression test TC-050 passes.

### FR-051: Deactivate job

- **Title:** Deactivate job
- **Description:** The system shall support «Deactivate job» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `jobDeactivate`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: jobDeactivate.
- **Proposed Implementation:** Module: careers-service; API: PATCH /api/v1/admin/jobs/{id}/deactivate.
- **Acceptance Criteria:** Automated regression test TC-051 passes.

### FR-052: No vacancy mode

- **Title:** No vacancy mode
- **Description:** The system shall support «No vacancy mode» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `NoVacancy`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: NoVacancy.
- **Proposed Implementation:** Module: careers-service; API: PUT /api/v1/admin/jobs/no-vacancy.
- **Acceptance Criteria:** Automated regression test TC-052 passes.

### FR-053: Job applications list

- **Title:** Job applications list
- **Description:** The system shall support «Job applications list» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `jobApplications`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: jobApplications.
- **Proposed Implementation:** Module: careers-service; API: GET /api/v1/admin/applications.
- **Acceptance Criteria:** Automated regression test TC-053 passes.

### FR-054: Admin news create

- **Title:** Admin news create
- **Description:** The system shall support «Admin news create» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `adminNews create`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: adminNews create.
- **Proposed Implementation:** Module: content-service; API: POST /api/v1/admin/news.
- **Acceptance Criteria:** Automated regression test TC-054 passes.

### FR-055: Admin news update

- **Title:** Admin news update
- **Description:** The system shall support «Admin news update» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `adminNews update`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: adminNews update.
- **Proposed Implementation:** Module: content-service; API: PUT /api/v1/admin/news/{id}.
- **Acceptance Criteria:** Automated regression test TC-055 passes.

### FR-056: Admin news delete

- **Title:** Admin news delete
- **Description:** The system shall support «Admin news delete» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `adminNews delete`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: adminNews delete.
- **Proposed Implementation:** Module: content-service; API: DELETE /api/v1/admin/news/{id}.
- **Acceptance Criteria:** Automated regression test TC-056 passes.

### FR-057: Admin gallery group CRUD

- **Title:** Admin gallery group CRUD
- **Description:** The system shall support «Admin gallery group CRUD» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `adminGallery groups`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: adminGallery groups.
- **Proposed Implementation:** Module: media-service; API: CRUD /api/v1/admin/gallery-groups.
- **Acceptance Criteria:** Automated regression test TC-057 passes.

### FR-058: Admin gallery image CRUD

- **Title:** Admin gallery image CRUD
- **Description:** The system shall support «Admin gallery image CRUD» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `adminGallery images`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: adminGallery images.
- **Proposed Implementation:** Module: media-service; API: CRUD /api/v1/admin/gallery-images.
- **Acceptance Criteria:** Automated regression test TC-058 passes.

### FR-059: Admin Kran projects CRUD

- **Title:** Admin Kran projects CRUD
- **Description:** The system shall support «Admin Kran projects CRUD» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `adminKranProjects`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: adminKranProjects.
- **Proposed Implementation:** Module: catalog-service; API: CRUD /api/v1/admin/kran-projects.
- **Acceptance Criteria:** Automated regression test TC-059 passes.

### FR-060: Admin Kran solutions CRUD

- **Title:** Admin Kran solutions CRUD
- **Description:** The system shall support «Admin Kran solutions CRUD» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `adminKranSolutions`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: adminKranSolutions.
- **Proposed Implementation:** Module: catalog-service; API: CRUD /api/v1/admin/kran-solutions.
- **Acceptance Criteria:** Automated regression test TC-060 passes.

### FR-061: Admin Kran seniors CRUD

- **Title:** Admin Kran seniors CRUD
- **Description:** The system shall support «Admin Kran seniors CRUD» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `adminKranSeniors`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: adminKranSeniors.
- **Proposed Implementation:** Module: catalog-service; API: CRUD /api/v1/admin/kran-seniors.
- **Acceptance Criteria:** Automated regression test TC-061 passes.

### FR-062: Admin Kran faces CRUD

- **Title:** Admin Kran faces CRUD
- **Description:** The system shall support «Admin Kran faces CRUD» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `adminKranFaces`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: adminKranFaces.
- **Proposed Implementation:** Module: catalog-service; API: CRUD /api/v1/admin/kran-faces.
- **Acceptance Criteria:** Automated regression test TC-062 passes.

### FR-063: Admin timeline CRUD

- **Title:** Admin timeline CRUD
- **Description:** The system shall support «Admin timeline CRUD» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `adminKranTimeline`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: adminKranTimeline.
- **Proposed Implementation:** Module: content-service; API: CRUD /api/v1/admin/timeline.
- **Acceptance Criteria:** Automated regression test TC-063 passes.

### FR-064: Project product CRUD

- **Title:** Project product CRUD
- **Description:** The system shall support «Project product CRUD» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `getProjectProduct`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: getProjectProduct.
- **Proposed Implementation:** Module: catalog-service; API: CRUD /api/v1/admin/project-products.
- **Acceptance Criteria:** Automated regression test TC-064 passes.

### FR-065: Banner admin CRUD

- **Title:** Banner admin CRUD
- **Description:** The system shall support «Banner admin CRUD» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `adminBanner`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: adminBanner.
- **Proposed Implementation:** Module: content-service; API: CRUD /api/v1/admin/banners.
- **Acceptance Criteria:** Automated regression test TC-065 passes.

### FR-066: Data sheets admin (blogs)

- **Title:** Data sheets admin (blogs)
- **Description:** The system shall support «Data sheets admin (blogs)» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `adminBlogs`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: adminBlogs.
- **Proposed Implementation:** Module: content-service; API: CRUD /api/v1/admin/data-sheets.
- **Acceptance Criteria:** Automated regression test TC-066 passes.

### FR-067: Case study admin

- **Title:** Case study admin
- **Description:** The system shall support «Case study admin» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `adminCase`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: adminCase.
- **Proposed Implementation:** Module: catalog-service; API: CRUD /api/v1/admin/case-studies.
- **Acceptance Criteria:** Automated regression test TC-067 passes.

### FR-068: Mail setup configuration

- **Title:** Mail setup configuration
- **Description:** The system shall support «Mail setup configuration» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `mailSetup`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: mailSetup.
- **Proposed Implementation:** Module: notification-service; API: PUT /api/v1/admin/mail-setup.
- **Acceptance Criteria:** Automated regression test TC-068 passes.

### FR-069: Category setup

- **Title:** Category setup
- **Description:** The system shall support «Category setup» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `categorySetup`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: categorySetup.
- **Proposed Implementation:** Module: catalog-service; API: CRUD /api/v1/admin/categories.
- **Acceptance Criteria:** Automated regression test TC-069 passes.

### FR-070: Comments moderation

- **Title:** Comments moderation
- **Description:** The system shall support «Comments moderation» with functional parity to the legacy Struts feature.
- **Priority:** Must
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `comments entity`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: comments entity.
- **Proposed Implementation:** Module: engagement-service; API: GET/DELETE /api/v1/admin/comments.
- **Acceptance Criteria:** Automated regression test TC-070 passes.

### FR-071: ESAPI-equivalent input validation

- **Title:** ESAPI-equivalent input validation
- **Description:** The system shall support «ESAPI-equivalent input validation» with functional parity to the legacy Struts feature.
- **Priority:** Should
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `ESAPI XSS filter`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: ESAPI XSS filter.
- **Proposed Implementation:** Module: api-gateway; API: WAF + validation middleware.
- **Acceptance Criteria:** Automated regression test TC-071 passes.

### FR-072: Microsoft Graph email send

- **Title:** Microsoft Graph email send
- **Description:** The system shall support «Microsoft Graph email send» with functional parity to the legacy Struts feature.
- **Priority:** Should
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `mail_setup + Graph`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: mail_setup + Graph.
- **Proposed Implementation:** Module: notification-service; API: POST /api/v1/notifications/email.
- **Acceptance Criteria:** Automated regression test TC-072 passes.

### FR-073: Multi-language readiness

- **Title:** Multi-language readiness
- **Description:** The system shall support «Multi-language readiness» with functional parity to the legacy Struts feature.
- **Priority:** Should
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `Not in legacy`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: Not in legacy.
- **Proposed Implementation:** Module: shell MFE; API: i18n resource bundles (future).
- **Acceptance Criteria:** Automated regression test TC-073 passes.

### FR-074: Accessibility WCAG 2.1 AA

- **Title:** Accessibility WCAG 2.1 AA
- **Description:** The system shall support «Accessibility WCAG 2.1 AA» with functional parity to the legacy Struts feature.
- **Priority:** Should
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `Rebuild goal`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: Rebuild goal.
- **Proposed Implementation:** Module: all MFEs; API: axe-core CI gate.
- **Acceptance Criteria:** Automated regression test TC-074 passes.

### FR-075: Audit admin mutations

- **Title:** Audit admin mutations
- **Description:** The system shall support «Audit admin mutations» with functional parity to the legacy Struts feature.
- **Priority:** Should
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `Operational`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: Operational.
- **Proposed Implementation:** Module: admin-service; API: Append-only audit log.
- **Acceptance Criteria:** Automated regression test TC-075 passes.

### FR-076: Rate limit public forms

- **Title:** Rate limit public forms
- **Description:** The system shall support «Rate limit public forms» with functional parity to the legacy Struts feature.
- **Priority:** Should
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `Anti-abuse`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: Anti-abuse.
- **Proposed Implementation:** Module: api-gateway; API: Per-IP rate limits on POST forms.
- **Acceptance Criteria:** Automated regression test TC-076 passes.

### FR-077: Health checks for deploy

- **Title:** Health checks for deploy
- **Description:** The system shall support «Health checks for deploy» with functional parity to the legacy Struts feature.
- **Priority:** Should
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `Ops`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: Ops.
- **Proposed Implementation:** Module: each microservice; API: GET /actuator/health.
- **Acceptance Criteria:** Automated regression test TC-077 passes.

### FR-078: Structured logging correlation

- **Title:** Structured logging correlation
- **Description:** The system shall support «Structured logging correlation» with functional parity to the legacy Struts feature.
- **Priority:** Should
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `Ops`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: Ops.
- **Proposed Implementation:** Module: all services; API: Trace ID in logs.
- **Acceptance Criteria:** Automated regression test TC-078 passes.

### FR-079: Backup/restore MariaDB

- **Title:** Backup/restore MariaDB
- **Description:** The system shall support «Backup/restore MariaDB» with functional parity to the legacy Struts feature.
- **Priority:** Should
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `Ops`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: Ops.
- **Proposed Implementation:** Module: DBA runbook; API: Nightly backup of kran_website.
- **Acceptance Criteria:** Automated regression test TC-079 passes.

### FR-080: Migration cutover plan

- **Title:** Migration cutover plan
- **Description:** The system shall support «Migration cutover plan» with functional parity to the legacy Struts feature.
- **Priority:** Should
- **Stakeholder / Source:** Legacy Struts action mapping
- **Actor(s):** Visitor or Admin as applicable
- **Preconditions:** Dependent services available.
- **Trigger:** User invokes feature equivalent to `Program`.
- **Main Flow:** Execute read or write operation; return UI or API response.
- **Alternate / Exception Flows:** Standard HTTP error handling; validation errors for writes.
- **Data Requirements:** See entity mapping in Database_Requirements.md
- **Existing Implementation (Struts 2):** Struts actions: Program.
- **Proposed Implementation:** Module: Release mgmt; API: Dual-run or big-bang documented.
- **Acceptance Criteria:** Automated regression test TC-080 passes.

## 5. Traceability note

See `Requirements_Traceability_Matrix.xlsx` for FR → module → API → service → test case mapping.

**Total functional requirements:** 80
