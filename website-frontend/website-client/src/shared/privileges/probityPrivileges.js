import {
  getDefaultSecondaryTabId,
  getSecondaryNavItems,
  isSetupPrimary,
  PRIMARY_NAV_ITEMS,
  SETUP_PRIMARY_NAV_ITEMS,
} from '@/app/shell/constants/dashboard'

/**
 * Privilege codes already enforced in Probity 2.0 (sec:authorize hasAuthority).
 * This catalog is not the logged-in user's grant list.
 */
export const PROBITY_PRIVILEGES = {
  INBOX: 'PROB_INBOX',
  DASHBOARD: 'PROB_DASHBOARD',
  MIS_DASHBOARD: 'PROB_MIS_DASHBOARD',
  ACC_VOUCHERS: 'PROB_ACC_VOUCHERS',
  ACC_SALES: 'PROB_ACC_SALES',
  ACC_PUR: 'PROB_ACC_PUR',
  ACC_REC: 'PROB_ACC_REC',
  ACC_PAY: 'PROB_ACC_PAY',
  ACC_JOU: 'PROB_ACC_JOU',
  ACC_CONT: 'PROB_ACC_CONT',
  ACC_DNCN: 'PROB_ACC_DNCN',
  ACC_ADJ: 'PROB_ACC_ADJ',
  STAT_PAY: 'PROB_STAT_PAY',
  STAT_PAY_NEW: 'PROB_STAT_PAY_NEW',
  STAT_PAY_DRAFT: 'PROB_STAT_PAY_DRAFT',
  VOUCH_APPR: 'PROB_VOUCH_APPR',
  VOUCH_REV: 'PROB_VOUCH_REV',
  FIN_SANC: 'PROB_FIN_SANC',
  FS_FIN: 'PROB_FS_FIN',
  FS_DRA: 'PROB_FS_DRA',
  FS_REC: 'PROB_FS_REC',
  FS_FOR: 'PROB_FS_FOR',
  FS_APP: 'PROB_FS_APP',
  FS_REJ: 'PROB_FS_REJ',
  PAY_TRANSFER: 'PROB_PAY_TRANSFER',
  FS_PAY: 'PROB_FS_PAY',
  FS_DIS: 'PROB_FS_DIS',
  FS_SUC: 'PROB_FS_SUC',
  DEPOSITS: 'PROB_FIN_SAC',
  ASSET: 'PROB_ASSET',
  BUDGET: 'PROB_BUDGET',
  BANK_RECO: 'PROB_BANK_RECO',
  RECUR_VOUCH: 'PROB_RECUR_VOUCH',
  REPORT: 'PROB_REPORT',
  ACC_SETUP: 'PROB_ACC_SETUP',
  COMPANY_SETUP: 'PROB_COMPANY_SETUP',
  OFFICE_SETUP: 'PROB_OFFICE_SETUP',
  GROUP_SETUP: 'PROB_GROUP_SETUP',
  COA: 'PROB_COA',
  BANK_SETUP: 'PROB_BANK_SETUP',
  SETUP_APPROVAL: 'PROB_SETUP_APPROVAL',
  SETUP_DRAFT: 'PROB_SETUP_DRAFT',
  PARTY_SETUP: 'PROB_PARTY_SETUP',
  COST_UNIT_SETUP: 'PROB_COST_UNIT_SETUP',
  NUM_SETUP: 'PROB_NUM_SETUP',
  ITEM_SERVICE_SETUP: 'PROB_ITEM_SERVICE_SETUP',
  OWN_TAX_SETUP: 'PROB_OWN_TAX_SETUP',
  LEDGER_ALLOC_SETUP: 'PROB_LEDGER_ALLOC_SETUP',
  OPE_BAL_SETUP: 'PROB_OPE_BAL_SETUP',
  FY_SETUP: 'PROB_FY_SETUP',
  TALLY_PORTING_SETUP: 'PROB_TALLY_PORTING_SETUP',
  ACC_APPR_BTN: 'ACC_APPR_BTN',
  ACC_REV_EDIT: 'ACC_REV_EDIT',
  ACC_REV_REVERSE: 'ACC_REV_REVERSE',
  PAY_AUTH: 'PAY_AUTH',
  FINANCIAL_YEAR_DIV: 'PROB_FINANCIAL_YEAR_DIV',
}

/** Primary nav id -> required code. Missing ids stay visible. OR when the value is an array. */
export const PRIMARY_NAV_PRIVILEGES = {
  inbox: PROBITY_PRIVILEGES.INBOX,
  dashboard: [PROBITY_PRIVILEGES.DASHBOARD, PROBITY_PRIVILEGES.MIS_DASHBOARD],
  budget: PROBITY_PRIVILEGES.BUDGET,
  'statutory-payment': PROBITY_PRIVILEGES.STAT_PAY,
  'voucher-approval': PROBITY_PRIVILEGES.VOUCH_APPR,
  'voucher-reversal': PROBITY_PRIVILEGES.VOUCH_REV,
  'financial-sanction': PROBITY_PRIVILEGES.FIN_SANC,
  payment: PROBITY_PRIVILEGES.PAY_TRANSFER,
  deposits: PROBITY_PRIVILEGES.DEPOSITS,
  asset: PROBITY_PRIVILEGES.ASSET,
  'bank-reconciliation': PROBITY_PRIVILEGES.BANK_RECO,
  'recurring-voucher': PROBITY_PRIVILEGES.RECUR_VOUCH,
  reports: PROBITY_PRIVILEGES.REPORT,
  'company-setup': PROBITY_PRIVILEGES.COMPANY_SETUP,
  'office-setup': PROBITY_PRIVILEGES.OFFICE_SETUP,
  'group-setup': PROBITY_PRIVILEGES.GROUP_SETUP,
  'chart-of-accounts-setup': PROBITY_PRIVILEGES.COA,
  'bank-cash-setup': PROBITY_PRIVILEGES.BANK_SETUP,
  'setup-approval': PROBITY_PRIVILEGES.SETUP_APPROVAL,
  'party-setup': PROBITY_PRIVILEGES.PARTY_SETUP,
  'cost-unit-setup': PROBITY_PRIVILEGES.COST_UNIT_SETUP,
  'numbering-setup': PROBITY_PRIVILEGES.NUM_SETUP,
  'item-service-setup': PROBITY_PRIVILEGES.ITEM_SERVICE_SETUP,
  'own-tax-setup': PROBITY_PRIVILEGES.OWN_TAX_SETUP,
  'allocation-setup': PROBITY_PRIVILEGES.LEDGER_ALLOC_SETUP,
  'opening-balance-setup': PROBITY_PRIVILEGES.OPE_BAL_SETUP,
  'financial-year-setup': PROBITY_PRIVILEGES.FY_SETUP,
  'tally-port-setup': PROBITY_PRIVILEGES.TALLY_PORTING_SETUP,
}

/** `${primaryId}:${secondaryId}` -> required code. Unlisted subtabs stay visible. */
export const SECONDARY_NAV_PRIVILEGES = {
  'statutory-payment:add-new': PROBITY_PRIVILEGES.STAT_PAY_NEW,
  'statutory-payment:draft': PROBITY_PRIVILEGES.STAT_PAY_DRAFT,
  'financial-sanction:sanction': PROBITY_PRIVILEGES.FS_FIN,
  'financial-sanction:draft': PROBITY_PRIVILEGES.FS_DRA,
  'financial-sanction:received': PROBITY_PRIVILEGES.FS_REC,
  'financial-sanction:forwarded': PROBITY_PRIVILEGES.FS_FOR,
  'financial-sanction:approved': PROBITY_PRIVILEGES.FS_APP,
  'financial-sanction:rejected': PROBITY_PRIVILEGES.FS_REJ,
  'payment:payment-sanction': PROBITY_PRIVILEGES.FS_PAY,
  'payment:disbursement': PROBITY_PRIVILEGES.FS_DIS,
  'payment:successful-transactions': PROBITY_PRIVILEGES.FS_SUC,
  'setup-approval:draft': PROBITY_PRIVILEGES.SETUP_DRAFT,
}

function normalize(code) {
  return String(code || '').trim().toUpperCase()
}

export function grantsAreEnforced(grants) {
  return Array.isArray(grants)
}

export function hasPrivilege(userPrivileges, required) {
  if (!required) return true
  const requiredList = Array.isArray(required) ? required : [required]
  if (requiredList.length === 0) return true
  const normalizedUser = (userPrivileges || []).map(normalize)
  return requiredList.some((priv) => normalizedUser.includes(normalize(priv)))
}

export function hasAllPrivileges(userPrivileges, requiredList) {
  const normalizedUser = (userPrivileges || []).map(normalize)
  return (requiredList || []).every((priv) => normalizedUser.includes(normalize(priv)))
}

/** Fail open when no grant list is loaded (null/undefined). An empty array is enforced. */
export function isRequirementAllowed(grants, required) {
  if (!grantsAreEnforced(grants)) return true
  return hasPrivilege(grants, required)
}

export function secondaryPrivilege(primaryId, secondaryId) {
  if (!primaryId || !secondaryId) return null
  return SECONDARY_NAV_PRIVILEGES[`${primaryId}:${secondaryId}`] || null
}

export function filterNavItems(items, grants, requirementFor) {
  if (!grantsAreEnforced(grants)) return items
  return items.filter((item) => isRequirementAllowed(grants, requirementFor(item)))
}

export function filterPrimaryNavItems(items, grants) {
  return filterNavItems(items, grants, (item) => PRIMARY_NAV_PRIVILEGES[item.id] || null)
}

export function filterSecondaryNavItems(primaryId, items, grants) {
  return filterNavItems(items, grants, (item) => secondaryPrivilege(primaryId, item.id))
}

function allowedSecondaryItems(primaryId, grants) {
  return filterSecondaryNavItems(primaryId, getSecondaryNavItems(primaryId), grants)
}

export function firstAllowedSecondaryId(primaryId, grants) {
  const items = getSecondaryNavItems(primaryId)
  if (!grantsAreEnforced(grants) || items.length === 0) {
    return getDefaultSecondaryTabId(primaryId)
  }
  const allowed = allowedSecondaryItems(primaryId, grants)
  if (allowed.length === 0) return getDefaultSecondaryTabId(primaryId)
  return allowed[0].id
}

function primaryIsAllowed(primaryId, grants) {
  return isRequirementAllowed(grants, PRIMARY_NAV_PRIVILEGES[primaryId] || null)
}

function pickSecondary(primaryId, preferredId, grants) {
  const items = getSecondaryNavItems(primaryId)
  if (items.length === 0) return getDefaultSecondaryTabId(primaryId)
  const allowed = allowedSecondaryItems(primaryId, grants)
  if (allowed.length === 0) return undefined
  if (preferredId && allowed.some((item) => item.id === preferredId)) return preferredId
  return allowed[0].id
}

function landingPool(primaryId) {
  const setupFirst = isSetupPrimary(primaryId)
  const first = setupFirst ? SETUP_PRIMARY_NAV_ITEMS : PRIMARY_NAV_ITEMS
  const second = setupFirst ? PRIMARY_NAV_ITEMS : SETUP_PRIMARY_NAV_ITEMS
  return [...first, ...second]
}

/**
 * When a grant list is loaded, move a disallowed dashboard URL to the first allowed tab.
 * With no grant list, the requested ids are returned unchanged.
 */
export function resolvePrivilegedDashboardNav(primaryId, secondaryId, grants) {
  if (!grantsAreEnforced(grants)) {
    return { primaryId, secondaryId }
  }

  const ordered = []
  if (primaryIsAllowed(primaryId, grants) && primaryId !== 'setup-home') ordered.push(primaryId)
  landingPool(primaryId).forEach((item) => {
    if (item.id !== primaryId && item.id !== 'setup-home' && primaryIsAllowed(item.id, grants)) {
      ordered.push(item.id)
    }
  })

  for (const candidate of ordered) {
    const nextSecondary = pickSecondary(
      candidate,
      candidate === primaryId ? secondaryId : null,
      grants,
    )
    if (nextSecondary !== undefined) {
      return { primaryId: candidate, secondaryId: nextSecondary }
    }
  }

  return { primaryId, secondaryId: secondaryId || getDefaultSecondaryTabId(primaryId) }
}
