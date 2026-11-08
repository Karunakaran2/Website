import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/shared/constants'
import { getSeatSelected, getSessionId } from '@/domain/auth/utils/session'
import { selectAuthUser } from '@/domain/auth/redux/selectors'

export default function GuestOnly({ children }) {
  const user = useSelector(selectAuthUser)
  const token = user?.accessToken || getSessionId()
  const seatSelected =
    typeof user?.seatSelected === 'boolean' ? user.seatSelected : getSeatSelected()

  if (token && seatSelected === true) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  if (token) {
    return <Navigate to={ROUTES.SEATS} replace />
  }

  return children
}
