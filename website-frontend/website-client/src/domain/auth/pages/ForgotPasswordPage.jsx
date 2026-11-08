import { Navigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants'

/** Deep links open forgot-password on the login page modal (SPFO pattern). */
export default function ForgotPasswordPage() {
  return <Navigate to={`${ROUTES.LOGIN}?forgot=1`} replace />
}
