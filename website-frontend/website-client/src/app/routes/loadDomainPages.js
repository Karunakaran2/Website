import { lazyPage as page } from '@/app/routes/lazyPage'
import { dashboardPages } from '@/domain/dashboard/routes'
import { componentWorkbenchPages } from '@/domain/component-workbench/routes'
import { designGuidelinesPages } from '@/domain/design-guidelines/routes'
import { workforceManagementPages } from '@/domain/module-2/routes'
import { sampleModulePages } from '@/domain/module-1/routes'
import { administrationPages } from '@/domain/administration/routes'

/**
 * Host composition of domain page remotes.
 * Standard KRAN Design System Portal registry of active design and reference modules.
 */
export const DASHBOARD_PAGE_REGISTRY = {
  ...sampleModulePages,
  ...administrationPages,
  ...componentWorkbenchPages,
  ...designGuidelinesPages,
  ...workforceManagementPages,
  ...dashboardPages,
  'inbox:overview': page(() => import('@/app/shell/pages/inbox/InboxOverviewPage')),
}

export function resolveDashboardPage(primaryId, secondaryId) {
  return DASHBOARD_PAGE_REGISTRY[`${primaryId}:${secondaryId}`] ?? null
}
