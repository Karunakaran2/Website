/** @vitest-environment happy-dom */
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useClientDataTable } from './useClientDataTable'

const sampleRows = [
  { officeName: 'Alpha Office', allocatedCount: 3 },
  { officeName: 'Beta Office', allocatedCount: 1 },
  { officeName: 'Gamma Office', allocatedCount: 2 },
]

describe('useClientDataTable', () => {
  it('paginates client-side rows', () => {
    const { result } = renderHook(() => useClientDataTable(sampleRows, {
      searchFields: ['officeName'],
      defaultPageSize: 2,
    }))

    expect(result.current.total).toBe(3)
    expect(result.current.rows).toHaveLength(2)
    expect(result.current.rows[0].officeName).toBe('Alpha Office')
  })

  it('filters by search and resets to page 1', () => {
    const { result } = renderHook(() => useClientDataTable(sampleRows, {
      searchFields: ['officeName'],
      defaultPageSize: 10,
    }))

    act(() => {
      result.current.setPage(2)
      result.current.setSearch('beta')
    })

    expect(result.current.page).toBe(1)
    expect(result.current.total).toBe(1)
    expect(result.current.rows[0].officeName).toBe('Beta Office')
  })

  it('sorts allocatedCount numerically', () => {
    const { result } = renderHook(() => useClientDataTable(sampleRows, {
      searchFields: ['officeName'],
      defaultPageSize: 10,
    }))

    act(() => {
      result.current.setSort({ sortBy: 'allocatedCount', sortDir: 'desc' })
    })

    expect(result.current.rows.map((row) => row.allocatedCount)).toEqual([3, 2, 1])
  })
})
