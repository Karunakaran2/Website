import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/shared/constants'
import { getPendingLogoutDestination, getSeatSelected, getSessionId } from '@/domain/auth/utils/session'
import { selectAuthUser } from '@/domain/auth/redux/selectors'

export default function RequireAuth({ children, requireSeat = false }) {
  const user = useSelector(selectAuthUser)
  const token = getSessionId() || user?.accessToken || ''
  const seatSelected =
    typeof user?.seatSelected === 'boolean' ? user.seatSelected : getSeatSelected()

  const pendingLogout = getPendingLogoutDestination()
  if (!token) {
    if (pendingLogout?.spfo) {
      window.location.replace(pendingLogout.url)
      return null
    }
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (requireSeat && seatSelected !== true) {
    return <Navigate to={ROUTES.SEATS} replace />
  }

  return children
}
