import { lazyPage as page } from '@/app/routes/lazyPage'
import { CATALOG_SECONDARY_NAV, WEBSITE_CATALOG_PRIMARY_ID } from '../constants/catalogNav'

const overview = page(() => import('../pages/CatalogServiceOverviewPage'))
const products = page(() => import('../pages/CatalogProductsPage'))
const services = page(() => import('../pages/CatalogServicesPage'))
const solutions = page(() => import('../pages/CatalogSolutionsPage'))

const PAGE_BY_TAB = {
  overview,
  products,
  services,
  solutions,
}

export function buildCatalogServicePages() {
  const pages = {}
  for (const tab of CATALOG_SECONDARY_NAV) {
    pages[`${WEBSITE_CATALOG_PRIMARY_ID}:${tab.id}`] =
      PAGE_BY_TAB[tab.id] ?? overview
  }
  return pages
}