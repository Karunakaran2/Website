import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  publishSessionSignal,
  subscribeSessionSignals,
  SESSION_SIGNAL_STORAGE_KEY,
} from './sessionCrossTab'

describe('sessionCrossTab', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('does not notify the same tab when publishing a signal', () => {
    const storage = new Map()
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (key) => storage.get(key) ?? null,
        setItem: (key, value) => storage.set(key, value),
        removeItem: (key) => storage.delete(key),
      },
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
    vi.stubGlobal('BroadcastChannel', undefined)

    const received = []
    const unsubscribe = subscribeSessionSignals((signal) => {
      received.push(signal)
    })

    publishSessionSignal('LOGOUT')

    expect(storage.get(SESSION_SIGNAL_STORAGE_KEY)).toContain('LOGOUT')
    expect(received).toEqual([])
    unsubscribe()
  })
})
