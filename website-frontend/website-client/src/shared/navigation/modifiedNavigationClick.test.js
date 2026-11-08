import { describe, expect, it } from 'vitest'
import { isModifiedNavigationClick } from './modifiedNavigationClick'

describe('isModifiedNavigationClick', () => {
  it('returns true for ctrl/meta/shift/alt and non-primary mouse buttons', () => {
    expect(isModifiedNavigationClick({ ctrlKey: true })).toBe(true)
    expect(isModifiedNavigationClick({ metaKey: true })).toBe(true)
    expect(isModifiedNavigationClick({ shiftKey: true })).toBe(true)
    expect(isModifiedNavigationClick({ altKey: true })).toBe(true)
    expect(isModifiedNavigationClick({ button: 1 })).toBe(true)
  })

  it('returns false for plain primary click', () => {
    expect(isModifiedNavigationClick({ ctrlKey: false, metaKey: false, button: 0 })).toBe(false)
  })
})
