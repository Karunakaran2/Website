# Open Questions

**Date:** 2026-11-04

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
