import { describe, expect, it } from 'vitest'
import { resolveDashboardNavIds } from '../constants/dashboard'
import { parseModulePath } from '@/shared/constants/moduleRoutes'

describe('useDashboardRouteIds (route parsing)', () => {
  it('resolves workbench button docs from URL segments', () => {
    const parsed = parseModulePath('/component-workbench/lib-actions/buttons')
    const ids = resolveDashboardNavIds(parsed.primaryTab, parsed.secondaryTab)
    expect(ids.primaryId).toBe('lib-actions')
    expect(ids.secondaryId).toBe('buttons')
  })

  it('resolves interactive actions buttons page', () => {
    const parsed = parseModulePath('/component-workbench/actions/buttons')
    const ids = resolveDashboardNavIds(parsed.primaryTab, parsed.secondaryTab)
    expect(ids.primaryId).toBe('actions')
    expect(ids.secondaryId).toBe('buttons')
  })
})
