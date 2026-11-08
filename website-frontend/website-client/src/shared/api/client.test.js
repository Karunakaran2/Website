import { afterEach, describe, expect, it, vi } from 'vitest'
import { notifySessionExpired } from '@/domain/auth/utils/completeSessionLogout'
import { requestJson } from './client'

const sessionState = vi.hoisted(() => ({ access: '', refresh: '' }))

vi.mock('@/domain/auth/utils/session', () => ({
  getSessionId: () => sessionState.access,
  getRefreshToken: () => sessionState.refresh,
  setSessionId: (value) => {
    sessionState.access = value || ''
  },
  setRefreshToken: (value) => {
    sessionState.refresh = value || ''
  },
  subscribeAccessTokenChanged: () => () => {},
}))

vi.mock('@/domain/auth/utils/completeSessionLogout', () => ({
  notifySessionExpired: vi.fn(),
}))

function jsonResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 401 ? 'Unauthorized' : 'OK',
    text: async () => JSON.stringify(body),
  }
}

describe('requestJson', () => {
  afterEach(() => {
    sessionState.access = ''
    sessionState.refresh = ''
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    vi.mocked(notifySessionExpired).mockReset()
  })

  it('loads captcha without treating a missing auth header as a network error', async () => {
    const captcha = { captchaId: 'id-1', imageBase64: 'abc' }
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      text: async () => JSON.stringify(captcha),
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await requestJson('/api/v1/captcha/getCaptcha')

    expect(result).toEqual({ data: captcha })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0]).toBe('/api/v1/captcha/getCaptcha')
  })

  it('refreshes once without a bearer header and retries the original request', async () => {
    sessionState.access = 'expired-access'
    sessionState.refresh = 'refresh-1'
    const fetchMock = vi.fn(async (url, options) => {
      if (String(url).includes('/refreshAccessToken')) {
        expect(options.headers.Authorization).toBeUndefined()
        expect(JSON.parse(options.body)).toEqual({ refreshToken: 'refresh-1' })
        return jsonResponse(200, { accessToken: 'new-access', refreshToken: 'refresh-2' })
      }
      if (options.headers.Authorization === 'Bearer expired-access') {
        return jsonResponse(401, { message: 'expired' })
      }
      return jsonResponse(200, { value: 'ok' })
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await requestJson('/api/v1/accounting/getVoucher')

    expect(result).toEqual({ data: { value: 'ok' } })
    expect(sessionState.access).toBe('new-access')
    expect(sessionState.refresh).toBe('refresh-2')
    expect(notifySessionExpired).not.toHaveBeenCalled()
    expect(fetchMock.mock.calls.filter((call) => String(call[0]).includes('/refreshAccessToken'))).toHaveLength(1)
  })

  it('shares one refresh across parallel 401 responses and does not refresh again', async () => {
    sessionState.access = 'expired-access'
    sessionState.refresh = 'refresh-1'
    let apiAttempts = 0
    const fetchMock = vi.fn(async (url) => {
      if (String(url).includes('/refreshAccessToken')) {
        return jsonResponse(200, { accessToken: 'new-access', refreshToken: 'refresh-2' })
      }
      apiAttempts += 1
      if (apiAttempts <= 2) {
        return jsonResponse(401, { message: 'expired' })
      }
      return jsonResponse(200, { value: 'ok' })
    })
    vi.stubGlobal('fetch', fetchMock)

    const [first, second] = await Promise.all([
      requestJson('/api/v1/accounting/getVoucher'),
      requestJson('/api/v1/budget/getHead'),
    ])

    expect(first).toEqual({ data: { value: 'ok' } })
    expect(second).toEqual({ data: { value: 'ok' } })
    expect(fetchMock.mock.calls.filter((call) => String(call[0]).includes('/refreshAccessToken'))).toHaveLength(1)
    expect(notifySessionExpired).not.toHaveBeenCalled()
  })

  it('logs out when the retry is still unauthorized', async () => {
    sessionState.access = 'expired-access'
    sessionState.refresh = 'refresh-1'
    let apiAttempts = 0
    const fetchMock = vi.fn(async (url) => {
      if (String(url).includes('/refreshAccessToken')) {
        return jsonResponse(200, { accessToken: 'new-access', refreshToken: 'refresh-2' })
      }
      apiAttempts += 1
      return jsonResponse(401, { message: 'expired' })
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await requestJson('/api/v1/accounting/getVoucher')

    expect(result.error.status).toBe(401)
    expect(apiAttempts).toBe(2)
    expect(fetchMock.mock.calls.filter((call) => String(call[0]).includes('/refreshAccessToken'))).toHaveLength(1)
    expect(notifySessionExpired).toHaveBeenCalledTimes(1)
  })

  it('logs out when refresh fails and does not retry forever', async () => {
    sessionState.access = 'expired-access'
    sessionState.refresh = 'refresh-1'
    let apiAttempts = 0
    const fetchMock = vi.fn(async (url) => {
      if (String(url).includes('/refreshAccessToken')) {
        return jsonResponse(401, { message: 'refresh expired' })
      }
      apiAttempts += 1
      return jsonResponse(401, { message: 'expired' })
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await requestJson('/api/v1/accounting/getVoucher')

    expect(result.error.status).toBe(401)
    expect(apiAttempts).toBe(1)
    expect(notifySessionExpired).toHaveBeenCalledTimes(1)
  })
})
