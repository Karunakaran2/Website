import { afterEach, describe, expect, it, vi } from 'vitest'

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

const { endAuthenticatedSession, registerSessionLogoutStore } = await import('./completeSessionLogout')

describe('endAuthenticatedSession', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('calls logout once and does not send the refresh token as a bearer', async () => {
    const storage = new Map([['probity.sessionId', 'access-token']])
    vi.stubGlobal('window', {
      sessionStorage: {
        getItem: (key) => storage.get(key) ?? null,
        setItem: (key, value) => storage.set(key, value),
        removeItem: (key) => storage.delete(key),
      },
      location: { replace: vi.fn() },
    })
    let release
    const fetchMock = vi.fn(() => new Promise((resolve) => {
      release = () => resolve({ ok: true })
    }))
    vi.stubGlobal('fetch', fetchMock)
    const store = { dispatch: vi.fn() }
    registerSessionLogoutStore(store)

    const first = endAuthenticatedSession(store, { redirect: false })
    const second = endAuthenticatedSession(store, { redirect: false })
    release()
    await first
    await second

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0]).toBe('/api/v1/login/logoutUser')
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer access-token')
    expect(fetchMock.mock.calls[0][1].body).toBeUndefined()
    expect(store.dispatch).toHaveBeenCalled()
  })
})
