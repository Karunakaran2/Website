import { WEBSITE_AUTH_ENABLED } from '@/shared/config/websiteAuth'
import WebsiteCmsDashboard from '@/domain/website-cms/pages/WebsiteCmsDashboard'
import PortalInboxCard from '@/app/shell/components/PortalInboxCard'
import PortalModulesGrid from '@/app/shell/components/PortalModulesGrid'
import { PageSectionHeader } from '@/shared/components/page'
import { PAGE_SECTION_HEADER_SHELL_CLASS } from '@/shared/components/page/pageHeaderStyles'
import { MODULE_LANDING_PANEL_CLASS } from '@/shared/constants/moduleLayoutStyles'

/**
 * Portal landing: CMS dashboard (website mode) or design-system demos.
 */
export default function KranDesignSystemLanding() {
  if (WEBSITE_AUTH_ENABLED) {
    return (
      <section className={`${MODULE_LANDING_PANEL_CLASS} flex min-h-0 flex-1 flex-col`}>
        <div className={`${PAGE_SECTION_HEADER_SHELL_CLASS} shrink-0`}>
          <PageSectionHeader
            title="Website administration"
            subtitle="Summary counts and shortcuts matching the module navigation."
          />
        </div>
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <WebsiteCmsDashboard />
        </div>
      </section>
    )
  }

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-2 gap-6 lg:grid-cols-12 lg:grid-rows-1 lg:gap-8">
        <div className="flex min-h-0 flex-col lg:col-span-7">
          <PortalInboxCard />
        </div>
        <div className="flex min-h-0 flex-col lg:col-span-5">
          <PortalModulesGrid />
        </div>
      </div>
    </div>
  )
}