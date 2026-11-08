import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import KranMarkLogo from '@/shared/components/branding/KranMarkLogo'
import DownloadSourceZipButton from './DownloadSourceZipButton'
import { formatRemaining } from '@/domain/auth/session/sessionPolicy'
import { subscribeSessionRemaining } from '@/domain/auth/session/sessionRuntime'

const FOOTER_LINK_CLASS =
  'text-xs font-semibold text-white/95 underline-offset-2 hover:text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

/** Org UI Standard footer — matches spfo_frontend BaseFooter layout. */
export default function AppFooter({ showTsmButton = false }) {
  const { t } = useTranslation()
  const [remainingMs, setRemainingMs] = useState(null)

  useEffect(() => subscribeSessionRemaining(setRemainingMs), [])

  const remainingLabel = remainingMs == null ? null : formatRemaining(remainingMs)

  return (
    <footer className="mt-auto w-full shrink-0 bg-[#01458e] text-white">
      <div className="flex w-full min-w-0 flex-col flex-wrap items-center justify-between gap-y-2 px-3 py-1.5 sm:px-5 xl:px-[20px] lg:flex-row lg:gap-x-4 lg:gap-y-0">
        {/* Left: version, date, session */}
        <div className="flex min-w-0 flex-wrap items-center justify-center gap-x-4 gap-y-1 lg:justify-start">
          <p className="m-0 text-center text-xs text-white/90 lg:text-left">
            {t('version 1.0 , dated 10th october 2026')}
          </p>
          {remainingLabel ? (
            <p className="m-0 whitespace-nowrap text-center text-[12px] font-medium leading-5 text-white lg:text-left">
              {t('Session remaining')}: <span className="tabular-nums">{remainingLabel}</span>
            </p>
          ) : null}
        </div>

        {/* Right: developer links + KRAN logo (Workbench → Guidelines → logo) */}
        <div className="flex min-w-0 flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-4 lg:justify-end">
          {showTsmButton ? (
            <button
              type="button"
              title="Technical Support Management"
              className="inline-flex h-6 min-w-[4.25rem] shrink-0 items-center justify-center rounded-sm bg-[#e6b800] px-3.5 text-[12px] font-bold leading-none tracking-wide text-[#01458e] shadow-sm transition hover:bg-[#d9ad00] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:h-7 sm:min-w-[5rem] sm:px-4"
            >
              TSM
            </button>
          ) : null}

          <nav
            aria-label={t('footer.developerNav', 'Developer resources')}
            className="flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3"
          >
            <Link to="/component-workbench/overview/module-overview" className={FOOTER_LINK_CLASS}>
              Component Workbench
            </Link>
            <span className="text-xs text-white/50 select-none" aria-hidden="true">
              |
            </span>
            <Link to="/design-guidelines/guide-principles/overview" className={FOOTER_LINK_CLASS}>
              Design Guidelines
            </Link>
          </nav>

          <span className="hidden text-xs text-white/50 sm:inline select-none" aria-hidden="true">
            |
          </span>

          <DownloadSourceZipButton />

          <a
            href="https://kran.co.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <KranMarkLogo />
          </a>
        </div>
      </div>
    </footer>
  )
}
