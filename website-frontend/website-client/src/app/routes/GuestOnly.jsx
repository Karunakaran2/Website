import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ROUTES } from '@/shared/constants'
import { WEBSITE_AUTH_ENABLED } from '@/shared/config/websiteAuth'
import { getWebsiteCmsHomePath } from '@/domain/website-cms/utils/cmsHome'
import { getSeatSelected, getSessionId } from '@/domain/auth/utils/session'
import { selectAuthUser } from '@/domain/auth/redux/selectors'

export default function GuestOnly({ children }) {
  const user = useSelector(selectAuthUser)
  const token = user?.accessToken || getSessionId()
  const seatSelected =
    typeof user?.seatSelected === 'boolean' ? user.seatSelected : getSeatSelected()

  if (token && seatSelected === true) {
    return <Navigate to={WEBSITE_AUTH_ENABLED ? getWebsiteCmsHomePath() : ROUTES.HOME} replace />
  }

  if (token) {
    return <Navigate to={ROUTES.SEATS} replace />
  }

  return children
}
