import { restoreAuthState } from '../redux/slice'
import {
  getRefreshToken,
  getSeatSelected,
  getSessionId,
  setRefreshToken,
  setSeatSelected,
  setSessionId,
} from './session'
import { hydrateSessionStorageFromMirror, readSessionMirror } from './sessionMirror'

let bootstrapComplete = false

const sessionApi = {
  getSessionId,
  setSessionId,
  setRefreshToken,
  setSeatSelected,
}

/**
 * Synchronously copy shared session mirror into this tab before auth guards run.
 * Safe to call multiple times (idempotent).
 * @param {import('@reduxjs/toolkit').Store} [store]
 */
export function ensureSharedSessionHydrated(store) {
  if (typeof window === 'undefined') {
    return false
  }
  if (bootstrapComplete && getSessionId()) {
    return true
  }

  hydrateSessionStorageFromMirror(sessionApi)

  if (store) {
    const mirror = readSessionMirror()
    if (mirror?.authUser && getSessionId()) {
      store.dispatch(restoreAuthState(mirror.authUser))
    }
  }

  bootstrapComplete = true
  return Boolean(getSessionId())
}

export function isSharedSessionBootstrapComplete() {
  return bootstrapComplete
}

/** @internal test helper */
export function resetSharedSessionBootstrapForTests() {
  bootstrapComplete = false
}
