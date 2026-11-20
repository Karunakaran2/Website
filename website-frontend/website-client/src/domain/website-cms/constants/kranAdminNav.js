/**
 * KRAN Admin: category (gold) + submenu (white).
 * Routes: `/{categoryPrimaryId}/{submenuId}`.
 */
import { WEBSITE_DASHBOARD_PRIMARY_ID } from './websiteDashboardNav'
import { KRAN_ADMIN_SERVICE } from './kranAdminServices'

/** @typedef {{ id: string, label: string, serviceId?: string }} KranAdminNavItem */

/** Gold nav — module categories only. */
export const KRAN_ADMIN_PRIMARY_NAV = [
  { id: WEBSITE_DASHBOARD_PRIMARY_ID, label: 'Home', serviceId: KRAN_ADMIN_SERVICE.DASHBOARD },
  { id: 'website-engagement', label: 'Enquiries', serviceId: KRAN_ADMIN_SERVICE.ENGAGEMENT },
  { id: 'website-content', label: 'Content', serviceId: KRAN_ADMIN_SERVICE.CONTENT },
  { id: 'website-catalog', label: 'Catalog', serviceId: KRAN_ADMIN_SERVICE.CATALOG },
  { id: 'website-media', label: 'Media', serviceId: KRAN_ADMIN_SERVICE.MEDIA },
  { id: 'website-careers', label: 'Career', serviceId: KRAN_ADMIN_SERVICE.CAREERS },
  { id: 'website-notification', label: 'Mail Setup', serviceId: KRAN_ADMIN_SERVICE.NOTIFICATION },
  { id: 'website-administration', label: 'Administration', serviceId: KRAN_ADMIN_SERVICE.AUTH },
]

/** White sub-nav per category (`label` is English fallback; use i18n `nav.secondary.*`). */
export const KRAN_ADMIN_SECONDARY_BY_PRIMARY = {
  [WEBSITE_DASHBOARD_PRIMARY_ID]: [{ id: 'overview', label: 'Overview' }],
  'website-engagement': [
    { id: 'request', label: 'Request' },
    { id: 'solution-request', label: 'Solution Request' },
  ],
  'website-content': [
    { id: 'news', label: 'News / Events' },
    { id: 'data-sheets', label: 'Data Sheets' },
    { id: 'banner', label: 'Banner' },
    { id: 'timeline', label: 'Timeline' },
  ],
  'website-catalog': [
    { id: 'case-study', label: 'Case Study' },
    { id: 'solutions', label: 'Solutions' },
    { id: 'projects', label: 'Projects' },
    { id: 'products', label: 'Product / Projects' },
    { id: 'kran-seniors', label: 'Kran Seniors' },
    { id: 'kran-faces', label: 'Kran Faces' },
    { id: 'category-setup', label: 'Category Setup' },
  ],
  'website-media': [{ id: 'gallery', label: 'Gallery' }],
  'website-careers': [
    { id: 'no-vacancy', label: 'No Vacancy' },
    { id: 'job-applications', label: 'Job Applications' },
  ],
  'website-notification': [{ id: 'mail-setup', label: 'Mail Setup' }],
  'website-administration': [
    { id: 'user-setup', label: 'User setup' },
    { id: 'roles', label: 'Roles & privileges' },
  ],
}

export const KRAN_ADMIN_PRIMARY_IDS = KRAN_ADMIN_PRIMARY_NAV.map((item) => item.id)

export function getKranAdminSecondaryNav(primaryId) {
  return KRAN_ADMIN_SECONDARY_BY_PRIMARY[primaryId] ?? []
}

export function getKranAdminDefaultSecondary(primaryId) {
  const tabs = getKranAdminSecondaryNav(primaryId)
  return tabs[0]?.id ?? 'overview'
}

/** Maps route ids → CMS resource registry key (CRUD screens). */
export function resolveKranAdminResourceKey(primaryId, secondaryId) {
  if (!primaryId || !secondaryId) {
    return null
  }
  if (primaryId === 'website-careers' && secondaryId === 'no-vacancy') {
    return 'website-careers'
  }
  if (primaryId === 'website-notification' && secondaryId === 'mail-setup') {
    return 'website-mail-setup'
  }
  const direct = `website-${secondaryId}`
  if (
    primaryId === 'website-catalog' ||
    primaryId === 'website-content' ||
    primaryId === 'website-media'
  ) {
    return direct
  }
  return null
}

/** Engagement category for contact inbox. */
export const KRAN_ADMIN_CONTACTS_PRIMARY = 'website-engagement'