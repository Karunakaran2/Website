# Business Workflows

**Date:** 2026-11-04

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
  B --> C{Validation OK?}
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
  K --> L{Vacancy open?}
  L -->|No| M[NoVacancy message]
  L -->|Yes| N[Upload resume + details]
  N --> O{File valid?}
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
  B --> A{Accept?}
  A -->|Yes| G[Load GA G-9T4S2N58MP]
  A -->|No| N[Functional cookies only]
  G --> P[Persist consent]
  N --> P
```
