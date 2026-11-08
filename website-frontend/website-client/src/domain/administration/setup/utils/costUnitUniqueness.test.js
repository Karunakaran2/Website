import { describe, expect, it } from 'vitest'
import {
  DUPLICATE_COST_UNIT_MESSAGE,
  isDuplicateCostUnitName,
  normalizeCostUnitName,
} from './costUnitUniqueness'

const existingItems = [
  { costId: 1, idMask: 'mask-a', costCategoryId: 10, costCentreName: 'Operations' },
  { costId: 2, idMask: 'mask-b', costCategoryId: 10, costCentreName: '  Finance  ' },
  { costId: 3, idMask: 'mask-c', costCategoryId: 20, costCentreName: 'Operations' },
]

describe('costUnitUniqueness', () => {
  it('normalizes names for comparison', () => {
    expect(normalizeCostUnitName('  Operations ')).toBe('operations')
  })

  it('rejects a duplicate under the same category on create', () => {
    expect(isDuplicateCostUnitName('operations', 10, existingItems, null)).toBe(true)
    expect(isDuplicateCostUnitName('FINANCE', 10, existingItems)).toBe(true)
  })

  it('allows a name that exists only under a different category', () => {
    expect(isDuplicateCostUnitName('Finance', 20, existingItems, null)).toBe(false)
  })

  it('allows the same name on the record being edited', () => {
    expect(isDuplicateCostUnitName('Operations', 10, existingItems, { costId: 1, idMask: 'mask-a' }))
      .toBe(false)
  })

  it('rejects renaming an edit to another unit in the same category', () => {
    expect(isDuplicateCostUnitName('Finance', 10, existingItems, { costId: 1, idMask: 'mask-a' }))
      .toBe(true)
  })

  it('exposes the field message used by the form', () => {
    expect(DUPLICATE_COST_UNIT_MESSAGE).toBe(
      'Cost Unit Name already exists under this Cost Category.',
    )
  })
})
