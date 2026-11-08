import { useLayoutEffect } from 'react'
import { useStore } from 'react-redux'
import { restoreAuthState } from '../redux/slice'
import { resetDashboardNav } from '@/app/shell/redux/slice'
import { baseApi } from '@/shared/api/baseApi'
import { completeSessionLogout } from '../utils/completeSessionLogout'
import {
  getRefreshToken,
  getSeatSelected,
  getSessionId,
  setRefreshToken,
  setSeatSelected,
  setSessionId,
} from '../utils/session'
import { ensureSharedSessionHydrated } from '../utils/sessionBootstrap'
import {
  hydrateSessionStorageFromMirror,
  isMirrorStorageEvent,
  readSessionMirror,
  SESSION_MIRROR_STORAGE_KEY,
} from '../utils/sessionMirror'
import { subscribeSessionSignals } from '../session/sessionCrossTab'

const sessionApi = {
  getSessionId,
  setSessionId,
  setRefreshToken,
  setSeatSelected,
}

function rehydrateAuthFromMirror(store) {
  const mirror = readSessionMirror()
  if (!mirror?.authUser || !getSessionId()) {
    return
  }
  store.dispatch(restoreAuthState(mirror.authUser))
}

function handleRemoteLogout(store) {
  void completeSessionLogout(store, { redirect: true, broadcastCrossTab: false })
}

/**
 * Multi-tab session: mirror hydration, logout/account sync (no secrets in broadcast payloads).
 */
export default function SessionSync() {
  const store = useStore()

  useLayoutEffect(() => {
    ensureSharedSessionHydrated(store)

    const onSignal = (signal) => {
      if (!signal?.type) {
        return
      }
      switch (signal.type) {
        case 'LOGOUT':
        case 'SESSION_EXPIRED':
          handleRemoteLogout(store)
          break
        case 'ACCOUNT_SWITCHED':
          hydrateSessionStorageFromMirror(sessionApi)
          rehydrateAuthFromMirror(store)
          store.dispatch(resetDashboardNav())
          store.dispatch(baseApi.util.resetApiState())
          break
        case 'TOKEN_REFRESHED':
        case 'LOGIN':
          hydrateSessionStorageFromMirror(sessionApi)
          rehydrateAuthFromMirror(store)
          break
        default:
          break
      }
    }

    const unsubscribe = subscribeSessionSignals(onSignal)

    const onStorage = (event) => {
      if (!isMirrorStorageEvent(event)) {
        return
      }
      if (event.key !== SESSION_MIRROR_STORAGE_KEY) {
        return
      }
      if (event.newValue && !getSessionId()) {
        hydrateSessionStorageFromMirror(sessionApi)
        rehydrateAuthFromMirror(store)
      }
    }
    window.addEventListener('storage', onStorage)

    return () => {
      unsubscribe()
      window.removeEventListener('storage', onStorage)
    }
  }, [store])

  return null
}
