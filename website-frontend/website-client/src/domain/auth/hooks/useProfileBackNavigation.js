import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants'

function isSafeReturnPath(path) {
  return (
    typeof path === 'string' &&
    path.startsWith('/') &&
    !path.startsWith('//') &&
    path !== ROUTES.MY_PROFILE
  )
}

export function useProfileBackNavigation() {
  const navigate = useNavigate()
  const location = useLocation()

  const goBackFromProfile = useCallback(() => {
    const returnTo = location.state?.returnTo
    if (isSafeReturnPath(returnTo)) {
      navigate(returnTo, { replace: true })
      return
    }
    if (window.history.length > 1) {
      navigate(-1)
      return
    }
    navigate(ROUTES.HOME, { replace: true })
  }, [location.state, navigate])

  return goBackFromProfile
}

/** Pass when navigating to My Profile so Back returns to the opener route. */
export function buildProfileNavigationState(fromLocation) {
  const path = `${fromLocation.pathname}${fromLocation.search}${fromLocation.hash}`
  if (!isSafeReturnPath(path)) {
    return undefined
  }
  return { returnTo: path }
}
