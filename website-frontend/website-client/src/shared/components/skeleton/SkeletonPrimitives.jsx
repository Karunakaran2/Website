import React from 'react'
import PropTypes from 'prop-types'
import SkeletonBlock from './SkeletonBlock'
import FormSkeleton from './FormSkeleton'
import ProbityTableSkeletonBody from './ProbityTableSkeletonBody'
import { DASHBOARD_CHART_GRID_CLASS } from '@/domain/dashboard/constants/dashboardStyles'

export function SkeletonLine({ className = 'h-4 w-full', ...props }) {
  return <SkeletonBlock className={className} {...props} />
}

export function SkeletonTextLines({ lines = 3, className = '' }) {
  const widths = ['w-full', 'w-11/12', 'w-4/5', 'w-3/5']
  return (
    <div className={`space-y-2 ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBlock key={i} className={`h-3.5 ${widths[i % widths.length]}`} />
      ))}
    </div>
  )
}

export function SkeletonHeading({ className = 'h-5 w-48 max-w-full' }) {
  return <SkeletonBlock className={className} />
}

export function SkeletonCircle({ size = 40, className = '' }) {
  const px = typeof size === 'number' ? `${size}px` : size
  return (
    <SkeletonBlock
      className={`shrink-0 rounded-full ${className}`.trim()}
      style={{ width: px, height: px }}
    />
  )
}

export function SkeletonButton({ className = 'h-9 w-28 rounded-md' }) {
  return <SkeletonBlock className={className} />
}

export function SkeletonInput({ className = 'h-10 w-full rounded-md' }) {
  return <SkeletonBlock className={className} />
}

export function SkeletonImage({ className = 'h-32 w-full rounded-lg sm:h-40' }) {
  return <SkeletonBlock className={className} />
}

/** KPI / summary card placeholder — matches SampleMetricCard footprint. */
export function MetricCardSkeleton({ className = '' }) {
  return (
    <div
      className={`rounded-lg border border-slate-200 bg-white p-4 shadow-none ${className}`.trim()}
      aria-hidden="true"
    >
      <div className="flex items-start justify-between gap-2">
        <SkeletonBlock className="h-3 w-24 max-w-[70%]" />
        <SkeletonBlock className="h-8 w-8 shrink-0 rounded-md" />
      </div>
      <SkeletonBlock className="mt-3 h-7 w-32 max-w-[80%]" />
      <SkeletonBlock className="mt-2 h-3 w-40 max-w-full" />
    </div>
  )
}

export function DashboardMetricsSkeleton({ count = 4, className = '' }) {
  return (
    <div
      className={`grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 ${className}`.trim()}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <MetricCardSkeleton key={`metric-sk-${i}`} />
      ))}
    </div>
  )
}

export function ListItemSkeleton({ className = '' }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-3 ${className}`.trim()}
      aria-hidden="true"
    >
      <SkeletonCircle size={36} />
      <div className="min-w-0 flex-1 space-y-2">
        <SkeletonBlock className="h-3.5 w-2/3 max-w-full" />
        <SkeletonBlock className="h-3 w-1/2 max-w-full" />
      </div>
    </div>
  )
}

export function ProfileSkeleton({ className = '' }) {
  return (
    <div className={`flex flex-col gap-4 sm:flex-row sm:items-start ${className}`.trim()} aria-hidden="true">
      <SkeletonCircle size={72} className="mx-auto sm:mx-0" />
      <div className="min-w-0 flex-1 space-y-3">
        <SkeletonBlock className="h-5 w-48 max-w-full" />
        <SkeletonBlock className="h-3 w-36 max-w-full" />
        <SkeletonTextLines lines={2} />
      </div>
    </div>
  )
}

export function PageHeaderSkeleton({ className = '' }) {
  return (
    <div className={`flex flex-wrap items-start justify-between gap-3 ${className}`.trim()} aria-hidden="true">
      <div className="min-w-0 flex-1 space-y-2">
        <SkeletonBlock className="h-5 w-40 max-w-full sm:w-56" />
        <SkeletonBlock className="h-3 w-full max-w-md" />
      </div>
      <div className="flex flex-wrap gap-2">
        <SkeletonButton className="h-9 w-24" />
        <SkeletonButton className="h-9 w-28" />
      </div>
    </div>
  )
}

export function TableSkeleton({
  rows = 5,
  columns = 5,
  showToolbar = true,
  className = '',
}) {
  return (
    <div className={`overflow-x-auto rounded-lg border border-slate-200 bg-white ${className}`.trim()}>
      {showToolbar ? (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 p-3 sm:p-4">
          <SkeletonBlock className="h-4 w-32 max-w-[50%]" />
          <SkeletonBlock className="h-9 w-40 max-w-full rounded-md" />
        </div>
      ) : null}
      <div className="min-w-[480px] p-3 sm:p-4">
        <table className="w-full min-w-0">
          <thead>
            <tr className="border-b border-slate-100">
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="pb-3 pe-2 text-left last:pe-0">
                  <SkeletonBlock className="h-3.5 w-20 max-w-full" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <ProbityTableSkeletonBody rows={rows} columns={columns} />
          </tbody>
        </table>
      </div>
    </div>
  )
}

/** Report generate panel — metrics, charts, table (Probity report module). */
export function ReportResultsSkeleton({ className = '' }) {
  return (
    <div className={`space-y-4 sm:space-y-5 ${className}`.trim()} aria-hidden="true">
      <DashboardMetricsSkeleton count={3} className="lg:grid-cols-3" />
      <div className={DASHBOARD_CHART_GRID_CLASS}>
        <SkeletonBlock className="h-48 w-full rounded-lg sm:h-56" />
        <SkeletonBlock className="h-48 w-full rounded-lg sm:h-56" />
      </div>
      <TableSkeleton rows={4} columns={5} />
    </div>
  )
}

export function SplitPanelSkeleton({ className = '' }) {
  return (
    <div
      className={`grid items-start gap-4 lg:grid-cols-[minmax(16rem,24rem)_minmax(0,1fr)] lg:gap-5 ${className}`.trim()}
      aria-hidden="true"
    >
      <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
        <SkeletonBlock className="h-4 w-32" />
        <FormSkeleton fields={4} cols={1} />
        <div className="flex justify-end gap-2 pt-2">
          <SkeletonButton className="h-9 w-28" />
        </div>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-4 min-h-[20rem]">
        <SkeletonBlock className="h-4 w-36 mb-4" />
        <ReportResultsSkeleton />
      </div>
    </div>
  )
}

SkeletonTextLines.propTypes = { lines: PropTypes.number, className: PropTypes.string }
MetricCardSkeleton.propTypes = { className: PropTypes.string }
DashboardMetricsSkeleton.propTypes = { count: PropTypes.number, className: PropTypes.string }
TableSkeleton.propTypes = {
  rows: PropTypes.number,
  columns: PropTypes.number,
  showToolbar: PropTypes.bool,
  className: PropTypes.string,
}
