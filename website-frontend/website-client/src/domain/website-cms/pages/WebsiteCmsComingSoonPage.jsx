import { useTranslation } from 'react-i18next'
import { ModuleSectionSubtitle, ModuleSectionTitle } from '@/shared/components/typography'
import { PAGE_SECTION_BODY_CLASS, PAGE_SECTION_SHELL_CLASS } from '@/shared/components/page/pageHeaderStyles'
import { useDashboardRouteIds } from '@/app/shell/hooks/useDashboardRouteIds'

export default function WebsiteCmsComingSoonPage() {
  const { t } = useTranslation()
  const routeIds = useDashboardRouteIds()
  const primaryId = routeIds?.primaryId ?? 'screen'
  const title = t(`nav.primary.${primaryId}`, { defaultValue: primaryId })

  return (
    <section className={`${PAGE_SECTION_SHELL_CLASS} min-w-0 w-full`}>
      <div className={`${PAGE_SECTION_BODY_CLASS} space-y-3`}>
        <ModuleSectionTitle>{title}</ModuleSectionTitle>
        <ModuleSectionSubtitle>
          This item is in the legacy KRAN Admin menu. Connect the matching website-backend API to
          enable full management here.
        </ModuleSectionSubtitle>
      </div>
    </section>
  )
}