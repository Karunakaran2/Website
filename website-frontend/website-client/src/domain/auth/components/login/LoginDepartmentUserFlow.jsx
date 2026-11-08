import LoginPasswordForm from '@/domain/auth/components/login/LoginPasswordForm'

export default function LoginDepartmentUserFlow({ login, onOpenForgotPassword }) {
  return (
    <div className="w-full space-y-5">
      <LoginPasswordForm
        login={login}
        identifierLabel="login.username"
        identifierPlaceholder="login.usernamePlaceholder"
        showOtpOption={false}
        onOpenForgotPassword={onOpenForgotPassword}
        showNewUserFooter
      />
    </div>
  )
}
