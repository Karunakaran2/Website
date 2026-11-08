import {
  PAGE_SECTION_BODY_CLASS,
  PAGE_SECTION_HEADER_SHELL_CLASS,
  PAGE_SECTION_SHELL_CLASS,
} from '@/shared/components/page/pageHeaderStyles'
import { ModuleSectionSubtitle, ModuleSectionTitle } from '@/shared/components/typography'

/**
 * Page card shell aligned with SPFO One Time Registration PageCard layout.
 */
export default function AuthPageCard({ title, subtitle, actions, children, className = '' }) {
  return (
    <section className={`${PAGE_SECTION_SHELL_CLASS} w-full font-noto ${className}`}>
      <header
        className={`${PAGE_SECTION_HEADER_SHELL_CLASS} flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between`}
      >
        <div className="min-w-0">
          <ModuleSectionTitle as="h1" className="!text-[18px] !font-bold text-[#01458e]">
            {title}
          </ModuleSectionTitle>
          {subtitle ? (
            <ModuleSectionSubtitle className="!mt-1">{subtitle}</ModuleSectionSubtitle>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </header>
      <div className={PAGE_SECTION_BODY_CLASS}>{children}</div>
    </section>
  )
}
