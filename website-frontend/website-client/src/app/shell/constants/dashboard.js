/**
 * KRAN Website CMS admin shell navigation (gold primary + white secondary).
 * Probity finance / master-setup menus are not part of this application.
 * Component Workbench and Design Guidelines remain available via the footer.
 */
import {
  WEBSITE_CMS_PRIMARY_NAV_ITEMS,
  getWebsiteCmsDefaultSecondary,
  getWebsiteCmsSecondaryNav,
  isWebsiteCmsPrimary,
} from '@/domain/website-cms/constants/websiteCmsNav'
import {
  COMPONENT_LIBRARY_PRIMARY_NAV_ITEMS,
  DESIGN_GUIDELINES_PRIMARY_NAV_ITEMS,
  WORKBENCH_PRIMARY_NAV_ITEMS,
  getDeveloperDefaultSecondaryTabId,
  getDeveloperPrimaryNavItems,
  getDeveloperSecondaryNavItems,
  isComponentLibraryPrimary,
  isDesignGuidelinesPrimary,
  isDeveloperShellPrimary,
  isExplorerPrimary,
  isWorkbenchPrimary,
} from '@/app/shell/constants/developerShellNav'

export { isWebsiteCmsPrimary, isWorkbenchPrimary, isDesignGuidelinesPrimary }
export { isExplorerPrimary, isComponentLibraryPrimary }
export {
  WORKBENCH_PRIMARY_NAV_ITEMS,
  DESIGN_GUIDELINES_PRIMARY_NAV_ITEMS,
  COMPONENT_LIBRARY_PRIMARY_NAV_ITEMS,
}

export const DEFAULT_PRIMARY_NAV_ID = 'website-dashboard'
export const DEFAULT_SECONDARY_NAV_ID = 'overview'

/** Legacy ids kept so stale imports do not break; always treated as inactive. */
export const SETUP_HOME_ID = 'setup-home'
export const ASSET_ID = 'asset'
export const SETUP_COMPANY_ID = 'company-setup'
export const SETUP_PRIMARY_NAV_ITEMS = []
export const ASSET_MANAGEMENT_PRIMARY_NAV_ITEMS = []
export const PRIMARY_NAV_ITEMS = []

export const DEFAULT_ASSET_APPROVAL_WORKFLOW_TAB_ID = 'received'

export function isSetupPrimary() {
  return false
}

export function isSetupModulePrimary() {
  return false
}

export function isAdministrationPrimary() {
  return false
}

export function isAssetManagementPrimary() {
  return false
}

export function isWorkforcePrimary() {
  return false
}

export function isHrmsPrimary() {
  return false
}

export function isTaskManagementPrimary() {
  return false
}

export function isSampleModulePrimary() {
  return false
}

export function isExtendedPrimary() {
  return false
}

export function getPrimaryNavItems(primaryNavId) {
  if (isDeveloperShellPrimary(primaryNavId)) {
    return getDeveloperPrimaryNavItems(primaryNavId)
  }
  return WEBSITE_CMS_PRIMARY_NAV_ITEMS
}

export function getSecondaryNavItems(primaryNavId) {
  if (isDeveloperShellPrimary(primaryNavId)) {
    return getDeveloperSecondaryNavItems(primaryNavId)
  }
  if (isWebsiteCmsPrimary(primaryNavId)) {
    return getWebsiteCmsSecondaryNav(primaryNavId)
  }
  return getWebsiteCmsSecondaryNav(DEFAULT_PRIMARY_NAV_ID)
}

export function getDefaultSecondaryTabId(primaryNavId) {
  if (isDeveloperShellPrimary(primaryNavId)) {
    return getDeveloperDefaultSecondaryTabId(primaryNavId)
  }
  if (isWebsiteCmsPrimary(primaryNavId)) {
    return getWebsiteCmsDefaultSecondary(primaryNavId)
  }
  return getWebsiteCmsDefaultSecondary(DEFAULT_PRIMARY_NAV_ID)
}

export function isSecondaryTabValid(primaryNavId, secondaryTabId) {
  return getSecondaryNavItems(primaryNavId).some((tab) => tab.id === secondaryTabId)
}

export function isPrimaryNavValid(primaryNavId) {
  return isWebsiteCmsPrimary(primaryNavId) || isDeveloperShellPrimary(primaryNavId)
}

export function resolveDashboardNavIds(primaryTab, secondaryTab) {
  const primaryId =
    primaryTab && isPrimaryNavValid(primaryTab) ? primaryTab : DEFAULT_PRIMARY_NAV_ID
  const secondaryId =
    secondaryTab && isSecondaryTabValid(primaryId, secondaryTab)
      ? secondaryTab
      : getDefaultSecondaryTabId(primaryId)
  return { primaryId, secondaryId }
}