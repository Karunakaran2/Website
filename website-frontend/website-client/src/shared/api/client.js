import { notifySessionExpired } from '@/domain/auth/utils/completeSessionLogout'
import { getRefreshToken, getSessionId, setRefreshToken, setSessionId } from '@/domain/auth/utils/session'
import { WEBSITE_AUTH_ENABLED } from '@/shared/config/websiteAuth'
import { apiPayloadMessage } from './apiError'

function readConfiguredApiBase() {
  const raw = import.meta.env.VITE_API_BASE_URL
  if (raw === undefined || raw === null) {
    return 'http://localhost:8080'
  }
  return String(raw).trim()
}

/** Gateway origin for non-dev builds; empty means same-origin `/api`. */
export const API_BASE_URL = readConfiguredApiBase()

function getBrowserApiBase() {
  if (import.meta.env.DEV) {
    return ''
  }

  if (!API_BASE_URL) {
    return ''
  }

  return API_BASE_URL.replace(/\/$/, '')
}

export function apiUrl(path = '') {
  const base = getBrowserApiBase()

  if (!path) {
    return base || API_BASE_URL
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalizedPath}`
}

function parseJsonSafe(text) {
  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function toErrorMessage(payload, fallback) {
  return apiPayloadMessage(payload, fallback)
}

function getAuthHeaders() {
  const sessionId = getSessionId()
  return sessionId ? { Authorization: `Bearer ${sessionId}` } : {}
}

let refreshInFlight = null

const REFRESH_LOCK_KEY = 'probity.refreshLock'
const REFRESH_LOCK_MS = 20_000

function tryAcquireCrossTabRefreshLock() {
  if (typeof window === 'undefined') {
    return true
  }
  const now = Date.now()
  try {
    const raw = window.localStorage.getItem(REFRESH_LOCK_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed?.until > now) {
        return false
      }
    }
    window.localStorage.setItem(
      REFRESH_LOCK_KEY,
      JSON.stringify({ until: now + REFRESH_LOCK_MS, at: now }),
    )
    return true
  } catch {
    return true
  }
}

function releaseCrossTabRefreshLock() {
  try {
    window.localStorage.removeItem(REFRESH_LOCK_KEY)
  } catch {
    // ignore
  }
}

function shouldRefresh(path, allowRefresh, hadAuthorization) {
  if (!allowRefresh || !hadAuthorization) {
    return false
  }
  if (WEBSITE_AUTH_ENABLED) {
    return !path.includes('/api/v1/auth/refresh')
      && !path.includes('/api/v1/auth/logout')
      && !path.includes('/api/v1/auth/login')
  }
  return !path.includes('/refreshAccessToken')
    && !path.includes('/logoutUser')
    && !path.includes('/loginUser')
    && !path.includes('/exchangeSpfoAccessToken')
}

export async function refreshAccessToken() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    return false
  }
  if (!refreshInFlight) {
    if (!tryAcquireCrossTabRefreshLock()) {
      await new Promise((resolve) => {
        window.setTimeout(resolve, 400)
      })
      return Boolean(getSessionId())
    }
    const refreshPath = WEBSITE_AUTH_ENABLED
      ? '/api/v1/auth/refresh'
      : '/api/v1/login/refreshAccessToken'
    refreshInFlight = fetch(apiUrl(refreshPath), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (response) => {
        if (!response.ok) {
          return false
        }
        const payload = parseJsonSafe(await response.text())
        if (!payload?.accessToken) {
          return false
        }
        setSessionId(payload.accessToken)
        if (payload.refreshToken) {
          setRefreshToken(payload.refreshToken)
        }
        return true
      })
      .catch(() => false)
      .finally(() => {
        refreshInFlight = null
        releaseCrossTabRefreshLock()
      })
  }
  return refreshInFlight
}


/** Multipart requests (do not set Content-Type — browser sets boundary). */
export async function requestFormData(path, formData, options = {}, allowRefresh = true) {
  const { headers, method = 'POST', ...rest } = options
  const authHeaders = getAuthHeaders()

  try {
    const response = await fetch(apiUrl(path), {
      method,
      headers: {
        Accept: 'application/json',
        ...authHeaders,
        ...headers,
      },
      body: formData,
      ...rest,
    })

    const rawText = await response.text()
    const payload = parseJsonSafe(rawText)

    if (!response.ok) {
      if (shouldRefresh(path, allowRefresh, authHeaders.Authorization) && response.status === 401) {
        const refreshed = await refreshAccessToken()
        if (refreshed) {
          return requestFormData(path, formData, options, false)
        }
      }
      if (response.status === 401 && authHeaders.Authorization) {
        notifySessionExpired()
      }

      return {
        error: {
          status: response.status,
          data: toErrorMessage(payload, response.statusText || 'Request failed'),
          payload,
        },
      }
    }

    return { data: payload }
  } catch {
    return {
      error: {
        status: 0,
        data: 'Unable to reach the server',
      },
    }
  }
}

export async function requestJson(path, options = {}, allowRefresh = true) {
  const { headers, body, ...rest } = options
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
  const authHeaders = getAuthHeaders()

  try {
    const response = await fetch(apiUrl(path), {
      headers: {
        Accept: 'application/json',
        ...(body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
        ...authHeaders,
        ...headers,
      },
      body,
      ...rest,
    })

    const rawText = await response.text()
    const payload = parseJsonSafe(rawText)

    if (!response.ok) {
      if (shouldRefresh(path, allowRefresh, authHeaders.Authorization) && response.status === 401) {
        const refreshed = await refreshAccessToken()
        if (refreshed) {
          return requestJson(path, options, false)
        }
      }
      if (response.status === 401 && authHeaders.Authorization) {
        notifySessionExpired()
      }

      return {
        error: {
          status: response.status,
          data: toErrorMessage(payload, response.statusText || 'Request failed'),
          payload,
        },
      }
    }

    return { data: payload }
  } catch {
    return {
      error: {
        status: 0,
        data: 'Unable to reach the server',
      },
    }
  }
}

export async function requestBlob(path, options = {}, allowRefresh = true) {
  const { headers, ...rest } = options
  const authHeaders = getAuthHeaders()

  try {
    const response = await fetch(apiUrl(path), {
      headers: {
        ...authHeaders,
        ...headers,
      },
      ...rest,
    })

    if (!response.ok) {
      const rawText = await response.text()
      const payload = parseJsonSafe(rawText)
      if (shouldRefresh(path, allowRefresh, authHeaders.Authorization) && response.status === 401) {
        const refreshed = await refreshAccessToken()
        if (refreshed) {
          return requestBlob(path, options, false)
        }
      }
      if (response.status === 401 && authHeaders.Authorization) {
        notifySessionExpired()
      }
      return {
        error: {
          status: response.status,
          data: toErrorMessage(payload, response.statusText || 'Request failed'),
          payload,
        },
      }
    }

    const disposition = response.headers.get('Content-Disposition') || ''
    const match = disposition.match(/filename="?([^"]+)"?/)
    return {
      data: {
        blob: await response.blob(),
        filename: match ? match[1] : 'download',
      },
    }
  } catch {
    return {
      error: {
        status: 0,
        data: 'Unable to reach the server',
      },
    }
  }
}
