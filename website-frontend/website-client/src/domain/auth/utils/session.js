import { publishSessionSignal } from '../session/sessionCrossTab'
import { clearSessionMirror, writeSessionMirror } from './sessionMirror'

const SESSION_ID_KEY = 'probity.sessionId'
const REFRESH_TOKEN_KEY = 'probity.refreshToken'
const SEAT_SELECTED_KEY = 'probity.seatSelected'
const HANDOFF_INBOX_KEY = 'probity.handoffInbox'
const SPFO_ORIGIN_KEY = 'probity.spfoOrigin'
const DEFAULT_SPFO_LOGIN_URL = 'http://localhost:3000/spfo/member-login'

function mirrorTokens() {
  if (!getSessionId()) {
    return
  }
  writeSessionMirror({
    sessionId: getSessionId(),
    refreshToken: getRefreshToken(),
    seatSelected: getSeatSelected(),
  })
}

/** Persist user snapshot for other tabs (same origin localStorage — not broadcast). */
export function syncSessionMirrorAuthUser(user) {
  writeSessionMirror({
    authUser: user ?? null,
    sessionId: getSessionId(),
    refreshToken: getRefreshToken(),
    seatSelected: typeof user?.seatSelected === 'boolean' ? user.seatSelected : getSeatSelected(),
  })
}

const accessTokenListeners = new Set()
let pendingLogoutDestination = null

export function subscribeAccessTokenChanged(listener) {
  accessTokenListeners.add(listener)
  return () => accessTokenListeners.delete(listener)
}

function emitAccessTokenChanged(event) {
  accessTokenListeners.forEach((listener) => {
    listener(event)
  })
}

export function getSessionId() {
  try {
    return window.sessionStorage.getItem(SESSION_ID_KEY) || ''
  } catch {
    return ''
  }
}

export function setSessionId(sessionId, { resetActivity = false, crossTabSignal = true } = {}) {
  const previous = getSessionId()
  if (sessionId === previous) {
    emitAccessTokenChanged({ resetActivity, cleared: !sessionId })
    return
  }

  try {
    if (sessionId) {
      window.sessionStorage.setItem(SESSION_ID_KEY, sessionId)
      pendingLogoutDestination = null
    } else {
      window.sessionStorage.removeItem(SESSION_ID_KEY)
    }
  } catch {
    // sessionStorage may be unavailable
  }
  emitAccessTokenChanged({ resetActivity, cleared: !sessionId })
  if (sessionId) {
    mirrorTokens()
    if (crossTabSignal) {
      publishSessionSignal('TOKEN_REFRESHED')
    }
  }
}

export function getRefreshToken() {
  try {
    return window.sessionStorage.getItem(REFRESH_TOKEN_KEY) || ''
  } catch {
    return ''
  }
}

export function setRefreshToken(refreshToken) {
  try {
    if (refreshToken) {
      window.sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
      return
    }
    window.sessionStorage.removeItem(REFRESH_TOKEN_KEY)
  } catch {
    // storage may be unavailable
  }
  mirrorTokens()
}

export function getSeatSelected() {
  try {
    const value = window.sessionStorage.getItem(SEAT_SELECTED_KEY)
    if (value === 'true') {
      return true
    }
    if (value === 'false') {
      return false
    }
  } catch {
    // storage may be unavailable
  }

  return null
}

export function setSeatSelected(seatSelected) {
  try {
    if (typeof seatSelected === 'boolean') {
      window.sessionStorage.setItem(SEAT_SELECTED_KEY, String(seatSelected))
      return
    }
    window.sessionStorage.removeItem(SEAT_SELECTED_KEY)
  } catch {
    // storage may be unavailable
  }
  mirrorTokens()
}

export function markHandoffInbox() {
  try {
    window.sessionStorage.setItem(HANDOFF_INBOX_KEY, '1')
  } catch {
    // sessionStorage may be unavailable
  }
}

export function markSpfoOrigin() {
  try {
    window.sessionStorage.setItem(SPFO_ORIGIN_KEY, '1')
  } catch {
    // sessionStorage may be unavailable
  }
}

export function isSpfoOrigin() {
  try {
    return window.sessionStorage.getItem(SPFO_ORIGIN_KEY) === '1'
  } catch {
    return false
  }
}

export function spfoLoginUrl() {
  const configured = String(import.meta.env.VITE_SPFO_LOGIN_URL || '').trim()
  return configured || DEFAULT_SPFO_LOGIN_URL
}

export function rememberLogoutDestination(probityLoginUrl) {
  if (pendingLogoutDestination) {
    return pendingLogoutDestination
  }
  const spfo = isSpfoOrigin()
  pendingLogoutDestination = {
    url: spfo ? spfoLoginUrl() : probityLoginUrl,
    spfo,
  }
  return pendingLogoutDestination
}

export function getPendingLogoutDestination() {
  return pendingLogoutDestination
}

export function consumeHandoffInbox() {
  try {
    const marked = window.sessionStorage.getItem(HANDOFF_INBOX_KEY) === '1'
    window.sessionStorage.removeItem(HANDOFF_INBOX_KEY)
    return marked
  } catch {
    return false
  }
}

export function clearSessionId() {
  setSessionId('')
  setRefreshToken('')
  setSeatSelected(null)
  try {
    window.sessionStorage.removeItem(HANDOFF_INBOX_KEY)
    window.sessionStorage.removeItem(SPFO_ORIGIN_KEY)
  } catch {
    // sessionStorage may be unavailable
  }
  clearSessionMirror()
}
