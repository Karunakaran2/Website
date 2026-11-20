import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import LoginFormLanguageSelect from '@/domain/auth/components/login/LoginFormLanguageSelect'
import LoginDepartmentUserFlow from '@/domain/auth/components/login/LoginDepartmentUserFlow'

/** Single CMS sign-in — website auth-service (`/api/v1/auth/login`). */
export default function LoginForm({ login, onOpenForgotPassword }) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="flex w-full min-w-0 flex-col font-noto">
      <div className="mb-4 flex items-center justify-between gap-2 sm:mb-8 sm:gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 font-noto text-sm font-medium text-[#263AB5]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t('login.back', 'Back')}
        </button>
        <LoginFormLanguageSelect />
      </div>

      <h1 className="m-0 text-center text-2xl font-bold leading-tight text-[#263AB5] sm:text-[1.75rem] sm:leading-none">
        {t('login.signInTitle', 'Sign in')}
      </h1>

      <div className="mt-6 sm:mt-8">
        <LoginDepartmentUserFlow login={login} onOpenForgotPassword={onOpenForgotPassword} />
      </div>
    </div>
  )
}