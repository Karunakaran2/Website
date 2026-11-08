import { SESSION_SIGNAL_STORAGE_KEY } from '../session/sessionCrossTab'

export const SESSION_MIRROR_STORAGE_KEY = 'probity.sessionMirror'

function readRaw() {
  if (typeof window === 'undefined') {
    return null
  }
  try {
    const raw = window.localStorage.getItem(SESSION_MIRROR_STORAGE_KEY)
    if (!raw) {
      return null
    }
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function writeRaw(mirror) {
  if (typeof window === 'undefined') {
    return
  }
  try {
    if (!mirror) {
      window.localStorage.removeItem(SESSION_MIRROR_STORAGE_KEY)
      return
    }
    window.localStorage.setItem(SESSION_MIRROR_STORAGE_KEY, JSON.stringify(mirror))
  } catch {
    // ignore quota
  }
}

export function readSessionMirror() {
  return readRaw()
}

export function clearSessionMirror() {
  writeRaw(null)
}

/**
 * Persist auth snapshot for other tabs (same origin). Not sent via BroadcastChannel.
 * @param {{ sessionId?: string, refreshToken?: string, seatSelected?: boolean|null, authUser?: object|null }} patch
 */
export function writeSessionMirror(patch = {}) {
  const previous = readRaw() || {}
  writeRaw({
    ...previous,
    ...patch,
    version: 1,
    updatedAt: Date.now(),
  })
}

/**
 * Copy mirror tokens into this tab's sessionStorage when opening a new tab mid-session.
 * @returns {boolean} true when hydration ran
 */
export function hydrateSessionStorageFromMirror(sessionApi) {
  const mirror = readRaw()
  if (!mirror?.sessionId) {
    return false
  }

  const {
    getSessionId,
    setSessionId,
    setRefreshToken,
    setSeatSelected,
  } = sessionApi

  if (getSessionId()) {
    return false
  }

  setSessionId(mirror.sessionId, { resetActivity: false, crossTabSignal: false })
  if (mirror.refreshToken) {
    setRefreshToken(mirror.refreshToken)
  }
  if (typeof mirror.seatSelected === 'boolean') {
    setSeatSelected(mirror.seatSelected)
  }
  return true
}

export function mirrorStorageKey() {
  return SESSION_MIRROR_STORAGE_KEY
}

export function isMirrorStorageEvent(event) {
  return event?.key === SESSION_MIRROR_STORAGE_KEY || event?.key === SESSION_SIGNAL_STORAGE_KEY
}
