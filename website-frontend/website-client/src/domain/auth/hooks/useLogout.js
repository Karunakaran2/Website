import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from 'react-redux'
import { ROUTES } from '@/shared/constants'
import { clearSetupReturnRoute } from '@/app/shell/utils/setupReturnNav'
import { endAuthenticatedSession } from '../utils/completeSessionLogout'
import { rememberLogoutDestination } from '../utils/session'

function probityLoginUrl() {
  const base = String(import.meta.env.BASE_URL || '/').replace(/\/+$/, '')
  return base ? `${base}/` : '/'
}

export function useLogout() {
  const store = useStore()
  const navigate = useNavigate()

  return useCallback(async () => {
    clearSetupReturnRoute()
    const destination = rememberLogoutDestination(probityLoginUrl())
    await endAuthenticatedSession(store, { redirect: destination.spfo })
    if (destination.spfo) {
      window.location.replace(destination.url)
      return
    }
    navigate(ROUTES.LOGIN, { replace: true })
  }, [navigate, store])
}
