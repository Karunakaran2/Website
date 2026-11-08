import { afterEach, describe, expect, it, vi } from 'vitest'
import { SESSION_SIGNAL_STORAGE_KEY } from '../session/sessionCrossTab'

vi.mock('@/app/shell/redux/slice', () => ({
  resetDashboardNav: () => ({ type: 'shell/reset' }),
}))
vi.mock('@/app/user-management/redux/slice', () => ({
  clearSelectedAccount: () => ({ type: 'account/clear' }),
}))
vi.mock('@/shared/api/baseApi', () => ({
  baseApi: { util: { resetApiState: () => ({ type: 'api/reset' }) } },
}))
vi.mock('../redux/slice', () => ({
  logout: () => ({ type: 'auth/logout' }),
}))

const { completeSessionLogout } = await import('./completeSessionLogout')

describe('completeSessionLogout broadcastCrossTab', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('does not publish LOGOUT when broadcastCrossTab is false', () => {
    const localStorage = new Map()
    vi.stubGlobal('window', {
      sessionStorage: {
        getItem: () => null,
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      localStorage: {
        getItem: (key) => localStorage.get(key) ?? null,
        setItem: (key, value) => localStorage.set(key, value),
        removeItem: (key) => localStorage.delete(key),
      },
      location: { replace: vi.fn() },
    })
    const store = { dispatch: vi.fn() }

    completeSessionLogout(store, { redirect: false, broadcastCrossTab: false })

    expect(localStorage.get(SESSION_SIGNAL_STORAGE_KEY)).toBeUndefined()
    expect(store.dispatch).toHaveBeenCalled()
  })

  it('publishes LOGOUT when broadcastCrossTab is true', () => {
    const localStorage = new Map()
    vi.stubGlobal('window', {
      sessionStorage: {
        getItem: () => null,
        setItem: vi.fn(),
        removeItem: vi.fn(),
      },
      localStorage: {
        getItem: (key) => localStorage.get(key) ?? null,
        setItem: (key, value) => localStorage.set(key, value),
        removeItem: (key) => localStorage.delete(key),
      },
      location: { replace: vi.fn() },
    })
    const store = { dispatch: vi.fn() }

    completeSessionLogout(store, { redirect: false, broadcastCrossTab: true })

    expect(String(localStorage.get(SESSION_SIGNAL_STORAGE_KEY))).toContain('LOGOUT')
  })
})
