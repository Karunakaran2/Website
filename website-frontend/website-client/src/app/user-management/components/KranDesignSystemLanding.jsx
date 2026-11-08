import PortalInboxCard from '@/app/shell/components/PortalInboxCard'
import PortalModulesGrid from '@/app/shell/components/PortalModulesGrid'

/**
 * Portal landing: two equal-height panels filling space between header and footer.
 */
export default function KranDesignSystemLanding() {
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
