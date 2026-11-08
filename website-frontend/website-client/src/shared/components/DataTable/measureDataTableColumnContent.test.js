/** @vitest-environment node */
import { describe, expect, it } from 'vitest'
import { measureDataTableColumnContent } from './measureDataTableColumnContent'

describe('measureDataTableColumnContent', () => {
  it('derives content length from current rows', () => {
    const columns = [{ id: 'setupName', header: 'Setup Name', accessor: 'setupName' }]
    const rows = [{ setupName: 'Budget' }, { setupName: 'Journal' }]
    const hints = measureDataTableColumnContent(columns, rows)
    expect(hints.setupName.maxSampleLength).toBeGreaterThanOrEqual(6)
    expect(hints.setupName.contentLength).toBeGreaterThanOrEqual(10)
  })
})
