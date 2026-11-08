import { afterEach, describe, expect, it, vi } from 'vitest'
import { getSessionId, setSessionId, subscribeAccessTokenChanged } from './session'

describe('setSessionId', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('tells the session clock to reset activity when the seat token is replaced', () => {
    const storage = new Map()
    vi.stubGlobal('window', {
      sessionStorage: {
        getItem: (key) => storage.get(key) ?? null,
        setItem: (key, value) => storage.set(key, value),
        removeItem: (key) => storage.delete(key),
      },
    })
    const events = []
    const unsubscribe = subscribeAccessTokenChanged((event) => events.push(event))

    setSessionId('next-access-token', { resetActivity: true })

    expect(storage.get('probity.sessionId')).toBe('next-access-token')
    expect(getSessionId()).toBe('next-access-token')
    expect(events).toEqual([{ resetActivity: true, cleared: false }])
    unsubscribe()
  })

  it('reads back an empty session id after the token is cleared', () => {
    const storage = new Map()
    vi.stubGlobal('window', {
      sessionStorage: {
        getItem: (key) => storage.get(key) ?? null,
        setItem: (key, value) => storage.set(key, value),
        removeItem: (key) => storage.delete(key),
      },
    })

    setSessionId('access-token')
    setSessionId('')

    expect(getSessionId()).toBe('')
  })
})
