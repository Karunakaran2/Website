import { lazyPage as page } from '@/app/routes/lazyPage'
import { WEBSITE_DASHBOARD_PRIMARY_ID, WEBSITE_DASHBOARD_SECONDARY_NAV } from '../constants/websiteDashboardNav'

const dashboard = page(() => import('../pages/WebsiteCmsDashboard'))

export function buildWebsiteDashboardPages() {
  const pages = {}
  for (const tab of WEBSITE_DASHBOARD_SECONDARY_NAV) {
    pages[`${WEBSITE_DASHBOARD_PRIMARY_ID}:${tab.id}`] = dashboard
  }
  return pages
}