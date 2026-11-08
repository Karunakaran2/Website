import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useStore } from 'react-redux'
import { ROUTES } from '@/shared/constants'
import {
  getPendingLogoutDestination,
  getSessionId,
  getRefreshToken,
  getSeatSelected,
  setRefreshToken,
  setSeatSelected,
  setSessionId,
} from '../utils/session'
import { ensureSharedSessionHydrated } from '../utils/sessionBootstrap'
import { hydrateSessionStorageFromMirror } from '../utils/sessionMirror'
import { completeSessionLogout } from '../utils/completeSessionLogout'

const PUBLIC_PATHS = new Set([
  ROUTES.LOGIN,
  '/login',
  ROUTES.DEPARTMENT_LOGIN,
  ROUTES.MODULE_LOGIN,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.ONE_TIME_REGISTRATION,
  ROUTES.APPLICATION_TRACKING,
  ROUTES.ACCESSIBILITY_STATEMENT,
  ROUTES.SCREEN_READER_ACCESS,
])

export function isPublicPath(pathname) {
  if (PUBLIC_PATHS.has(pathname)) {
    return true
  }
  return pathname.startsWith(`${ROUTES.LOGIN}?`)
}

function loginUrl() {
  const base = String(import.meta.env.BASE_URL || '/').replace(/\/+$/, '')
  return base ? `${base}/` : '/'
}

const sessionApi = {
  getSessionId,
  setSessionId,
  setRefreshToken,
  setSeatSelected,
}

/**
 * When the shared login token is cleared (expired session, logout in another tab, devtools),
 * purge Redux auth + RTK cache so setup/asset lists do not show stale data.
 */
export default function SessionGuard() {
  const store = useStore()
  const { pathname } = useLocation()

  useEffect(() => {
    if (isPublicPath(pathname)) {
      return undefined
    }

    const enforceSession = () => {
      ensureSharedSessionHydrated(store)
      hydrateSessionStorageFromMirror(sessionApi)
      if (getSessionId()) {
        return
      }
      const pendingLogout = getPendingLogoutDestination()
      if (pendingLogout?.spfo) {
        window.location.replace(pendingLogout.url)
        return
      }
      completeSessionLogout(store, { redirect: false, broadcastCrossTab: false })
      window.location.replace(loginUrl())
    }

    enforceSession()
    window.addEventListener('storage', enforceSession)
    window.addEventListener('focus', enforceSession)
    const intervalId = window.setInterval(enforceSession, 2000)

    return () => {
      window.removeEventListener('storage', enforceSession)
      window.removeEventListener('focus', enforceSession)
      window.clearInterval(intervalId)
    }
  }, [pathname, store])

  return null
}
