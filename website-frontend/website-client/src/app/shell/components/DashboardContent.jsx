import { Suspense, useMemo } from 'react'
import { RouteErrorBoundary } from '@/shared/components/ErrorBoundary'
import DashboardOverviewSkeleton from '@/domain/dashboard/components/DashboardOverviewSkeleton'
import DashboardContentSkeleton from '@/shared/components/skeletons/DashboardContentSkeleton'
import { useDashboardNav } from '../hooks/useDashboardNav'
import { useDashboardRouteIds } from '../hooks/useDashboardRouteIds'
import { resolveDashboardPage } from '@/app/routes/loadDomainPages'
import { isDashboardOverviewRoute } from '../utils/dashboardSkeleton'

/** Inner pages — padding comes from ModuleContentShell (SPFO module pattern). */
function DashboardSection({ children }) {
  return <div className="w-full min-w-0 overflow-visible">{children}</div>
}

export default function DashboardContent() {
  const routeIds = useDashboardRouteIds()
  const { activePrimaryId, activeSecondaryId } = useDashboardNav()
  const primaryId = routeIds?.primaryId ?? activePrimaryId
  const secondaryId = routeIds?.secondaryId ?? activeSecondaryId
  const Page = resolveDashboardPage(primaryId, secondaryId)

  const contentFallback = useMemo(() => {
    if (isDashboardOverviewRoute(primaryId, secondaryId)) {
      return <DashboardOverviewSkeleton />
    }
    return <DashboardContentSkeleton />
  }, [primaryId, secondaryId])

  if (!Page) {
    return (
      <DashboardSection>
        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
          <p className="text-sm font-medium text-slate-600">This section is not available yet.</p>
        </div>
      </DashboardSection>
    )
  }

  return (
    <DashboardSection>
      <RouteErrorBoundary variant="section">
        <Suspense fallback={contentFallback}>
          <Page />
        </Suspense>
      </RouteErrorBoundary>
    </DashboardSection>
  )
}
