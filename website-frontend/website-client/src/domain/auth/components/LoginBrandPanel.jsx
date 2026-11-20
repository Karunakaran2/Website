import { useTranslation } from 'react-i18next'
import brandBackground from '@/assets/BG.jpg'
import kranLogo from '@/assets/KRAN.png'

/** Login left column — brand imagery only (form copy lives in the right column). */
export default function LoginBrandPanel() {
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
        <header className="shrink-0">
          <img
            src={kranLogo}
            alt={t('hostPortal.kranLogoAlt', 'KRAN Consulting')}
            className="block h-auto w-auto max-h-9 max-w-[9.5rem] object-contain object-left sm:max-h-10 sm:max-w-[10.5rem] lg:max-h-11 lg:max-w-[11rem]"
          />
        </header>
      </div>
    </aside>
  )
}