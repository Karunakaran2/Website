import { lazyPage as page } from '@/app/routes/lazyPage'
import { MEDIA_SECONDARY_NAV, WEBSITE_MEDIA_PRIMARY_ID } from '../constants/mediaNav'

const overview = page(() => import('../pages/MediaServiceOverviewPage'))

export function buildMediaServicePages() {
  const pages = {}
  for (const tab of MEDIA_SECONDARY_NAV) {
    pages[`${WEBSITE_MEDIA_PRIMARY_ID}:${tab.id}`] = overview
  }
  return pages
}