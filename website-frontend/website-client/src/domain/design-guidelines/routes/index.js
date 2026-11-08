import { lazyPage as page } from '@/app/routes/lazyPage'

export const designGuidelinesPages = {
  'guide-principles:overview': page(() => import('../pages/DesignPrinciplesPage')),
  'guide-tokens:overview': page(() => import('../pages/DesignTokensPage')),
  'guide-standards:overview': page(() => import('../pages/StandardsGuidelinesPage')),
  'guide-layout:overview': page(() => import('../pages/PageLayoutGuidelinesPage')),
  'guide-datatable:overview': page(() => import('../pages/DataTableGuidelinesPage')),
  'guide-feedback:overview': page(() => import('../pages/InteractionFeedbackGuidelinesPage')),
  'guide-architecture:overview': page(() => import('../pages/ArchitectureMfePage')),
  'guide-accessibility:overview': page(() => import('../pages/AccessibilityStandardsPage')),
}
