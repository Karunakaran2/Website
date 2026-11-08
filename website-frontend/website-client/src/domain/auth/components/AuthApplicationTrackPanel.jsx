import { useTranslation } from 'react-i18next'
import { ArrowRight, FileText, Globe } from 'lucide-react'
import {
  loginTrackPanelButtonClass,
  loginTrackPanelFormRowClass,
  loginTrackPanelInputClass,
} from '@/domain/auth/constants/loginFormStyles'

/**
 * Login left-column tracking widget (SPFO LoginLayout “See Application Progress”).
 */
export default function AuthApplicationTrackPanel({
  trackingIdInput = '',
  onTrackingIdChange,
  onSubmit,
}) {
  const { t } = useTranslation()
  const trackingLabel = t('trackApplication.trackingId', 'Tracking ID')

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <h3 className="m-0 text-sm font-bold leading-snug text-[#01458e] sm:text-[15px]">
          {t('trackApplication.panelTitle', 'See Application Progress')}
        </h3>
        <p className="m-0 mb-2.5 mt-1 text-xs leading-relaxed text-slate-600 sm:text-[13px]">
          {t(
            'trackApplication.panelDesc',
            'Check the current status of your application and stay updated on the approval process',
          )}
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit?.(event)
          }}
          className={loginTrackPanelFormRowClass}
        >
          <input
            type="text"
            value={trackingIdInput}
            onChange={(event) => onTrackingIdChange?.(event.target.value)}
            placeholder={t('trackApplication.placeholder', 'Enter the Tracking ID')}
            className={loginTrackPanelInputClass}
            autoComplete="off"
            aria-label={trackingLabel}
          />
          <button type="submit" className={loginTrackPanelButtonClass}>
            {t('trackApplication.track', 'Track')}
            <ArrowRight className="h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden />
          </button>
        </form>
      </div>
      <div className="flex flex-col gap-2 bg-[#F4F7FB] px-4 py-3 text-xs font-medium leading-snug text-slate-800 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2 sm:gap-y-1 sm:px-6 sm:py-2.5">
        <span className="inline-flex min-w-0 items-start gap-1.5 sm:items-center">
          <Globe className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#263AB5] sm:mt-0" aria-hidden />
          <span className="min-w-0">
            {t('brand.securityLine1', 'Enterprise-grade security for organisational data')}
          </span>
        </span>
        <span className="hidden text-slate-400 sm:inline" aria-hidden>
          |
        </span>
        <span className="inline-flex min-w-0 items-start gap-1.5 sm:items-center">
          <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#263AB5] sm:mt-0" aria-hidden />
          <span className="min-w-0">
            {t('brand.securityLine2', 'Policy & audit aligned components')}
          </span>
        </span>
      </div>
    </div>
  )
}
