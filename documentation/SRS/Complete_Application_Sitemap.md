# Complete Application Sitemap

**Date:** 2026-11-04  
**Entry:** `welcome.action` / `yCIMVQ5RMbA.html`  
**Admin entry:** `admin.action` → `login.action` → `dashboard.action`

## 1. Site tree

```
KranConsulting (unified future shell)
├── Public (public-site + catalog-mfe + content-mfe + careers-mfe)
│   ├── Home (welcome)
│   ├── About (aboutus + anchors: quality, culture, awards, leadership, timeline, FAQ, …)
│   ├── Services (getService?val=*)
│   │   ├── consultancy
│   │   ├── software-development
│   │   ├── mobile-app-development
│   │   ├── project-product-implementation
│   │   ├── maintenance-support
│   │   └── porting-migration
│   ├── Solutions (allsolutions, solutions?val=<slug>)
│   ├── Projects (projects, readProject, projectDetail, kranps, kranss, mobile*)
│   ├── Domain (domain)
│   ├── Clients (clients)
│   ├── Case studies (casestudy, readCase, categorycase)
│   ├── Data sheets (datasheets, blog, readBlog)
│   ├── News (news, newsDetail, viewNews, viewNewsDesc)
│   ├── Gallery (gallery, galleryView, galleryAjax)
│   ├── Careers (overview, career, jobApply, jobOverview, successMessage)
│   ├── Team (teammanagement)
│   ├── CSR (krancsr)
│   ├── Technologies (krantech)
│   ├── Contact (contact)
│   ├── Enquiry flows (enquire, submitEnquiry, submitKProjects, submitKSolutions)
│   ├── Product landings (pfms360, hrms, …)
│   ├── Search (search, result)
│   └── Cookie consent (AJAX save/get)
└── Admin (admin-mfe, session required)
    ├── Dashboard (dashboard)
    ├── Requests (request, solRequest)
    ├── Careers (adminCareer, careerAdd, editJob, jobDeactivate, NoVacancy, jobApplications)
    ├── News (adminNews, newsAdd, editNews, newsDeactivate, readNews)
    ├── Data sheets (adminBlogs, blogAdd, editBlog, blogDeactivate, downloadBlogDoc)
    ├── Case studies (adminCase, caseAdd, editCase, caseDeactivate, downloadCaseDoc)
    ├── Gallery (adminGallery, groupAdd, groupView, galleryAdd, deleteImage, deactivateGroup)
    ├── Solutions portfolio (adminKranSolutions + add/edit/deactivate)
    ├── Timeline (adminKranTimeline + add/edit/deactivate)
    ├── Projects portfolio (adminKranProjects + add/edit/deactivate)
    ├── Product/Projects (getProjectProduct, ppAdd, editPP, deactivatePP, updateOrder)
    ├── Seniors (adminKranSeniors + CRUD/deactivate)
    ├── Faces (adminKranFaces + CRUD/deactivate)
    ├── Banners (adminBanner + CRUD/deactivate, updateBannerOrder)
    ├── Mail setup (mailSetup, mailAdd, editMail, mailDeactivate)
    └── Categories (categorySetup, categoryAdd, editCategory, categoryDeactivate)
```

## 2. Page registry (representative)

| Page ID | Page name | Module | Purpose | Roles | Struts action | MFE (proposed) |
|---------|-----------|--------|---------|-------|---------------|----------------|
| PG-001 | Dashboard | Admin CMS | View admin home, banner order widget | Admin | dashboard | admin-mfe |
| PG-002 | General requests | Admin CMS | List contacts type G | Admin | request | admin-mfe |
| PG-003 | Solution requests | Admin CMS | List all enquiry types | Admin | solRequest | admin-mfe |
| PG-004 | Careers | Admin CMS | Job CRUD | Admin | adminCareer | admin-mfe |
| PG-005 | No vacancy | Admin CMS | Global hiring message | Admin | NoVacancy | admin-mfe |
| PG-006 | Job applications | Admin CMS | Review applications, download resumes | Admin | jobApplications | admin-mfe |
| PG-007 | News/Events | Admin CMS | News CRUD, deactivate | Admin | adminNews | admin-mfe |
| PG-008 | Data sheets | Admin CMS | Blog entity CRUD (admin label Data Sheets) | Admin | adminBlogs | admin-mfe |
| PG-009 | Case studies | Admin CMS | Case study CRUD | Admin | adminCase | admin-mfe |
| PG-010 | Gallery | Admin CMS | Groups + images | Admin | adminGallery | admin-mfe |
| PG-011 | Kran solutions | Admin CMS | Portfolio solutions CRUD | Admin | adminKranSolutions | admin-mfe |
| PG-012 | Timeline | Admin CMS | Timeline CRUD | Admin | adminKranTimeline | admin-mfe |
| PG-013 | Kran projects | Admin CMS | Portfolio projects CRUD | Admin | adminKranProjects | admin-mfe |
| PG-014 | Product/Projects catalog | Admin CMS | project_product CRUD | Admin | getProjectProduct | admin-mfe |
| PG-015 | Kran seniors | Admin CMS | Senior profiles CRUD | Admin | adminKranSeniors | admin-mfe |
| PG-016 | Kran faces | Admin CMS | Faces CRUD | Admin | adminKranFaces | admin-mfe |
| PG-017 | Banners | Admin CMS | Banner CRUD, drag order | Admin | adminBanner | admin-mfe |
| PG-018 | Mail setup | Admin CMS | Routing emails by type | Admin | mailSetup | admin-mfe |
| PG-019 | Categories | Admin CMS | Category reference CRUD | Admin | categorySetup | admin-mfe |
| PG-020 | Home | Public | Landing, banners, testimonials | Public | welcome | public-site/catalog/content/careers |
| PG-021 | About | Public | Corporate about anchors | Public | aboutus | public-site/catalog/content/careers |
| PG-022 | Services | Public | Six service pages via val | Public | getService | public-site/catalog/content/careers |
| PG-023 | Solutions | Public | Product solution catalog | Public | solutions, allsolutions | public-site/catalog/content/careers |
| PG-024 | Projects | Public | Kran projects public | Public | projects, readProject, projectDetail | public-site/catalog/content/careers |
| PG-025 | Case studies | Public | Case listing/detail | Public | casestudy, readCase, categorycase | public-site/catalog/content/careers |
| PG-026 | Data sheets | Public | Blog/data sheets | Public | datasheets, blog, readBlog | public-site/catalog/content/careers |
| PG-027 | News | Public | News listing/detail | Public | news, newsDetail, viewNews | public-site/catalog/content/careers |
| PG-028 | Gallery | Public | Photo galleries | Public | gallery, galleryAjax, galleryView | public-site/catalog/content/careers |
| PG-029 | Careers | Public | Jobs and apply | Public | overview, career, jobApply | public-site/catalog/content/careers |
| PG-030 | Team | Public | Faces of KRAN | Public | teammanagement | public-site/catalog/content/careers |
| PG-031 | CSR | Public | CSR page | Public | krancsr | public-site/catalog/content/careers |
| PG-032 | Technologies | Public | Tech showcase | Public | krantech | public-site/catalog/content/careers |
| PG-033 | Contact | Public | Contact form | Public | contact, sendMsg | public-site/catalog/content/careers |
| PG-034 | Enquiries | Public | Product/project forms | Public | submitEnquiry, submitKProjects, submitKSolutions, enquire | public-site/catalog/content/careers |
| PG-035 | Search | Public | Site search | Public | search, result | public-site/catalog/content/careers |
| PG-036 | Cookie consent | Public | GA consent | Public | saveCookieConsent, getCookieConsent | public-site/catalog/content/careers |
| PG-037 | Admin login | Public | CMS login | Public | admin, login, logout | public-site/catalog/content/careers |

## 3. Orphan / weak-navigation routes (source-code observations)

| Route | Observation |
|-------|-------------|
| `comingsoon` | Under construction placeholder |
| `probity`, `snasparsh` | Commented out in login-config.xml |
| `mobilekranps`, `mobilekranss`, `mobiletech` | Parallel mobile JSPs — not in main desktop nav |
| `viewComments`, `addReply` | Blog comments — public; admin moderation link unclear |
| `product`, `krancs`, `kranprojects` (HTML) | Legacy HTML actions — verify redirects |

**Rule:** Do not remove until business confirms deprecation (Category E).
