import { resetDashboardNav } from '@/app/shell/redux/slice'
import { clearSelectedAccount } from '@/app/user-management/redux/slice'
import { apiUrl } from '@/shared/api/client'
import { baseApi } from '@/shared/api/baseApi'
import { sessionDebug } from '../session/sessionDebug'
import { stopSessionClock } from '../session/sessionRuntime'
import { logout } from '../redux/slice'
import { publishSessionSignal } from '../session/sessionCrossTab'
import { getSessionId, rememberLogoutDestination } from './session'

let logoutInProgress = false
let serverLogoutStarted = false
let registeredStore = null

/** Register Redux store once (AppProviders) for global 401 handling. */
export function registerSessionLogoutStore(store) {
  registeredStore = store
}

export function getSessionLogoutStore() {
  return registeredStore
}

function loginUrl() {
  const base = String(import.meta.env.BASE_URL || '/').replace(/\/+$/, '')
  return base ? `${base}/` : '/'
}

/**
 * Clear auth, account context, dashboard nav, and all RTK Query cached API data.
 * @param {import('@reduxjs/toolkit').Store} store
 * @param {{ redirect?: boolean, broadcastCrossTab?: boolean }} options
 */
export function completeSessionLogout(store, { redirect = false, broadcastCrossTab = false } = {}) {
  if (!store || logoutInProgress) {
    return
  }

  logoutInProgress = true
  if (broadcastCrossTab) {
    publishSessionSignal('LOGOUT')
  }
  const destination = rememberLogoutDestination(loginUrl())

  store.dispatch(logout())
  store.dispatch(clearSelectedAccount())
  store.dispatch(resetDashboardNav())
  store.dispatch(baseApi.util.resetApiState())

  if (redirect) {
    window.location.replace(destination.url)
    return
  }

  logoutInProgress = false
}

/**
 * One logout for manual sign-out and inactivity timeout.
 * Revokes the current access token, then clears local auth state.
 * A second call while the first is running is ignored.
 */
export async function endAuthenticatedSession(store, { redirect = true } = {}) {
  if (serverLogoutStarted || logoutInProgress) {
    sessionDebug('logout-skipped-duplicate')
    return
  }

  serverLogoutStarted = true
  stopSessionClock()

  const targetStore = store || registeredStore
  const accessToken = getSessionId()
  if (accessToken) {
    sessionDebug('logout-user-called')
    try {
      await fetch(apiUrl('/api/v1/login/logoutUser'), {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
    } catch {
      // Clear the local session even if the logout call fails.
    }
  }

  completeSessionLogout(targetStore, { redirect, broadcastCrossTab: true })
  sessionDebug('tokens-cleared', { cleared: !getSessionId() })
  if (redirect) {
    sessionDebug('redirect-login')
  }
  if (!redirect) {
    serverLogoutStarted = false
  }
}

/** Called from requestJson when an authenticated request returns 401. */
export function notifySessionExpired() {
  publishSessionSignal('SESSION_EXPIRED')
  if (registeredStore) {
    void endAuthenticatedSession(registeredStore, { redirect: true })
  }
}
