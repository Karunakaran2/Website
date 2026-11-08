/** @vitest-environment node */
import { describe, expect, it } from 'vitest'
import { isCurrencyColumn } from '@/shared/utils/tableColumnFormat'
import {
  formatCurrencyColumnLabel,
  headerAlreadyHasRupee,
  resolveMonetaryTableHeaderContent,
  resolveTableColumnHeader,
} from './resolveTableColumnHeader'

describe('resolveTableColumnHeader', () => {
  it('prefixes column visibility labels for monetary columns', () => {
    expect(formatCurrencyColumnLabel('Document Amount')).toBe('₹ Document Amount')
    expect(formatCurrencyColumnLabel('₹ Amount')).toBe('₹ Amount')
  })

  it('skips non-monetary headers', () => {
    expect(resolveMonetaryTableHeaderContent('GSTIN')).toBe('GSTIN')
    expect(resolveMonetaryTableHeaderContent('Qty')).toBe('Qty')
  })

  it('detects existing rupee mark', () => {
    expect(headerAlreadyHasRupee('₹ Total')).toBe(true)
    expect(headerAlreadyHasRupee('Total')).toBe(false)
  })

  it('treats tax amount columns as monetary but not rate percentages', () => {
    expect(isCurrencyColumn({ id: 'taxableAmt', key: 'taxableAmt', header: 'Taxable Amt.' })).toBe(true)
    expect(isCurrencyColumn({ id: 'cgstAmount', key: 'cgstAmount', header: 'CGST Amount' })).toBe(true)
    expect(isCurrencyColumn({ id: 'cgstRate', key: 'cgstRate', header: 'CGST Rate%' })).toBe(false)
    expect(resolveTableColumnHeader({ id: 'cgstRate', key: 'cgstRate', header: 'CGST Rate%', format: 'plain' })).toBe(
      'CGST Rate%',
    )
  })

  it('title-cases string headers for display', () => {
    expect(resolveTableColumnHeader({ id: 'assignee', header: 'submitted by' })).toBe('Submitted By')
  })

  it('respects headerTitleCase opt-out', () => {
    expect(
      resolveTableColumnHeader({
        id: 'assignee',
        header: 'submitted by',
        headerTitleCase: false,
      }),
    ).toBe('submitted by')
  })
})
