import { describe, expect, it } from 'vitest'
import { componentWorkbenchPages } from './index'
import { designGuidelinesPages } from '@/domain/design-guidelines/routes'
import { resolveDashboardPage } from '@/app/routes/loadDomainPages'
import { getModuleRoute } from '@/shared/constants'
import { parseModulePath } from '@/shared/constants/moduleRoutes'

describe('component workbench route registry', () => {
  for (const key of Object.keys(componentWorkbenchPages)) {
    const [primaryId, secondaryId] = key.split(':')
    it(`resolves lazy page for ${key}`, () => {
      expect(resolveDashboardPage(primaryId, secondaryId)).toBeTruthy()
      const path = getModuleRoute(primaryId, secondaryId)
      expect(path).toMatch(/^\/component-workbench\//)
      const parsed = parseModulePath(path)
      expect(parsed?.primaryTab).toBe(primaryId)
      expect(parsed?.secondaryTab).toBe(secondaryId)
    })
  }
})

describe('design guidelines route registry', () => {
  for (const key of Object.keys(designGuidelinesPages)) {
    const [primaryId, secondaryId] = key.split(':')
    it(`resolves lazy page for ${key}`, () => {
      expect(resolveDashboardPage(primaryId, secondaryId)).toBeTruthy()
      const path = getModuleRoute(primaryId, secondaryId)
      expect(path).toMatch(/^\/design-guidelines\//)
    })
  }
})
