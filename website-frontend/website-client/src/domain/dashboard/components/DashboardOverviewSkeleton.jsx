import SkeletonBlock from '@/shared/components/skeleton/SkeletonBlock'
import { PAGE_SECTION_SHELL_CLASS } from '@/shared/components/page/pageHeaderStyles'
import {
  DASHBOARD_CHART_GRID_CLASS,
  DASHBOARD_METRIC_GRID_CLASS,
  DASHBOARD_WIDGET_STACK_CLASS,
} from '../constants/dashboardStyles'

function MetricCardSkeleton() {
  return (
    <div className={`${PAGE_SECTION_SHELL_CLASS} relative min-h-[132px] overflow-hidden`}>
      <SkeletonBlock className="absolute inset-y-0 left-0 w-1 rounded-none" />
      <div className="flex h-full min-h-[132px] flex-col gap-3 p-4 pl-5">
        <SkeletonBlock className="h-4 w-2/3 max-w-[180px]" />
        <SkeletonBlock className="h-8 w-1/2 max-w-[120px]" />
        <SkeletonBlock className="mt-auto h-3 w-1/3 max-w-[96px]" />
      </div>
    </div>
  )
}

function ChartWidgetSkeleton() {
  return (
    <div className={`${PAGE_SECTION_SHELL_CLASS} flex min-h-[360px] flex-col gap-4 p-4`}>
      <SkeletonBlock className="h-5 w-48 max-w-[60%]" />
      <SkeletonBlock className="min-h-[280px] flex-1 w-full rounded-md" />
    </div>
  )
}

/** Overview widgets placeholder while card/chart APIs load or refetch. */
export default function DashboardOverviewSkeleton({
  metricCount = 5,
  chartCount = 2,
  className = '',
}) {
  return (
    <div
      className={`${DASHBOARD_WIDGET_STACK_CLASS} ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      <div className={DASHBOARD_METRIC_GRID_CLASS}>
        {Array.from({ length: metricCount }).map((_, index) => (
          <MetricCardSkeleton key={`dashboard-metric-skeleton-${index}`} />
        ))}
      </div>
      <div className={DASHBOARD_CHART_GRID_CLASS}>
        {Array.from({ length: chartCount }).map((_, index) => (
          <ChartWidgetSkeleton key={`dashboard-chart-skeleton-${index}`} />
        ))}
      </div>
    </div>
  )
}
