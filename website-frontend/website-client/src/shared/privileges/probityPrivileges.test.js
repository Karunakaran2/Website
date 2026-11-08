import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  PROBITY_PRIVILEGES,
  filterPrimaryNavItems,
  hasPrivilege,
  resolvePrivilegedDashboardNav,
} from './probityPrivileges'
import { clearSessionPrivileges, getSessionPrivileges, saveSessionPrivileges } from './privilegeSession'

const memory = new Map()

beforeEach(() => {
  memory.clear()
  globalThis.window = {
    sessionStorage: {
      getItem: (key) => (memory.has(key) ? memory.get(key) : null),
      setItem: (key, value) => {
        memory.set(key, String(value))
      },
      removeItem: (key) => {
        memory.delete(key)
      },
    },
  }
})

afterEach(() => {
  delete globalThis.window
})

const primaryItems = [
  { id: 'inbox', label: 'Home' },
  { id: 'budget', label: 'Budget' },
  { id: 'asset', label: 'Asset' },
  { id: 'financial-sanction', label: 'Financial Sanction' },
]

describe('hasPrivilege', () => {
  it('matches any required code without case sensitivity', () => {
    expect(hasPrivilege(['prob_budget'], PROBITY_PRIVILEGES.BUDGET)).toBe(true)
    expect(hasPrivilege(['PROB_ASSET'], [PROBITY_PRIVILEGES.BUDGET, PROBITY_PRIVILEGES.ASSET])).toBe(true)
    expect(hasPrivilege(['PROB_ASSET'], PROBITY_PRIVILEGES.BUDGET)).toBe(false)
    expect(hasPrivilege(['PROB_ASSET'], null)).toBe(true)
  })
})

describe('nav privilege filter', () => {
  it('shows every item when no grant list is loaded', () => {
    expect(filterPrimaryNavItems(primaryItems, null).map((item) => item.id)).toEqual([
      'inbox',
      'budget',
      'asset',
      'financial-sanction',
    ])
  })

  it('hides mapped tabs when the grant list is empty', () => {
    expect(filterPrimaryNavItems(primaryItems, []).map((item) => item.id)).toEqual([])
  })

  it('hides a primary tab whose code is missing', () => {
    const visible = filterPrimaryNavItems(primaryItems, [PROBITY_PRIVILEGES.BUDGET])
    expect(visible.map((item) => item.id)).toEqual(['budget'])
  })

  it('hides budget, bank reconciliation, and recurring voucher without those grants', () => {
    const items = [
      ...primaryItems,
      { id: 'bank-reconciliation', label: 'Bank Reconciliation' },
      { id: 'recurring-voucher', label: 'Recurring Voucher' },
    ]
    expect(
      filterPrimaryNavItems(items, [PROBITY_PRIVILEGES.ASSET]).map((item) => item.id),
    ).toEqual(['asset'])
    expect(
      filterPrimaryNavItems(items, [
        PROBITY_PRIVILEGES.BUDGET,
        PROBITY_PRIVILEGES.BANK_RECO,
        PROBITY_PRIVILEGES.RECUR_VOUCH,
      ]).map((item) => item.id),
    ).toEqual(['budget', 'bank-reconciliation', 'recurring-voucher'])
  })

  it('moves a disallowed deep link to the first allowed tab', () => {
    expect(
      resolvePrivilegedDashboardNav('asset', 'fa-group', [PROBITY_PRIVILEGES.BUDGET]),
    ).toEqual({
      primaryId: 'budget',
      secondaryId: 'initiation',
    })

    expect(
      resolvePrivilegedDashboardNav('budget', 'initiation', [
        PROBITY_PRIVILEGES.BUDGET,
      ]),
    ).toEqual({
      primaryId: 'budget',
      secondaryId: 'initiation',
    })
  })

  it('leaves the requested tab in place when grants are not loaded', () => {
    expect(resolvePrivilegedDashboardNav('asset', 'fa-group', null)).toEqual({
      primaryId: 'asset',
      secondaryId: 'fa-group',
    })
  })
})

describe('privilege session', () => {
  it('clears stored codes', () => {
    saveSessionPrivileges([PROBITY_PRIVILEGES.INBOX])
    expect(getSessionPrivileges()).toEqual([PROBITY_PRIVILEGES.INBOX])
    clearSessionPrivileges()
    expect(getSessionPrivileges()).toEqual([])
  })

  it('keeps an empty grant list in session storage', () => {
    saveSessionPrivileges([])
    expect(getSessionPrivileges()).toEqual([])
    expect(window.sessionStorage.getItem('probityPrivilegeCodes')).toBe('[]')
  })
})
