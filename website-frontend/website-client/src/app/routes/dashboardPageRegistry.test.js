import { describe, expect, it } from 'vitest'
import { DASHBOARD_PAGE_REGISTRY, resolveDashboardPage } from './loadDomainPages'
import { PORTAL_MODULES } from '@/app/shell/constants/portalModules'
import { parseModulePath } from '@/shared/constants/moduleRoutes'
import { getDefaultSecondaryTabId, getSecondaryNavItems } from '@/app/shell/constants/dashboard'
import { WEBSITE_CMS_PRIMARY_IDS } from '@/domain/website-cms/constants/websiteCmsNav'

function secondaryIdsForPrimary(primaryId) {
  const tabs = getSecondaryNavItems(primaryId)
  if (tabs.length > 0) {
    return tabs.map((tab) => tab.id)
  }
  return [getDefaultSecondaryTabId(primaryId) || 'overview']
}

describe('DASHBOARD_PAGE_REGISTRY', () => {
  it('registers a lazy page component for every registry key', () => {
    expect(Object.keys(DASHBOARD_PAGE_REGISTRY).length).toBeGreaterThan(0)
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

  it('resolves every KRAN Admin menu tab', () => {
    const missing = []
    for (const primaryId of WEBSITE_CMS_PRIMARY_IDS) {
      for (const secondaryId of secondaryIdsForPrimary(primaryId)) {
        if (!resolveDashboardPage(primaryId, secondaryId)) {
          missing.push(`${primaryId}:${secondaryId}`)
        }
      }
    }
    expect(missing, `Missing registry entries:\n${missing.join('\n')}`).toEqual([])
  })
})