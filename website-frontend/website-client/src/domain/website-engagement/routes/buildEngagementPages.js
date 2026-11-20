import { lazyPage as page } from '@/app/routes/lazyPage'
import { ENGAGEMENT_SECONDARY_NAV, WEBSITE_ENGAGEMENT_PRIMARY_ID } from '../constants/engagementNav'

const overview = page(() => import('../pages/EngagementServiceOverviewPage'))
const contacts = page(() => import('../pages/EngagementContactsPage'))

const PAGE_BY_TAB = {
  overview,
  contacts,
}

export function buildEngagementServicePages() {
  const pages = {}
  for (const tab of ENGAGEMENT_SECONDARY_NAV) {
    pages[`${WEBSITE_ENGAGEMENT_PRIMARY_ID}:${tab.id}`] =
      PAGE_BY_TAB[tab.id] ?? overview
  }
  return pages
}