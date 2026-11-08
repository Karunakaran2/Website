# Introduction and Purpose

## Purpose

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
