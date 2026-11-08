import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AuthPageShell from '@/shared/layouts/AuthPageShell'
import AuthLoginLayout from '@/domain/auth/components/AuthLoginLayout'
import ForgotPasswordModal from '@/domain/auth/components/ForgotPasswordModal'
import { useLoginForm } from '@/domain/auth/hooks/useLoginForm'
import LoginForm from './LoginForm'

/** SPFO `/department-login` equivalent — opens with Department user tab selected. */
export default function DepartmentLoginPage() {
  const login = useLoginForm()
  const [searchParams, setSearchParams] = useSearchParams()
  const [forgotOpen, setForgotOpen] = useState(false)

  useEffect(() => {
    if (searchParams.get('forgot') === '1') {
      setForgotOpen(true)
    }
  }, [searchParams])

  const openForgot = useCallback(() => {
    setForgotOpen(true)
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set('forgot', '1')
        return next
      },
      { replace: true },
    )
  }, [setSearchParams])

  const closeForgot = useCallback(() => {
    setForgotOpen(false)
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.delete('forgot')
        return next
      },
      { replace: true },
    )
  }, [setSearchParams])

  return (
    <AuthPageShell variant="login">
      <AuthLoginLayout onApplyMockCredential={login.applyMockCredential}>
        <LoginForm login={login} defaultPortal="department" onOpenForgotPassword={openForgot} />
      </AuthLoginLayout>
      <ForgotPasswordModal open={forgotOpen} onClose={closeForgot} />
    </AuthPageShell>
  )
}
