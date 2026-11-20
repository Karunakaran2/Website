import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants'
import { getSessionId } from '../utils/session'

/** SPFO handoff is not used with website-backend auth; send users to CMS home or login. */
export function useModuleLogin() {
  const navigate = useNavigate()

  useEffect(() => {
    if (getSessionId()) {
      navigate(ROUTES.HOME, { replace: true })
      return
    }
    navigate(ROUTES.LOGIN, { replace: true })
  }, [navigate])

  return { error: '' }
}