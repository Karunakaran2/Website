import {
  getModuleRoute,
  getSetupModuleRoute,
  parseModulePath,
  isPrimaryTabActive,
} from '@/shared/constants/moduleRoutes'
import { ROUTES } from '@/shared/constants'
import { getDefaultSecondaryTabId } from '../constants/dashboard'

export { parseModulePath, isPrimaryTabActive }

/** @deprecated Use parseModulePath */
export function parseDashboardPath(pathname) {
  return parseModulePath(pathname)
}

/**
 * Returns clean path for primary navigation.
 * Signature supports both getPrimaryNavTo(primaryId) and legacy getPrimaryNavTo(accountId, primaryId).
 */
export function getPrimaryNavTo(primaryOrAccountId, primaryId) {
  const resolvedPrimary = primaryId !== undefined ? primaryId : primaryOrAccountId
  return getModuleRoute(resolvedPrimary, getDefaultSecondaryTabId(resolvedPrimary))
}

/**
 * Returns clean path for secondary navigation.
 * Signature supports:
 * - getSecondaryNavTo(primaryId, secondaryId)
 * - legacy getSecondaryNavTo(accountId, primaryId, secondaryId)
 */
export function getSecondaryNavTo(primaryOrAccountId, primaryOrSecondaryId, secondaryId) {
  if (secondaryId !== undefined) {
    return getModuleRoute(primaryOrSecondaryId, secondaryId)
  }
  if (primaryOrSecondaryId !== undefined) {
    return getModuleRoute(primaryOrAccountId, primaryOrSecondaryId)
  }
  return getModuleRoute(primaryOrAccountId)
}

/** Default setup entry (Company Setup). */
export function getSetupNavTo() {
  return getSetupModuleRoute()
}

/** Central module landing route (/home). */
export function getHomeNavTo() {
  return ROUTES.HOME
}
