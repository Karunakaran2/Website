/** @vitest-environment node */
import { describe, expect, it } from 'vitest'
import {
  resolveDataTableColumnMaxWidth,
  resolveDataTableColumnMinWidth,
} from './resolveDataTableColumnSizing'

describe('resolveDataTableColumnSizing', () => {
  it('keeps setupName compact for short tbody values', () => {
    const column = { id: 'setupName', header: 'Setup Name', accessor: 'setupName' }
    const hint = { headerLength: 10, contentLength: 6, maxSampleLength: 6 }
    const min = resolveDataTableColumnMinWidth(column, hint)
    const max = resolveDataTableColumnMaxWidth(column, hint, min)
    expect(min).toBeLessThanOrEqual(120)
    expect(max).toBeLessThanOrEqual(180)
    expect(max - min).toBeLessThanOrEqual(48)
  })

  it('allows description more headroom than setupName', () => {
    const desc = { id: 'description', header: 'Description', accessor: 'description' }
    const hint = { headerLength: 11, contentLength: 40, maxSampleLength: 40 }
    const min = resolveDataTableColumnMinWidth(desc, hint)
    const max = resolveDataTableColumnMaxWidth(desc, hint, min)
    expect(max).toBeGreaterThan(160)
    expect(max).toBeLessThanOrEqual(260)
  })

  it('reserves width for sortable header labels (single-line headings)', () => {
    const desc = {
      id: 'description',
      header: 'Description',
      accessor: 'description',
      sortable: true,
    }
    const hint = { headerLength: 11, contentLength: 6, maxSampleLength: 6 }
    const min = resolveDataTableColumnMinWidth(desc, hint)
    expect(min).toBeGreaterThanOrEqual(130)
  })
})
