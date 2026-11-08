import { describe, expect, it } from 'vitest'
import { isDuplicateItemServiceCode, normalizeItemServiceCode } from './itemServiceOptions'

const existingItems = [
  { id: 1, idMask: 'mask-a', serviceType: 'ITEM01' },
  { id: 2, idMask: 'mask-b', serviceType: '  Svc-02  ' },
]

describe('itemServiceCode uniqueness', () => {
  it('normalizes codes for comparison', () => {
    expect(normalizeItemServiceCode('  ITEM01 ')).toBe('item01')
  })

  it('rejects a duplicate on create', () => {
    expect(isDuplicateItemServiceCode('item01', existingItems, null)).toBe(true)
    expect(isDuplicateItemServiceCode('SVC-02', existingItems)).toBe(true)
  })

  it('allows the same code on the record being edited', () => {
    expect(isDuplicateItemServiceCode('ITEM01', existingItems, { id: 1, idMask: 'mask-a' })).toBe(false)
    expect(isDuplicateItemServiceCode('item01 ', existingItems, { idMask: 'mask-a' })).toBe(false)
  })

  it('rejects changing an edit to another existing code', () => {
    expect(isDuplicateItemServiceCode('SVC-02', existingItems, { id: 1, idMask: 'mask-a' })).toBe(true)
  })

  it('allows a new unused code', () => {
    expect(isDuplicateItemServiceCode('NEW-CODE', existingItems, null)).toBe(false)
  })
})
