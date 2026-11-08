import { describe, expect, it } from 'vitest'
import { isViewAllAssetNotAllocated } from './assetViewAll'

describe('isViewAllAssetNotAllocated', () => {
  it('returns true when custodianId is empty', () => {
    expect(isViewAllAssetNotAllocated({ custodianId: '' })).toBe(true)
    expect(isViewAllAssetNotAllocated({ custodianId: null })).toBe(true)
    expect(isViewAllAssetNotAllocated({})).toBe(true)
  })

  it('returns false when custodianId is set', () => {
    expect(isViewAllAssetNotAllocated({ custodianId: '12' })).toBe(false)
    expect(isViewAllAssetNotAllocated({ custodianId: '  3  ' })).toBe(false)
  })
})
