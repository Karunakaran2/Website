/** @vitest-environment node */
import { describe, expect, it } from 'vitest'
import {
  assignMainColumnWidths,
  computeDataTableColumnLayout,
} from './computeDataTableColumnLayout'
import {
  getDataTableColumnGrowScore,
  getDataTableColumnMinWidth,
} from './dataTableColumnConfig'

describe('dataTableColumnConfig widths', () => {
  it('uses narrow width for serial and fixed width for action', () => {
    expect(getDataTableColumnMinWidth({ isSerial: true })).toBe(60)
    expect(getDataTableColumnMinWidth({ id: 'action', header: 'Action' })).toBe(132)
    expect(getDataTableColumnMinWidth({ id: 'activeStatus', header: 'Status' })).toBe(92)
  })

  it('uses type floors for description, title, and compact fields', () => {
    expect(getDataTableColumnMinWidth({ id: 'description', header: 'Description' })).toBe(88)
    expect(getDataTableColumnMinWidth({ id: 'serviceType', header: 'Item/Service code' })).toBe(80)
    expect(getDataTableColumnMinWidth({ id: 'setupName', header: 'Setup Name' })).toBe(68)
    expect(getDataTableColumnMinWidth({ id: 'salesPrice', header: 'Sales Price', format: 'currency' })).toBe(
      88,
    )
  })

  it('distributes leftover width up to maxWidth instead of one grow column', () => {
    const ordered = [
      { columnId: 'serial', minWidth: 60, maxWidth: 60, pinned: true, growScore: -1 },
      {
        columnId: 'description',
        minWidth: 120,
        maxWidth: 220,
        pinned: false,
        growScore: 85,
      },
      {
        columnId: 'setupName',
        minWidth: 100,
        maxWidth: 140,
        pinned: false,
        growScore: 35,
      },
      { columnId: 'action', minWidth: 132, maxWidth: 132, pinned: true, growScore: -1 },
    ]
    const widths = assignMainColumnWidths({
      orderedMainColumns: ordered,
      containerWidth: 600,
      showExpandColumn: false,
    })
    expect(widths.description).toBeGreaterThan(120)
    expect(widths.setupName).toBeGreaterThan(100)
    expect(widths.description).toBeLessThan(220 * 1.15)
    expect(widths.setupName).toBeLessThan(140 * 1.15)
    const sum = Object.values(widths).reduce((a, b) => a + b, 0)
    expect(sum).toBe(600)
  })
})

describe('getDataTableColumnGrowScore', () => {
  it('ranks description above generic fields', () => {
    expect(getDataTableColumnGrowScore({ id: 'description', header: 'Description' })).toBe(85)
    expect(getDataTableColumnGrowScore({ id: 'gstRate', header: 'GST Rate' })).toBe(35)
  })
})
