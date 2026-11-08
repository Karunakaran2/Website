# Requirements Traceability Matrix (workspace index)

| SRS artifact | Location |
|--------------|----------|
| Master SRS (MD) | `documentation/SRS/KranConsulting_SRS_MASTER.md` |
| DOCX / PDF | `documentation/SRS/KranConsulting_SRS.docx`, `.pdf` |
| Excel RTM | `documentation/SRS/Requirements_Traceability_Matrix.xlsx` |
| Functional | `documentation/SRS/Functional_Requirements.md` |
| API | `documentation/SRS/API_Requirements.md` |
| Database | `documentation/SRS/Database_Requirements.md` |

## Implementation mapping (foundation phase)

| SRS area | Frontend MFE | Backend service | DB schema | Status |
|----------|--------------|-----------------|-----------|--------|
| Admin auth | admin-mfe | auth-service | auth | Skeleton only |
| Public catalog | catalog-mfe | catalog-service | catalog | Skeleton only |
| Content / CMS | content-mfe, admin-mfe | content-service | content | Skeleton only |
| Media | admin-mfe | media-service | media | Skeleton only |
| Careers | careers-mfe | careers-service | careers | Skeleton only |
| Contact / enquiry | public-site | engagement-service | engagement | Skeleton only |
| Notifications | — | notification-service | notification | Skeleton only |
| Unified shell | shell | api-gateway | — | Gateway routes partial |

Update this table as features reach “implemented” with links to PRs or modules.
