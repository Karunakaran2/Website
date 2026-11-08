import { describe, expect, it } from 'vitest'
import { parseModulePath } from '@/shared/constants/moduleRoutes'

describe('module secondary tab routing', () => {
  it('parses workbench paths into primary and secondary ids', () => {
    const parsed = parseModulePath('/component-workbench/lib-playgrounds/table-playground')
    expect(parsed?.primaryTab).toBe('lib-playgrounds')
    expect(parsed?.secondaryTab).toBe('table-playground')
  })

  it('parses design guidelines overview paths', () => {
    const parsed = parseModulePath('/design-guidelines/guide-datatable/overview')
    expect(parsed?.primaryTab).toBe('guide-datatable')
    expect(parsed?.secondaryTab).toBe('overview')
  })
})
