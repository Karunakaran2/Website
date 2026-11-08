/** @vitest-environment node */
import { describe, expect, it } from 'vitest'
import { computeDataTableColumnLayout } from './computeDataTableColumnLayout'

const cols = [
  { columnId: 'serial', minWidth: 60, priority: 0, pinned: true, growScore: -1, manuallyVisible: true },
  {
    columnId: 'name',
    minWidth: 108,
    maxWidth: 180,
    priority: 10,
    pinned: false,
    growScore: 75,
    manuallyVisible: true,
  },
  {
    columnId: 'email',
    minWidth: 128,
    maxWidth: 200,
    priority: 20,
    pinned: false,
    growScore: 40,
    manuallyVisible: true,
  },
  { columnId: 'status', minWidth: 92, priority: 8500, pinned: true, growScore: -1, manuallyVisible: true },
  { columnId: 'action', minWidth: 132, priority: 9000, pinned: true, growScore: -1, manuallyVisible: true },
]

describe('computeDataTableColumnLayout', () => {
  it('keeps all columns in main row when width is sufficient', () => {
    const result = computeDataTableColumnLayout({ columns: cols, containerWidth: 1200 })
    expect(result.overflowColumnIds).toEqual([])
    expect(result.showExpandColumn).toBe(false)
    expect(result.mainColumnIds).toEqual(['serial', 'name', 'email', 'status', 'action'])
  })

  it('moves lower-priority columns to overflow when width is tight', () => {
    const result = computeDataTableColumnLayout({ columns: cols, containerWidth: 480 })
    expect(result.showExpandColumn).toBe(true)
    expect(result.mainColumnIds).toContain('serial')
    expect(result.mainColumnIds).toContain('action')
    expect(result.mainColumnIds).toContain('status')
    expect(result.mainColumnIds).toContain('name')
    expect(result.overflowColumnIds.length).toBeGreaterThan(0)
    expect(result.mainColumnIds).not.toEqual(expect.arrayContaining(result.overflowColumnIds))
  })

  it('keeps mandatory status and action in main at narrow widths', () => {
    const result = computeDataTableColumnLayout({ columns: cols, containerWidth: 360 })
    expect(result.mainColumnIds).toContain('status')
    expect(result.mainColumnIds).toContain('action')
    expect(result.showExpandColumn).toBe(true)
    const assigned = new Set([...result.mainColumnIds, ...result.overflowColumnIds])
    cols.forEach((col) => {
      if (col.manuallyVisible !== false) {
        expect(assigned.has(col.columnId)).toBe(true)
      }
    })
  })

  it('assigns column widths that sum to the container width', () => {
    const result = computeDataTableColumnLayout({ columns: cols, containerWidth: 640 })
    const sum = Object.values(result.columnWidths).reduce((a, b) => a + b, 0)
    expect(sum).toBe(640)
    expect(result.columnWidths.action).toBe(132)
  })

  it('excludes manually hidden columns from main and overflow', () => {
    const hidden = cols.map((col) =>
      col.columnId === 'email' ? { ...col, manuallyVisible: false } : col,
    )
    const result = computeDataTableColumnLayout({ columns: hidden, containerWidth: 1200 })
    expect(result.mainColumnIds).not.toContain('email')
    expect(result.overflowColumnIds).not.toContain('email')
  })
})
