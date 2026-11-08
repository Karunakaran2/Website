import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadScrollPositionForLocation, saveScrollPositionForLocation } from './appScrollContainer'

describe('appScrollContainer', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('stores and loads scroll positions by location key', () => {
    const storage = new Map()
    vi.stubGlobal('window', {
      sessionStorage: {
        getItem: (key) => storage.get(key) ?? null,
        setItem: (key, value) => storage.set(key, value),
        removeItem: (key) => storage.delete(key),
      },
    })

    saveScrollPositionForLocation('loc-1', 220)
    expect(loadScrollPositionForLocation('loc-1')).toBe(220)
  })
})
