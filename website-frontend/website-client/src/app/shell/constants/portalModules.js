import {
  isDesignGuidelinesPrimary,
  isSampleModulePrimary,
  isWorkbenchPrimary,
  isWorkforcePrimary,
} from './dashboard'
import { getModuleRoute } from '@/shared/constants'

/**
 * Portal module definitions.
 * Landing page shows business demo modules only; developer areas use footer links.
 */

export const PORTAL_MODULE_1 = {
  id: 'module-1',
  moduleNumber: '01',
  title: 'Module 1',
  label: 'Module 1',
  shortTitle: 'Module 1',
  description: 'Enterprise Reference • Business Workflows',
  fullDescription:
    'Comprehensive enterprise reference for forms, data management, applications, approvals, documents, and reporting patterns used in finance, PF, and processing systems.',
  status: 'Active',
  statusVariant: 'success',
  iconType: 'calculator',
  path: () => getModuleRoute('m1-overview', 'dashboard'),
  isActive: (id) => isSampleModulePrimary(id),
  available: true,
}

export const PORTAL_MODULE_2 = {
  id: 'module-2',
  moduleNumber: '02',
  title: 'Module 2',
  label: 'Module 2',
  shortTitle: 'Module 2',
  description: 'Employee Directory • Tasks • Operational Workflows',
  fullDescription:
    'Workforce, leave, attendance-style patterns, task and Kanban workflows, case management, and operational reporting for HRMS and team-centric applications.',
  status: 'Operational',
  statusVariant: 'info',
  iconType: 'users',
  path: () => getModuleRoute('m2-overview', 'dashboard'),
  isActive: (id) => isWorkforcePrimary(id),
  available: true,
}

/** Primary business modules on `/home` (post seat selection). */
export const PORTAL_LANDING_MODULES = [PORTAL_MODULE_1, PORTAL_MODULE_2]

/** Developer / standards areas linked from the application footer. */
export const PORTAL_FOOTER_MODULES = [
  {
    id: 'workbench',
    title: 'Component Workbench',
    shortTitle: 'Component Workbench',
    description: 'Reusable Components • Tokens • Specs',
    path: () => getModuleRoute('overview', 'module-overview'),
    isActive: (id) => isWorkbenchPrimary(id),
  },
  {
    id: 'guidelines',
    title: 'Design Guidelines',
    shortTitle: 'Design Guidelines',
    description: 'Gov & WCAG 2.2 AA Standards',
    path: () => getModuleRoute('guide-principles', 'overview'),
    isActive: (id) => isDesignGuidelinesPrimary(id),
  },
]

/**
 * All portal entry paths that must resolve via DASHBOARD_PAGE_REGISTRY (tests).
 * Administration is reached via the header Setup icon — not a landing card.
 */
export const PORTAL_MODULES = [...PORTAL_LANDING_MODULES, ...PORTAL_FOOTER_MODULES]
