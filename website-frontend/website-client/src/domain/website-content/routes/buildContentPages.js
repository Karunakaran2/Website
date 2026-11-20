import { lazyPage as page } from '@/app/routes/lazyPage'
import { CONTENT_SECONDARY_NAV, WEBSITE_CONTENT_PRIMARY_ID } from '../constants/contentNav'

const overview = page(() => import('../pages/ContentServiceOverviewPage'))
const news = page(() => import('../pages/ContentNewsPage'))
const banners = page(() => import('../pages/ContentBannersPage'))

const PAGE_BY_TAB = {
  overview,
  news,
  banners,
}

export function buildContentServicePages() {
  const pages = {}
  for (const tab of CONTENT_SECONDARY_NAV) {
    pages[`${WEBSITE_CONTENT_PRIMARY_ID}:${tab.id}`] =
      PAGE_BY_TAB[tab.id] ?? overview
  }
  return pages
}