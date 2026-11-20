import { ModuleSectionSubtitle, ModuleSectionTitle } from '@/shared/components/typography'
import { PAGE_SECTION_BODY_CLASS, PAGE_SECTION_SHELL_CLASS } from '@/shared/components/page/pageHeaderStyles'

/** Section overview — counts only; tabs live in the module sub-navigation bar. */
export default function WebsiteCmsSectionOverview({ title, subtitle, footer }) {
  return (
    <section className={`${PAGE_SECTION_SHELL_CLASS} min-w-0 w-full`}>
      <div className={`${PAGE_SECTION_BODY_CLASS} space-y-2`}>
        <ModuleSectionTitle>{title}</ModuleSectionTitle>
        {subtitle ? <ModuleSectionSubtitle>{subtitle}</ModuleSectionSubtitle> : null}
        {footer ? <p className="text-sm text-slate-600">{footer}</p> : null}
      </div>
    </section>
  )
}