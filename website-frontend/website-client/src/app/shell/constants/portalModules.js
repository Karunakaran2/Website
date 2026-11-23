import { isDesignGuidelinesPrimary, isWorkbenchPrimary } from './dashboard'
import { getModuleRoute } from '@/shared/constants'

/**
 * KRAN Website CMS has no design-system module cards on `/home`.
 * Administration is reached from the gold primary nav, not landing cards.
 */

export const PORTAL_LANDING_MODULES = []

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

export const PORTAL_MODULES = [...PORTAL_LANDING_MODULES, ...PORTAL_FOOTER_MODULES]