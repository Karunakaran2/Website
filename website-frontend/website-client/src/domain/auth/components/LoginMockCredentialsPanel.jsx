import { useTranslation } from 'react-i18next'
import AuthDemoNotice from '@/domain/auth/components/AuthDemoNotice'
import { LOGIN_MOCK_CREDENTIALS } from '@/domain/auth/constants/loginMockCredentials'

export default function LoginMockCredentialsPanel({ onApplyCredential }) {
  const { t } = useTranslation()

  if (import.meta.env.VITE_MOCK_API === 'false' || !onApplyCredential) {
    return null
  }

  return (
    <div className="mb-4 sm:mb-5">
      <AuthDemoNotice title={t('login.mockModeTitle', 'Demo environment')}>
        {t(
          'login.mockModeLead',
          'Use any row below to fill the sign-in form. CAPTCHA is filled automatically.',
        )}
      </AuthDemoNotice>
      <ul className="mt-3 space-y-2" aria-label={t('login.mockCredentialsList', 'Demo login accounts')}>
        {LOGIN_MOCK_CREDENTIALS.map((row) => (
          <li
            key={row.username}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200/90 bg-white/95 px-3 py-2.5 shadow-sm backdrop-blur-sm"
          >
            <div className="min-w-0 flex-1">
              <p className="m-0 font-noto text-xs font-semibold text-slate-900">
                {t(`login.mockUser.${row.username}.label`, row.label)}
              </p>
              <p className="m-0 mt-0.5 font-mono text-[11px] text-slate-600">
                {row.username} / {row.password}
              </p>
              <p className="m-0 mt-1 text-[10px] leading-snug text-slate-500">
                {t(`login.mockUser.${row.username}.hint`, row.hint)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onApplyCredential(row.username, row.password)}
              className="shrink-0 cursor-pointer rounded-md border-0 bg-[#263AB5] px-2.5 py-1.5 font-noto text-[11px] font-semibold text-white transition hover:bg-[#1e2e91]"
            >
              {t('login.mockUseAccount', 'Use')}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
