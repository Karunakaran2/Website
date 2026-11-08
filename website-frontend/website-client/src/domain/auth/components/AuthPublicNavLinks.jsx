import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '@/shared/constants'

const linkBase =
  'rounded px-2 py-1 text-[13px] font-semibold text-white/90 no-underline transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

export default function AuthPublicNavLinks() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const isLogin = pathname === ROUTES.LOGIN
  const isOtr = pathname === ROUTES.ONE_TIME_REGISTRATION
  const isTracking = pathname === ROUTES.APPLICATION_TRACKING

  return (
    <nav className="flex flex-wrap items-center justify-end gap-1 sm:gap-2" aria-label={t('authCommon.navAria')}>
      {!isLogin ? (
        <Link to={ROUTES.LOGIN} className={linkBase}>
          {t('authCommon.login')}
        </Link>
      ) : null}
      {!isOtr ? (
        <Link to={ROUTES.ONE_TIME_REGISTRATION} className={linkBase} aria-current={isOtr ? 'page' : undefined}>
          {t('login.oneTimeRegistration')}
        </Link>
      ) : null}
      {!isTracking ? (
        <Link to={ROUTES.APPLICATION_TRACKING} className={linkBase}>
          {t('login.trackApplication', 'Track application')}
        </Link>
      ) : null}
      {isLogin ? (
        <button
          type="button"
          className={linkBase}
          onClick={() => navigate(`${ROUTES.LOGIN}?forgot=1`, { replace: false })}
        >
          {t('login.forgotPassword')}
        </button>
      ) : null}
    </nav>
  )
}
