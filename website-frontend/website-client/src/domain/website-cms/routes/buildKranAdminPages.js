import { lazyPage as page } from '@/app/routes/lazyPage'
import {
  KRAN_ADMIN_PRIMARY_IDS,
  getKranAdminSecondaryNav,
} from '../constants/kranAdminNav'

const standardAdmin = () => import('../pages/CmsStandardAdminPage')

const LIVE_PAGE_IMPORTS = {
  'website-dashboard:overview': () => import('../pages/WebsiteCmsDashboard'),
  'website-engagement:request': () => import('@/domain/website-engagement/pages/EngagementContactsPage'),
  'website-engagement:solution-request': () =>
    import('@/domain/website-engagement/pages/EngagementContactsPage'),
  'website-content:news': () => import('@/domain/website-content/pages/ContentNewsPage'),
  'website-content:banner': () => import('@/domain/website-content/pages/ContentBannersPage'),
  'website-content:data-sheets': standardAdmin,
  'website-content:timeline': standardAdmin,
  'website-catalog:case-study': standardAdmin,
  'website-catalog:solutions': standardAdmin,
  'website-catalog:projects': standardAdmin,
  'website-catalog:products': standardAdmin,
  'website-catalog:kran-seniors': standardAdmin,
  'website-catalog:kran-faces': standardAdmin,
  'website-catalog:category-setup': standardAdmin,
  'website-media:gallery': standardAdmin,
  'website-careers:no-vacancy': standardAdmin,
  'website-careers:job-applications': () =>
    import('@/domain/website-careers/pages/CareersJobApplicationsPage'),
  'website-notification:mail-setup': standardAdmin,
  'website-administration:user-setup': () =>
    import('@/domain/website-access/pages/AdminUserSetupPage'),
  'website-administration:roles': () => import('@/domain/website-access/pages/AdminRoleSetupPage'),
}

/** Dashboard page registry — category primary + submenu secondary. */
export function buildKranAdminPages() {
  const pages = {}

  for (const primaryId of KRAN_ADMIN_PRIMARY_IDS) {
    for (const tab of getKranAdminSecondaryNav(primaryId)) {
      const key = `${primaryId}:${tab.id}`
      const loader = LIVE_PAGE_IMPORTS[key]
      if (loader) {
        pages[key] = page(loader)
      }
    }
  }

  return pages
}