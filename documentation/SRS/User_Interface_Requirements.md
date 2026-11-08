# User Interface Requirements

**Date:** 2026-11-04

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
