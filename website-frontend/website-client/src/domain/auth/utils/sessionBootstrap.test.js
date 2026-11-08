import { afterEach, describe, expect, it, vi } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from '../redux/slice'
import { SESSION_MIRROR_STORAGE_KEY } from './sessionMirror'
import {
  ensureSharedSessionHydrated,
  resetSharedSessionBootstrapForTests,
} from './sessionBootstrap'
import { SESSION_SIGNAL_STORAGE_KEY } from '../session/sessionCrossTab'

describe('ensureSharedSessionHydrated', () => {
  afterEach(() => {
    resetSharedSessionBootstrapForTests()
    vi.unstubAllGlobals()
  })

  it('hydrates sessionStorage and redux from mirror without writing a logout signal', () => {
    const sessionStorage = new Map()
    const localStorage = new Map([
      [
        SESSION_MIRROR_STORAGE_KEY,
        JSON.stringify({
          sessionId: 'access-from-mirror',
          refreshToken: 'refresh',
          seatSelected: true,
          authUser: { accessToken: 'access-from-mirror', seatSelected: true, name: 'Test' },
        }),
      ],
    ])

    vi.stubGlobal('window', {
      sessionStorage: {
        getItem: (key) => sessionStorage.get(key) ?? null,
        setItem: (key, value) => sessionStorage.set(key, value),
        removeItem: (key) => sessionStorage.delete(key),
      },
      localStorage: {
        getItem: (key) => localStorage.get(key) ?? null,
        setItem: (key, value) => localStorage.set(key, value),
        removeItem: (key) => localStorage.delete(key),
      },
    })

    const store = configureStore({ reducer: { auth: authReducer } })
    ensureSharedSessionHydrated(store)

    expect(sessionStorage.get('probity.sessionId')).toBe('access-from-mirror')
    expect(store.getState().auth.isAuthenticated).toBe(true)
    expect(localStorage.get(SESSION_SIGNAL_STORAGE_KEY)).toBeUndefined()
  })
})
