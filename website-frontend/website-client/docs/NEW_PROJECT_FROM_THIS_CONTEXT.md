# New KRAN project — start from this context

**Primary strategy for upcoming projects.**  
Micro Frontends and npm UI packages are **optional later**; the default is **use this repository as the full frontend starting point**, then modify for the product.

---

## 1. Ultimate idea (one paragraph)

Everything important is **already in this context**: application shell, header, nav, inbox, login UI patterns, list + modal CRUD samples (Module 1/2), administration demos, shared DataTable/forms/modals, routing registry, Redux/RTK layout, i18n, accessibility bar, confirms, toasts. **New developers clone or fork this project**, connect **their backend APIs**, adjust **login and flows** per client instructions, and add/remove domain modules — **not** rebuild layout or design from scratch.

---

## 2. What new developers get on day 0

| Already there | Project team customizes |
|---------------|-------------------------|
| `src/shared/components` — full UI kit | Visual tweaks, extra variants if client asks |
| `src/app/shell` — header, nav, footer, page header | Module list, branding, labels |
| Inbox / home landing patterns | Real inbox API, tiles for that product |
| `domain/auth` — login, seats, profile **examples** | **Replace/wire** auth to project backend (any flow) |
| Module 1 & 2 — sample list, forms, tables, modals | Rename/replace with real business domains |
| `loadDomainPages.js` registry pattern | Register new tabs; delete unused demos |
| RTK `baseApi` + domain `*Api.js` examples | Implement real endpoints in same pattern |
| Mock API (`VITE_MOCK_API`) for local dev | Turn off mock; point env to real services |
| Design Guidelines + Component Workbench | Internal reference for the team |

**Workload is lower** because structure and UI patterns exist; effort goes to **APIs, auth rules, and client-specific screens**.

---

## 3. Recommended workflow for a new project

```
1. Create new repo from this template
   • Fork/clone design-system (or KRAN-approved snapshot tag)
   • Rename app title, env, VITE_PUBLIC_URL for that deployment

2. Configure environment
   • VITE_API_BASE_URL, auth URLs, feature flags
   • VITE_MOCK_API=false when backend is ready

3. Auth (project-owned — no fixed flow)
   • Keep or replace src/domain/auth
   • Wire login/logout/refresh to project APIs
   • Keep or drop seats/switch — only if backend supports same model
   • Use shared form/layout components for consistent look

4. Replace mock data with real APIs
   • Follow existing *Api.js injectEndpoints pattern under src/domain/<module>/services/
   • Keep list + modal + confirm patterns from Module 1/2 / Administration

5. Trim and grow modules
   • Remove demo routes client does not need (workbench optional for prod)
   • Copy Module 1 screen as template for new CRUD domain
   • Register paths in domain routes/index.js + loadDomainPages.js

6. Client-driven changes
   • Edit components and flows in this repo — no npm package release cycle
   • Optionally merge UI fixes back into design-system reference over time
```

---

## 4. Where developers “write API in this context”

| Layer | Location |
|-------|----------|
| HTTP client | `src/shared/api/client.js`, `baseApi.js` |
| Auth endpoints | `src/domain/auth/services/authApi.js` (adapt or replace) |
| Domain CRUD | `src/domain/<module>/services/*Api.js` |
| Mock (dev only) | `src/shared/api/mock/mockRouter.js` — mirror real routes while backend lags |
| Hooks | `use*Data.js`, RTK queries in screens |

Screens stay **Module 1/2 style**: `*Screen.jsx` + `DataTable` + `DomainListWithFormModal` + `showAppToast`.

---

## 5. What to keep vs remove per project

| Often keep | Often remove or hide in prod |
|------------|------------------------------|
| Shell, shared components, registry | Component Workbench (optional internal) |
| One sample module as copy template | Second sample module if unused |
| Administration if product needs setup/asset | Finance parity tabs if not relevant |
| Inbox if product has workflow inbox | Mock credentials panel on login |

Product owner decides; **do not delete** until routes and nav are updated.

---

## 6. Relation to MFE and packages

| Approach | When |
|----------|------|
| **This template (default)** | Every new project starts here; single SPA is fine |
| **MFE split later** | Only if one program needs separate deploy of a large domain |
| **npm UI package** | **Not required** — teams edit `src/shared` in their fork |

See [MFE_WITHOUT_PACKAGES_PLAN.md](./MFE_WITHOUT_PACKAGES_PLAN.md) if a program outgrows one repo.

---

## 7. Design-system repo role after projects fork

- **Reference** — latest kit and patterns; teams diff/merge when useful  
- **Portal** — `/design-system/` demo on Galaxy  
- **Not** — a runtime dependency every app must npm-install  

---

## 8. Checklist for project lead (hand to new developers)

- [ ] Repo created from design-system template tag  
- [ ] Env files set for dev/UAT/prod API  
- [ ] Auth wired to project backend; login flow documented in project README  
- [ ] Mock API disabled for integrated environments  
- [ ] Nav modules match product (`portalModules.js`, registry)  
- [ ] At least one domain module uses real APIs end-to-end (list + form)  
- [ ] Unused demo routes removed or gated  
- [ ] Client branding (logo, title) applied  

---

## 9. Related docs

- [DEVELOPER_ONBOARDING.md](./DEVELOPER_ONBOARDING.md)  
- [MODULE_DEVELOPMENT_GUIDE.md](./MODULE_DEVELOPMENT_GUIDE.md)  
- [SHARED_COMPONENTS.md](./SHARED_COMPONENTS.md)  
- [MFE_WITHOUT_PACKAGES_PLAN.md](./MFE_WITHOUT_PACKAGES_PLAN.md)
