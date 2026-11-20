import { lazyPage as page } from '@/app/routes/lazyPage'
import { CAREERS_SECONDARY_NAV, WEBSITE_CAREERS_PRIMARY_ID } from '../constants/careersNav'

const overview = page(() => import('../pages/CareersServiceOverviewPage'))
const jobs = page(() => import('../pages/CareersJobsPage'))

const PAGE_BY_TAB = {
  overview,
  jobs,
}

export function buildCareersServicePages() {
  const pages = {}
  for (const tab of CAREERS_SECONDARY_NAV) {
    pages[`${WEBSITE_CAREERS_PRIMARY_ID}:${tab.id}`] =
      PAGE_BY_TAB[tab.id] ?? overview
  }
  return pages
}