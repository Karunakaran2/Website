import { describe, expect, it } from 'vitest'
import { DASHBOARD_PAGE_REGISTRY, resolveDashboardPage } from './loadDomainPages'
import { PORTAL_MODULES } from '@/app/shell/constants/portalModules'
import { getModuleRoute } from '@/shared/constants'
import { parseModulePath } from '@/shared/constants/moduleRoutes'
import {
  ASSET_MANAGEMENT_PRIMARY_NAV_ITEMS,
  COMPONENT_LIBRARY_PRIMARY_NAV_ITEMS,
  DESIGN_GUIDELINES_PRIMARY_NAV_ITEMS,
  SAMPLE_MODULE_PRIMARY_NAV_ITEMS,
  SETUP_MODULE_PRIMARY_NAV_ITEMS,
  WORKBENCH_PRIMARY_NAV_ITEMS,
  WORKFORCE_PRIMARY_NAV_ITEMS,
  getDefaultSecondaryTabId,
  getSecondaryNavItems,
} from '@/app/shell/constants/dashboard'

function secondaryIdsForPrimary(primaryId) {
  const tabs = getSecondaryNavItems(primaryId)
  if (tabs.length > 0) {
    return tabs.map((tab) => tab.id)
  }
  return [getDefaultSecondaryTabId(primaryId) || 'overview']
}

function collectReferencePrimaryIds() {
  const ids = new Set()
  for (const item of WORKBENCH_PRIMARY_NAV_ITEMS) ids.add(item.id)
  for (const item of COMPONENT_LIBRARY_PRIMARY_NAV_ITEMS) ids.add(item.id)
  for (const item of SAMPLE_MODULE_PRIMARY_NAV_ITEMS) ids.add(item.id)
  for (const item of DESIGN_GUIDELINES_PRIMARY_NAV_ITEMS) ids.add(item.id)
  for (const item of WORKFORCE_PRIMARY_NAV_ITEMS) ids.add(item.id)
  for (const item of SETUP_MODULE_PRIMARY_NAV_ITEMS) ids.add(item.id)
  for (const item of ASSET_MANAGEMENT_PRIMARY_NAV_ITEMS) ids.add(item.id)
  return [...ids]
}

describe('DASHBOARD_PAGE_REGISTRY', () => {
  it('registers the expected portal page catalog size', () => {
    expect(Object.keys(DASHBOARD_PAGE_REGISTRY).length).toBe(267)
  })

  it('registers a lazy page component for every registry key', () => {
    for (const [key, Page] of Object.entries(DASHBOARD_PAGE_REGISTRY)) {
      expect(key).toMatch(/^[a-z0-9-]+:[a-z0-9-]+$/)
      expect(Page).toBeTruthy()
      expect(typeof Page).toBe('function')
    }
  })

  it('resolves portal module entry paths to registered pages', () => {
    for (const mod of PORTAL_MODULES) {
      const path = mod.path()
      const parsed = parseModulePath(path)
      expect(parsed?.primaryTab, `${mod.id} path ${path}`).toBeTruthy()
      const secondary = parsed.secondaryTab || 'overview'
      const Page = resolveDashboardPage(parsed.primaryTab, secondary)
      expect(Page, `missing page for ${parsed.primaryTab}:${secondary}`).toBeTruthy()
    }
  })

  it('resolves every reference-module primary and secondary tab', () => {
    const missing = []
    for (const primaryId of collectReferencePrimaryIds()) {
      for (const secondaryId of secondaryIdsForPrimary(primaryId)) {
        if (!resolveDashboardPage(primaryId, secondaryId)) {
          missing.push(`${primaryId}:${secondaryId}`)
        }
      }
    }
    expect(missing, `Missing registry entries:\n${missing.join('\n')}`).toEqual([])
  })

  it('resolves administration setup and asset dashboard shortcuts', () => {
    expect(resolveDashboardPage('setup-dashboard', 'overview')).toBeTruthy()
    expect(resolveDashboardPage('setup-master-data', 'overview')).toBeTruthy()
    expect(resolveDashboardPage('asset-dashboard', 'overview')).toBeTruthy()
    expect(resolveDashboardPage('asset-register', 'overview')).toBeTruthy()
    expect(getModuleRoute('setup-dashboard', 'overview')).toBe(
      '/administration/setup/setup-dashboard/overview',
    )
  })
})
