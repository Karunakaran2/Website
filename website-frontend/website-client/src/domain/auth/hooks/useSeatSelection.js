import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants'
import { getSessionId } from '../utils/session'

/** Website CMS does not use Probity seat selection — redirect to home when authenticated. */
export function useSeatSelection() {
  const navigate = useNavigate()
  const hasSession = Boolean(getSessionId())

  useEffect(() => {
    if (hasSession) {
      navigate(ROUTES.HOME, { replace: true })
    } else {
      navigate(ROUTES.LOGIN, { replace: true })
    }
  }, [hasSession, navigate])

  return {
    user: null,
    seats: [],
    isUserLoading: false,
    isSeatsLoading: false,
    userError: null,
    seatsError: null,
    selectingId: '',
    selectError: '',
    selectSeat: async () => {},
  }
}