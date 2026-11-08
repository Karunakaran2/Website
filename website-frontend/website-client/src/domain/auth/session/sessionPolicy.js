export const IDLE_LIMIT_MS = 20 * 60 * 1000
export const WARNING_LEAD_MS = 5 * 60 * 1000
export const JWT_REFRESH_LEAD_MS = 60 * 1000
export const ACTIVITY_THROTTLE_MS = 1000

export function readAccessTokenExpMs(accessToken) {
  if (!accessToken || typeof accessToken !== 'string') {
    return null
  }
  const parts = accessToken.split('.')
  if (parts.length < 2) {
    return null
  }
  try {
    const payload = JSON.parse(decodeBase64Url(parts[1]))
    const exp = Number(payload?.exp)
    if (!Number.isFinite(exp)) {
      return null
    }
    return exp * 1000
  } catch {
    return null
  }
}

export function remainingIdleMs(lastActivityAt, now, idleLimitMs = IDLE_LIMIT_MS) {
  return Math.max(0, idleLimitMs - (now - lastActivityAt))
}

function positiveSecondsToMs(rawSeconds, fallbackMs) {
  const seconds = Number(rawSeconds)
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return fallbackMs
  }
  return seconds * 1000
}

/**
 * Production always uses 20 minutes idle and a 5-minute warning.
 * Development can override both with VITE_SESSION_IDLE_SECONDS and
 * VITE_SESSION_WARNING_SECONDS. A warning that is not shorter than the
 * idle limit is ignored.
 */
export function sessionWindowsFromEnv({ dev, idleSeconds, warningSeconds }) {
  if (!dev) {
    return { idleLimitMs: IDLE_LIMIT_MS, warningLeadMs: WARNING_LEAD_MS }
  }
  const idleLimitMs = positiveSecondsToMs(idleSeconds, IDLE_LIMIT_MS)
  const configuredWarningMs = positiveSecondsToMs(warningSeconds, WARNING_LEAD_MS)
  const warningLeadMs = configuredWarningMs < idleLimitMs
    ? configuredWarningMs
    : Math.min(WARNING_LEAD_MS, Math.floor(idleLimitMs / 2))
  return { idleLimitMs, warningLeadMs }
}

export function resolveSessionWindows() {
  return sessionWindowsFromEnv({
    dev: import.meta.env.DEV,
    idleSeconds: import.meta.env.VITE_SESSION_IDLE_SECONDS,
    warningSeconds: import.meta.env.VITE_SESSION_WARNING_SECONDS,
  })
}

export function jwtRefreshDelayMs(accessToken, now) {
  const expMs = readAccessTokenExpMs(accessToken)
  if (expMs == null) {
    return null
  }
  return Math.max(0, expMs - JWT_REFRESH_LEAD_MS - now)
}

/**
 * Profile responses do not include a new access token. Keep the live session
 * token when it expires later than the copy stored on the Redux user.
 */
export function preferAccessToken(incomingToken, liveToken) {
  const incoming = typeof incomingToken === 'string' ? incomingToken.trim() : ''
  const live = typeof liveToken === 'string' ? liveToken.trim() : ''
  if (!incoming) {
    return live
  }
  if (!live || incoming === live) {
    return incoming
  }
  const incomingExp = readAccessTokenExpMs(incoming)
  const liveExp = readAccessTokenExpMs(live)
  if (incomingExp != null && liveExp != null) {
    return incomingExp >= liveExp ? incoming : live
  }
  if (incomingExp != null) {
    return incoming
  }
  if (liveExp != null) {
    return live
  }
  return live
}

export function formatRemaining(remainingMs) {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000))
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}

function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padLength = (4 - (normalized.length % 4)) % 4
  const padded = normalized + '='.repeat(padLength)
  const binary = globalThis.atob(padded)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}
