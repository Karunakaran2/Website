import {
  KRAN_ADMIN_PRIMARY_NAV,
  KRAN_ADMIN_PRIMARY_IDS,
  getKranAdminDefaultSecondary,
  getKranAdminSecondaryNav,
} from './kranAdminNav'

export const WEBSITE_CMS_PRIMARY_NAV_ITEMS = KRAN_ADMIN_PRIMARY_NAV

export const WEBSITE_CMS_PRIMARY_IDS = KRAN_ADMIN_PRIMARY_IDS

export function isWebsiteCmsPrimary(primaryNavId) {
  return KRAN_ADMIN_PRIMARY_IDS.includes(primaryNavId)
}

export const WEBSITE_CMS_WORKSPACE_PRIMARIES = KRAN_ADMIN_PRIMARY_NAV.filter(
  (item) => item.id !== 'website-dashboard',
)

export function getWebsiteCmsSecondaryNav(primaryNavId) {
  return getKranAdminSecondaryNav(primaryNavId)
}

export function getWebsiteCmsDefaultSecondary(primaryNavId) {
  return getKranAdminDefaultSecondary(primaryNavId)
}