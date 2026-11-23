import { buildWebsiteServicePages } from '@/domain/website/routes/buildWebsiteServicePages'
import { componentWorkbenchPages } from '@/domain/component-workbench/routes'
import { designGuidelinesPages } from '@/domain/design-guidelines/routes'

const websiteServicePages = buildWebsiteServicePages()

/** CMS admin pages plus developer footer destinations (workbench, guidelines). */
export const DASHBOARD_PAGE_REGISTRY = {
  ...websiteServicePages,
  ...componentWorkbenchPages,
  ...designGuidelinesPages,
}

export function resolveDashboardPage(primaryId, secondaryId) {
  return DASHBOARD_PAGE_REGISTRY[`${primaryId}:${secondaryId}`] ?? null
}