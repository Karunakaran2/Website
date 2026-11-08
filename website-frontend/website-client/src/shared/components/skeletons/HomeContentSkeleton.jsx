import React from 'react'
import SkeletonBlock from '@/shared/components/skeleton/SkeletonBlock'

/**
 * Skeleton for an individual module card in the 2-column grid.
 * Matches PortalModulesGrid cards (min-h-[136px], rounded-2xl, icon + badge, title + chevron).
 */
function ModuleCardSkeleton() {
  return (
    <div className="flex min-h-[136px] flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs">
      {/* Top Row: Icon container on Left, Status badge on Right */}
      <div className="flex items-start justify-between gap-2">
        <SkeletonBlock className="h-11 w-11 shrink-0 rounded-xl bg-blue-100/50" />
        <SkeletonBlock className="h-5 w-18 rounded-full bg-slate-100" />
      </div>

      {/* Bottom Row: Title + Description on Left, Circular Chevron on Right */}
      <div className="mt-3 flex items-end justify-between gap-2">
        <div className="min-w-0 flex-1 space-y-1.5">
          <SkeletonBlock className="h-4 w-3/4 rounded-md" />
          <SkeletonBlock className="h-3 w-1/2 rounded-md bg-slate-100" />
        </div>
        <SkeletonBlock className="h-7 w-7 shrink-0 rounded-full border border-slate-200/80 bg-slate-50" />
      </div>
    </div>
  )
}

/**
 * Skeleton for an individual inbox table row.
 */
function InboxTableRowSkeleton({ isLast = false }) {
  return (
    <tr className={`border-b ${isLast ? 'border-transparent' : 'border-slate-100'} bg-white`}>
      <td className="px-3 py-3 text-center">
        <SkeletonBlock className="mx-auto h-3.5 w-3.5 rounded border border-slate-300 bg-slate-100" />
      </td>
      <td className="px-2 py-3 text-center">
        <SkeletonBlock className="mx-auto h-3 w-4 rounded bg-slate-200" />
      </td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-2 w-2 shrink-0 rounded-full bg-blue-400" />
          <SkeletonBlock className="h-3.5 w-48 sm:w-64 max-w-full rounded" />
        </div>
      </td>
      <td className="hidden sm:table-cell px-3 py-3">
        <SkeletonBlock className="h-3 w-28 rounded bg-slate-200" />
      </td>
      <td className="hidden md:table-cell px-3 py-3">
        <SkeletonBlock className="h-3 w-20 rounded bg-slate-200" />
      </td>
      <td className="px-3 py-3 text-center">
        <SkeletonBlock className="mx-auto h-5 w-16 rounded-full bg-slate-100" />
      </td>
    </tr>
  )
}

/**
 * HomeContentSkeleton
 * High-fidelity skeleton matching the KRAN Design System Portal Landing Page (/home).
 * Replicates the 2-column layout (Left ~60% Inbox Card, Right ~40% Modules Grid)
 * preventing layout shift and flickering during page load.
 */
export default function HomeContentSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading portal workspace"
      className="w-full"
    >
      {/* 2-Column Desktop Grid matching KranDesignSystemLanding */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 items-start">
        {/* Left Column (~60%): Inbox Card Skeleton */}
        <div className="lg:col-span-7 xl:col-span-7 min-w-0">
          <section className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
            {/* Header: Title + Unread on Left, Filter Pills on Right */}
            <div className="flex flex-col gap-3 pb-5 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100">
              <div className="flex items-center gap-3">
                <SkeletonBlock className="h-12 w-12 shrink-0 rounded-xl bg-blue-100/60" />
                <div className="space-y-1.5">
                  <SkeletonBlock className="h-5 w-20 rounded-md" />
                  <SkeletonBlock className="h-3 w-28 rounded-md bg-slate-100" />
                </div>
              </div>

              {/* Filter Pills Placeholder */}
              <div className="inline-flex self-start sm:self-auto rounded-lg bg-slate-100/80 p-1 border border-slate-200/70 gap-1">
                <SkeletonBlock className="h-7 w-12 rounded-md bg-blue-200/60" />
                <SkeletonBlock className="h-7 w-16 rounded-md bg-white/70" />
                <SkeletonBlock className="h-7 w-16 rounded-md bg-white/70" />
              </div>
            </div>

            {/* Controls Row: Show entries on Left, Search on Right */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3.5">
              <div className="flex items-center gap-2">
                <SkeletonBlock className="h-4 w-32 rounded-md bg-slate-100" />
              </div>
              <SkeletonBlock className="h-9 w-full sm:w-60 rounded-lg border border-slate-200 bg-slate-50" />
            </div>

            {/* Table Shell */}
            <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500">
                    <th className="w-10 px-3 py-2.5 text-center">
                      <SkeletonBlock className="mx-auto h-3.5 w-3.5 rounded bg-slate-200" />
                    </th>
                    <th className="w-8 px-2 py-2.5 text-center">
                      <SkeletonBlock className="mx-auto h-3 w-3 rounded bg-slate-200" />
                    </th>
                    <th className="px-3 py-2.5">
                      <SkeletonBlock className="h-3 w-24 rounded bg-slate-200" />
                    </th>
                    <th className="hidden sm:table-cell px-3 py-2.5">
                      <SkeletonBlock className="h-3 w-24 rounded bg-slate-200" />
                    </th>
                    <th className="hidden md:table-cell px-3 py-2.5">
                      <SkeletonBlock className="h-3 w-16 rounded bg-slate-200" />
                    </th>
                    <th className="w-24 px-3 py-2.5 text-center">
                      <SkeletonBlock className="mx-auto h-3 w-14 rounded bg-slate-200" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 4 }, (_, i) => (
                    <InboxTableRowSkeleton key={i} isLast={i === 3} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer / Pagination */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-slate-100">
              <SkeletonBlock className="h-3.5 w-44 rounded bg-slate-100" />
              <div className="flex items-center gap-1 self-end sm:self-auto">
                <SkeletonBlock className="h-7 w-7 rounded border border-slate-200 bg-slate-50" />
                <SkeletonBlock className="h-7 w-7 rounded border border-slate-200 bg-slate-50" />
                <SkeletonBlock className="h-7 w-7 rounded border border-blue-200 bg-blue-50/60" />
                <SkeletonBlock className="h-7 w-7 rounded border border-slate-200 bg-slate-50" />
                <SkeletonBlock className="h-7 w-7 rounded border border-slate-200 bg-slate-50" />
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (~40%): Modules Grid Skeleton */}
        <div className="lg:col-span-5 xl:col-span-5 min-w-0">
          <section className="flex flex-col gap-4">
            {/* Header: Title + Subtitle */}
            <div className="space-y-1">
              <SkeletonBlock className="h-6 w-28 rounded-md" />
              <SkeletonBlock className="h-3.5 w-60 rounded-md bg-slate-100" />
            </div>

            {/* 2-Column Responsive Card Grid (8 module cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {Array.from({ length: 8 }, (_, i) => (
                <ModuleCardSkeleton key={i} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
