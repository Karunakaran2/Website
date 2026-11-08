# Migration and Implementation Roadmap

**Date:** 2026-11-04 | No dates assigned — dependency order only.

| Phase | Activities |
|-------|------------|
| 1 | SRS review, open question resolution, architecture sign-off |
| 2 | Design system + shell MFE + API Gateway skeleton |
| 3 | auth-service, notification-service (Graph), reference data |
| 4 | content-service + public news/gallery/banner MFE routes |
| 5 | catalog-service + solutions/projects MFE (largest content migration) |
| 6 | careers-service + engagement-service + forms |
| 7 | admin-mfe feature parity with SideMenu modules |
| 8 | URL redirects from `.action` to SPA routes; SEO validation |
| 9 | SIT, security/performance testing, UAT |
| 10 | Production cutover (phased strangler recommended — see OQ-010) |

**Dependencies:** Auth before admin MFE; media-service before gallery; notification-service before form go-live.
