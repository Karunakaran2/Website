import { describe, expect, it } from 'vitest'
import { componentWorkbenchPages } from '../routes'
import {
  WORKBENCH_COMPONENT_CATALOG,
  getCatalogStats,
} from './workbenchComponentRegistry'
import { auditSharedComponentCoverage } from './auditCatalogCoverage'

describe('workbench component catalog', () => {
  it('has unique entry ids', () => {
    const ids = WORKBENCH_COMPONENT_CATALOG.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('maps interactive and grouped entries to registered routes', () => {
    const needsRoute = WORKBENCH_COMPONENT_CATALOG.filter(
      (e) =>
        (e.demoStatus === 'interactive' || e.demoStatus === 'grouped') && e.routeKey,
    )
    for (const entry of needsRoute) {
      expect(
        componentWorkbenchPages[entry.routeKey],
        `${entry.id} → ${entry.routeKey}`,
      ).toBeTruthy()
    }
  })

  it('reports catalog coverage stats', () => {
    const stats = getCatalogStats()
    expect(stats.total).toBeGreaterThan(40)
    expect(stats.categories).toBeGreaterThanOrEqual(10)
    expect(stats.interactiveOrGrouped).toBeGreaterThan(20)
  })

  it('keeps most shared JSX files referenced in the catalogue', () => {
    const { totalJsx, unlistedCount } = auditSharedComponentCoverage()
    expect(totalJsx).toBeGreaterThan(80)
    expect(unlistedCount).toBeLessThan(25)
  })
})
