import { canonicalizeWorkbenchSpecPathname } from './workbenchSpecRedirects'
import {
  ASSET_ID,
  SETUP_COMPANY_ID,
  getDefaultSecondaryTabId,
  isAssetManagementPrimary,
  isDesignGuidelinesPrimary,
  isSampleModulePrimary,
  isSetupModulePrimary,
  isSetupPrimary,
  isWorkbenchPrimary,
  isWorkforcePrimary,
} from '@/app/shell/constants/dashboard'
import { ACCOUNT_DEFS } from '@/app/user-management/constants/accountsMeta'

export const MODULE_ROUTE_PREFIX = {
  WORKBENCH: '/component-workbench',
  /** Module 1 (enterprise reference) */
  SAMPLE: '/module-1',
  /** @deprecated alias — use SAMPLE (Module 1) */
  MODULE_1: '/module-1',
  GUIDELINES: '/design-guidelines',
  /** Module 2 (workforce & tasks) */
  WORKFORCE: '/module-2',
  /** @deprecated alias — use WORKFORCE (Module 2) */
  MODULE_2: '/module-2',
  ADMINISTRATION_SETUP: '/administration/setup',
  ADMINISTRATION_ASSET: '/administration/asset',
}

/** @deprecated use ADMINISTRATION_SETUP */
export const LEGACY_SETUP_PREFIX = '/setup'
/** @deprecated use ADMINISTRATION_ASSET */
export const LEGACY_ASSET_PREFIX = '/asset'
/** @deprecated use MODULE_ROUTE_PREFIX.SAMPLE (`/module-1`) */
export const LEGACY_SAMPLE_MODULE_PREFIX = '/sample-module'
/** @deprecated use MODULE_ROUTE_PREFIX.WORKFORCE (`/module-2`) */
export const LEGACY_WORKFORCE_PREFIX = '/workforce'
/** @deprecated use MODULE_ROUTE_PREFIX.WORKFORCE (`/module-2`) */
export const LEGACY_WORKFORCE_MANAGEMENT_PREFIX = '/workforce-management'

const LEGACY_MODULE_PREFIXES = [
  LEGACY_SAMPLE_MODULE_PREFIX,
  LEGACY_WORKFORCE_PREFIX,
  LEGACY_WORKFORCE_MANAGEMENT_PREFIX,
]

const ORDERED_PREFIXES = [
  MODULE_ROUTE_PREFIX.WORKBENCH,
  MODULE_ROUTE_PREFIX.SAMPLE,
  MODULE_ROUTE_PREFIX.GUIDELINES,
  MODULE_ROUTE_PREFIX.WORKFORCE,
  MODULE_ROUTE_PREFIX.ADMINISTRATION_SETUP,
  MODULE_ROUTE_PREFIX.ADMINISTRATION_ASSET,
  ...LEGACY_MODULE_PREFIXES,
  LEGACY_SETUP_PREFIX,
  LEGACY_ASSET_PREFIX,
]

/** Map old module URL prefixes to canonical `/module-1` and `/module-2`. */
export function rewriteLegacyModuleUrlPrefix(pathname) {
  if (!pathname || typeof pathname !== 'string') {
    return pathname
  }
  const cleanPath = pathname.split('?')[0].replace(/\/+$/, '') || '/'

  if (
    cleanPath === LEGACY_SAMPLE_MODULE_PREFIX ||
    cleanPath.startsWith(`${LEGACY_SAMPLE_MODULE_PREFIX}/`)
  ) {
    return MODULE_ROUTE_PREFIX.SAMPLE + cleanPath.slice(LEGACY_SAMPLE_MODULE_PREFIX.length)
  }
  if (
    cleanPath === LEGACY_WORKFORCE_PREFIX ||
    cleanPath.startsWith(`${LEGACY_WORKFORCE_PREFIX}/`)
  ) {
    return MODULE_ROUTE_PREFIX.WORKFORCE + cleanPath.slice(LEGACY_WORKFORCE_PREFIX.length)
  }
  if (
    cleanPath === LEGACY_WORKFORCE_MANAGEMENT_PREFIX ||
    cleanPath.startsWith(`${LEGACY_WORKFORCE_MANAGEMENT_PREFIX}/`)
  ) {
    return (
      MODULE_ROUTE_PREFIX.WORKFORCE + cleanPath.slice(LEGACY_WORKFORCE_MANAGEMENT_PREFIX.length)
    )
  }
  return cleanPath
}

function isLegacyAccountSegment(segment) {
  if (!segment) return false
  return segment === 'thiruvananthapuram' || ACCOUNT_DEFS.some((acc) => acc.id === segment)
}

function isAdministrationAssetPrimary(primaryId) {
  return primaryId === ASSET_ID || isAssetManagementPrimary(primaryId)
}

/** URL prefix segment for a primary nav id (empty string = flat /{primary}/{secondary}). */
export function resolveModuleUrlPrefix(primaryId) {
  if (isWorkbenchPrimary(primaryId)) {
    return MODULE_ROUTE_PREFIX.WORKBENCH
  }
  if (isSampleModulePrimary(primaryId)) {
    return MODULE_ROUTE_PREFIX.SAMPLE
  }
  if (isDesignGuidelinesPrimary(primaryId)) {
    return MODULE_ROUTE_PREFIX.GUIDELINES
  }
  if (isWorkforcePrimary(primaryId)) {
    return MODULE_ROUTE_PREFIX.WORKFORCE
  }
  if (isSetupPrimary(primaryId) || isSetupModulePrimary(primaryId)) {
    return MODULE_ROUTE_PREFIX.ADMINISTRATION_SETUP
  }
  if (isAdministrationAssetPrimary(primaryId)) {
    return MODULE_ROUTE_PREFIX.ADMINISTRATION_ASSET
  }
  return ''
}

/**
 * Canonical module path for primary + secondary nav ids.
 * Legacy arity getModuleRoute(accountId, primary, secondary) ignores accountId.
 */
export function getModuleRoute(...args) {
  let primaryId
  let secondaryId

  if (args.length >= 3) {
    primaryId = args[1]
    secondaryId = args[2]
  } else if (args.length === 2) {
    primaryId = args[0]
    secondaryId = args[1]
  } else if (args.length === 1) {
    primaryId = args[0]
    secondaryId = undefined
  } else {
    return `${MODULE_ROUTE_PREFIX.WORKBENCH}/overview/module-overview`
  }

  const secondary = secondaryId ?? getDefaultSecondaryTabId(primaryId)
  const prefix = resolveModuleUrlPrefix(primaryId)

  if (prefix === MODULE_ROUTE_PREFIX.ADMINISTRATION_ASSET) {
    if (primaryId === ASSET_ID) {
      return `${prefix}/${secondary}`
    }
    return `${prefix}/${primaryId}/${secondary}`
  }
  if (prefix) {
    return `${prefix}/${primaryId}/${secondary}`
  }
  return `/${primaryId}/${secondary}`
}

export function getSetupModuleRoute() {
  return getModuleRoute(SETUP_COMPANY_ID, 'overview')
}

/** @deprecated Use getModuleRoute */
export function getDashboardRoute(...args) {
  return getModuleRoute(...args)
}

function parseLegacyDashboardSegments(segments) {
  const dashIdx = segments.indexOf('dashboard')
  if (dashIdx === -1) {
    return null
  }
  const afterDash = segments.slice(dashIdx + 1)

  if (afterDash.length >= 3 && isLegacyAccountSegment(afterDash[0])) {
    return { primaryTab: afterDash[1], secondaryTab: afterDash[2] }
  }
  if (afterDash.length >= 2) {
    return { primaryTab: afterDash[0], secondaryTab: afterDash[1] }
  }
  if (afterDash.length === 1 && !isLegacyAccountSegment(afterDash[0])) {
    return { primaryTab: afterDash[0], secondaryTab: undefined }
  }
  return { primaryTab: undefined, secondaryTab: undefined }
}

function parsePrefixedModulePath(cleanPath, prefix, isAssetPrefix) {
  if (cleanPath === prefix) {
    return null
  }
  if (!cleanPath.startsWith(`${prefix}/`)) {
    return null
  }
  const rest = cleanPath.slice(prefix.length + 1).split('/').filter(Boolean)
  if (isAssetPrefix) {
    if (rest.length === 1) {
      return { primaryTab: ASSET_ID, secondaryTab: rest[0] }
    }
    if (rest.length >= 2) {
      return { primaryTab: rest[0], secondaryTab: rest[1] }
    }
    return null
  }
  if (rest.length >= 1) {
    return {
      primaryTab: rest[0],
      secondaryTab: rest[1],
    }
  }
  return null
}

/**
 * Parse any module pathname (including legacy /dashboard/...) into primary/secondary tab ids.
 */
export function parseModulePath(pathname) {
  if (!pathname || typeof pathname !== 'string') {
    return null
  }

  let cleanPath = pathname.split('?')[0].replace(/\/+$/, '') || '/'
  cleanPath = rewriteLegacyModuleUrlPrefix(cleanPath)

  if (cleanPath === '/dashboard' || cleanPath.startsWith('/dashboard/')) {
    const segments = cleanPath.split('/').filter(Boolean)
    return parseLegacyDashboardSegments(segments)
  }

  if (
    cleanPath === MODULE_ROUTE_PREFIX.ADMINISTRATION_SETUP ||
    cleanPath === LEGACY_SETUP_PREFIX
  ) {
    return { primaryTab: SETUP_COMPANY_ID, secondaryTab: 'overview' }
  }

  const administrationSetup = parsePrefixedModulePath(
    cleanPath,
    MODULE_ROUTE_PREFIX.ADMINISTRATION_SETUP,
    false,
  )
  if (administrationSetup) {
    return administrationSetup
  }

  const legacySetup = parsePrefixedModulePath(cleanPath, LEGACY_SETUP_PREFIX, false)
  if (legacySetup) {
    return legacySetup
  }

  const administrationAsset = parsePrefixedModulePath(
    cleanPath,
    MODULE_ROUTE_PREFIX.ADMINISTRATION_ASSET,
    true,
  )
  if (administrationAsset) {
    return administrationAsset
  }

  const legacyAsset = parsePrefixedModulePath(cleanPath, LEGACY_ASSET_PREFIX, true)
  if (legacyAsset) {
    return legacyAsset
  }

  for (const prefix of [
    MODULE_ROUTE_PREFIX.WORKBENCH,
    MODULE_ROUTE_PREFIX.SAMPLE,
    MODULE_ROUTE_PREFIX.GUIDELINES,
    MODULE_ROUTE_PREFIX.WORKFORCE,
  ]) {
    const parsed = parsePrefixedModulePath(cleanPath, prefix, false)
    if (parsed) {
      return parsed
    }
  }

  const segments = cleanPath.split('/').filter(Boolean)
  if (segments.length >= 2) {
    return { primaryTab: segments[0], secondaryTab: segments[1] }
  }
  if (segments.length === 1) {
    return { primaryTab: segments[0], secondaryTab: undefined }
  }
  return null
}

export function isModuleShellPathname(pathname) {
  if (!pathname || typeof pathname !== 'string') {
    return false
  }
  const cleanPath = pathname.split('?')[0].replace(/\/+$/, '') || '/'
  if (cleanPath === '/dashboard' || cleanPath.startsWith('/dashboard/')) {
    return true
  }
  if (ORDERED_PREFIXES.some((prefix) => cleanPath === prefix || cleanPath.startsWith(`${prefix}/`))) {
    return true
  }
  const parsed = parseModulePath(cleanPath)
  return Boolean(parsed?.primaryTab && parsed?.secondaryTab)
}

export function isPrimaryTabActive(pathname, primaryId) {
  return parseModulePath(pathname)?.primaryTab === primaryId
}

export function legacyDashboardPathToModuleRoute(pathname) {
  const parsed = parseModulePath(pathname)
  if (!parsed?.primaryTab) {
    return getModuleRoute('overview', 'module-overview')
  }
  return getModuleRoute(parsed.primaryTab, parsed.secondaryTab)
}

/** Redirect short legacy paths (/setup/..., /asset/...) to canonical administration URLs. */
export function canonicalizeModulePathname(pathname) {
  const cleanPath = pathname.split('?')[0].replace(/\/+$/, '') || '/'
  const workbenchSpec = canonicalizeWorkbenchSpecPathname(cleanPath)
  if (workbenchSpec) {
    return workbenchSpec
  }
  const legacyModuleRewrite = rewriteLegacyModuleUrlPrefix(cleanPath)
  if (legacyModuleRewrite !== cleanPath) {
    return legacyModuleRewrite
  }
  if (cleanPath.startsWith(`${LEGACY_SETUP_PREFIX}/`) || cleanPath === LEGACY_SETUP_PREFIX) {
    const parsed = parseModulePath(cleanPath)
    if (parsed?.primaryTab) {
      return getModuleRoute(parsed.primaryTab, parsed.secondaryTab)
    }
  }
  if (cleanPath.startsWith(`${LEGACY_ASSET_PREFIX}/`) || cleanPath === LEGACY_ASSET_PREFIX) {
    const parsed = parseModulePath(cleanPath)
    if (parsed?.primaryTab) {
      return getModuleRoute(parsed.primaryTab, parsed.secondaryTab)
    }
  }
  const target = legacyDashboardPathToModuleRoute(cleanPath)
  return cleanPath === target ? null : target
}

export function isSetupAreaPathname(pathname) {
  if (!pathname || typeof pathname !== 'string') return false
  const cleanPath = pathname.split('?')[0]
  if (
    cleanPath === MODULE_ROUTE_PREFIX.ADMINISTRATION_SETUP ||
    cleanPath.startsWith(`${MODULE_ROUTE_PREFIX.ADMINISTRATION_SETUP}/`) ||
    cleanPath === LEGACY_SETUP_PREFIX ||
    cleanPath.startsWith(`${LEGACY_SETUP_PREFIX}/`)
  ) {
    return true
  }
  const parsed = parseModulePath(cleanPath)
  if (!parsed?.primaryTab) return false
  return isSetupPrimary(parsed.primaryTab) || isSetupModulePrimary(parsed.primaryTab)
}

export function isAssetAreaPathname(pathname) {
  const cleanPath = pathname.split('?')[0]
  if (
    cleanPath.startsWith(`${MODULE_ROUTE_PREFIX.ADMINISTRATION_ASSET}/`) ||
    cleanPath.startsWith(`${LEGACY_ASSET_PREFIX}/`)
  ) {
    return true
  }
  const parsed = parseModulePath(cleanPath)
  return isAdministrationAssetPrimary(parsed?.primaryTab)
}
