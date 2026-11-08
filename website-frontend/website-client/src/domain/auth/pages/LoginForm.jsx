import { lazy, Suspense, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { moveHorizontalIndex } from '@/shared/utils/keyboardUtils'
import { FormSkeleton } from '@/shared/components/skeleton'
import LoginFormLanguageSelect from '@/domain/auth/components/login/LoginFormLanguageSelect'
import { loginTabClass } from '@/domain/auth/constants/loginFormStyles'
import { ROUTES } from '@/shared/constants'

const LoginPublicUserFlow = lazy(
  () => import('@/domain/auth/components/login/LoginPublicUserFlow'),
)
const LoginDepartmentUserFlow = lazy(
  () => import('@/domain/auth/components/login/LoginDepartmentUserFlow'),
)

const loginFlowFallback = (
  <div role="status" aria-live="polite" aria-busy="true">
    <FormSkeleton fields={5} cols={1} />
    <span className="sr-only">Loading sign-in form…</span>
  </div>
)

export default function LoginForm({ login, onOpenForgotPassword, defaultPortal = 'department' }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const isDepartmentPortal =
    defaultPortal === 'department' ||
    location.pathname === ROUTES.DEPARTMENT_LOGIN ||
    location.state?.loginPortal === 'department'

  const [activeTab, setActiveTab] = useState(isDepartmentPortal ? 'department' : 'public')
  const [loginMethod, setLoginMethod] = useState('password')
  const tabRefs = useRef([])

  const selectTab = (tab) => {
    setActiveTab(tab)
    setLoginMethod('password')
  }

  const handleTabKeyDown = (event, index) => {
    const nextIndex = moveHorizontalIndex(event.key, index, 2)
    if (nextIndex === index) {
      return
    }
    event.preventDefault()
    selectTab(nextIndex === 0 ? 'public' : 'department')
    tabRefs.current[nextIndex]?.focus()
  }

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
        {loginMethod === 'otp'
          ? t('login.signInWithOtp', 'Sign in with OTP')
          : t('login.signInTitle', 'Sign in')}
      </h1>

      {loginMethod === 'password' ? (
        <div
          className="mt-6 flex gap-2 sm:mt-8 sm:gap-3"
          role="tablist"
          aria-label={t('login.portalTablist', 'Login portal')}
        >
          <button
            ref={(el) => {
              tabRefs.current[0] = el
            }}
            type="button"
            role="tab"
            id="login-tab-public"
            aria-selected={activeTab === 'public'}
            aria-controls="login-panel-public"
            tabIndex={activeTab === 'public' ? 0 : -1}
            className={loginTabClass(activeTab === 'public')}
            onClick={() => selectTab('public')}
            onKeyDown={(event) => handleTabKeyDown(event, 0)}
          >
            {t('login.publicUser', 'Public user')}
          </button>
          <button
            ref={(el) => {
              tabRefs.current[1] = el
            }}
            type="button"
            role="tab"
            id="login-tab-department"
            aria-selected={activeTab === 'department'}
            aria-controls="login-panel-department"
            tabIndex={activeTab === 'department' ? 0 : -1}
            className={loginTabClass(activeTab === 'department')}
            onClick={() => selectTab('department')}
            onKeyDown={(event) => handleTabKeyDown(event, 1)}
          >
            {t('login.departmentUser', 'Department user')}
          </button>
        </div>
      ) : null}

      <div className="mt-6">
        {activeTab === 'public' ? (
          <div
            id="login-panel-public"
            role="tabpanel"
            aria-labelledby="login-tab-public"
            tabIndex={0}
          >
            <Suspense fallback={loginFlowFallback}>
              <LoginPublicUserFlow
                login={login}
                loginMethod={loginMethod}
                setLoginMethod={setLoginMethod}
                onOpenForgotPassword={onOpenForgotPassword}
              />
            </Suspense>
          </div>
        ) : (
          <div
            id="login-panel-department"
            role="tabpanel"
            aria-labelledby="login-tab-department"
            tabIndex={0}
          >
            <Suspense fallback={loginFlowFallback}>
              <LoginDepartmentUserFlow login={login} onOpenForgotPassword={onOpenForgotPassword} />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  )
}
