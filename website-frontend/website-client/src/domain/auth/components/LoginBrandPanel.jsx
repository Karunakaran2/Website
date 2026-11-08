import { useTranslation } from 'react-i18next'
import { CheckCircle2 } from 'lucide-react'
import brandBackground from '@/assets/BG.jpg'
import kranLogo from '@/assets/KRAN.png'
import AuthApplicationTrackPanel from './AuthApplicationTrackPanel'
import LoginMockCredentialsPanel from './LoginMockCredentialsPanel'

/**
 * Login left column — layout parity with SPFO LoginLayout (46%, hero + bottom track card).
 */
export default function LoginBrandPanel({
  trackingIdInput,
  onTrackingIdChange,
  onTrackSubmit,
  onApplyMockCredential,
}) {
  const { t } = useTranslation()

  return (
    <aside className="relative flex w-full shrink-0 flex-col overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:h-full lg:min-h-0 lg:w-full lg:p-8 xl:p-10">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <img
          src={brandBackground}
          alt=""
          className="h-full w-full object-cover object-[68%_center]"
        />
        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white/55 via-white/20 to-transparent" />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="shrink-0">
          <header className="mb-4 sm:mb-5">
            <img
              src={kranLogo}
              alt={t('hostPortal.kranLogoAlt', 'KRAN Consulting')}
              className="block h-auto w-auto max-h-9 max-w-[9.5rem] object-contain object-left sm:max-h-10 sm:max-w-[10.5rem] lg:max-h-11 lg:max-w-[11rem]"
            />
          </header>

          <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-blue-200 bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-sm sm:mb-4 sm:px-4">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#263AB5]" aria-hidden />
            <span className="font-noto text-xs font-semibold tracking-wide text-[#1e3a8a] md:text-[13px]">
              {t('brand.taglineBadge', 'Accessible. Modular. Enterprise-ready.')}
            </span>
          </div>

          <div className="max-w-[22rem] sm:max-w-[26rem] md:max-w-[28rem]">
            <h2 className="mb-2 font-noto text-xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-[1.75rem] xl:text-4xl">
              {t('login.brandHeadlineLead')}{' '}
              <span className="text-[#23389a]">{t('login.brandHeadlineAccent')}</span>
            </h2>
            <p className="m-0 font-noto text-[13px] font-normal leading-relaxed text-slate-700 md:text-[14px]">
              {t('login.brandBody')}
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-6 shrink-0 space-y-4 pb-4 sm:mt-auto sm:pb-6 lg:mb-8 lg:pb-0 xl:mb-14">
          <LoginMockCredentialsPanel onApplyCredential={onApplyMockCredential} />
          <AuthApplicationTrackPanel
            trackingIdInput={trackingIdInput}
            onTrackingIdChange={onTrackingIdChange}
            onSubmit={onTrackSubmit}
          />
        </div>
      </div>
    </aside>
  )
}
