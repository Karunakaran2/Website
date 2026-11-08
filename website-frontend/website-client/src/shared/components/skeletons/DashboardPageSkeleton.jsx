import { useLocation } from 'react-router-dom'
import DashboardOverviewSkeleton from '@/domain/dashboard/components/DashboardOverviewSkeleton'
import SkeletonBlock from '@/shared/components/skeleton/SkeletonBlock'
import { isDashboardOverviewPathname } from '@/app/shell/utils/dashboardSkeleton'

function NavPills({ count, widthClass = 'w-20' }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <SkeletonBlock
          key={index}
          className={`h-6 ${widthClass} rounded-md bg-black/10`}
        />
      ))}
    </>
  )
}

function TableRowSkeleton({ cells = 6 }) {
  return (
    <div className="grid grid-cols-6 gap-3 border-b border-slate-100 px-3 py-3">
      {Array.from({ length: cells }, (_, index) => (
        <SkeletonBlock
          key={index}
          className={`h-4 ${index === 0 ? 'w-8' : 'w-full'} ${index === cells - 1 ? 'w-16 justify-self-end' : ''}`}
        />
      ))}
    </div>
  )
}

/** Full logged-in dashboard chrome + content skeleton (hard refresh / lazy route). */
export default function DashboardPageSkeleton() {
  const { pathname } = useLocation()
  const isOverview = isDashboardOverviewPathname(pathname)

  return (
    <div
      className="flex h-svh min-h-0 w-full flex-col overflow-hidden bg-[#FDFEFF]"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div className="sticky top-0 z-[60] w-full shrink-0 bg-white shadow-sm">
        <div className="flex h-8 items-center justify-between border-b border-slate-200 bg-slate-100 px-4">
          <div className="flex items-center gap-2">
            <SkeletonBlock className="h-3 w-16" />
            <SkeletonBlock className="hidden h-3 w-28 sm:block" />
          </div>
          <div className="flex items-center gap-1.5">
            <SkeletonBlock className="h-4 w-8 rounded" />
            <SkeletonBlock className="h-4 w-8 rounded" />
            <SkeletonBlock className="h-4 w-10 rounded" />
          </div>
        </div>

        <header className="flex h-[73px] w-full items-center justify-between bg-[#01458e] px-5">
          <div className="flex items-center gap-5">
            <SkeletonBlock className="h-8 w-28 rounded bg-white/25 sm:w-36" />
            <div className="hidden h-6 w-0.5 rounded-full bg-white/30 sm:block" />
            <SkeletonBlock className="hidden h-4 w-48 rounded bg-white/20 sm:block" />
          </div>
          <SkeletonBlock className="h-9 w-9 rounded-full bg-white/25" />
        </header>
      </div>

      <div className="flex h-[40px] w-full shrink-0 items-center gap-3 bg-[#f5c518] px-5">
        <NavPills count={8} />
      </div>

      <div className="box-border flex h-[45px] w-full shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-5">
        <NavPills count={6} widthClass="w-16" />
      </div>

      <main className="custom-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#FDFEFF] px-5 py-5">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-[#F4FAFF] px-4 py-2.5">
            <SkeletonBlock className="h-3.5 w-3.5 rounded" />
            <div className="min-w-0 flex-1 space-y-2">
              <SkeletonBlock className="h-4 w-32 sm:w-44" />
              <SkeletonBlock className="h-3 w-56 max-w-full sm:w-72" />
            </div>
          </div>

          <div className="p-4 sm:p-5">
            {isOverview ? (
              <DashboardOverviewSkeleton />
            ) : (
              <>
                <div className="mb-4 grid gap-3 rounded-lg border border-slate-200 bg-slate-50/40 p-3 sm:grid-cols-2 lg:grid-cols-4">
                  {Array.from({ length: 4 }, (_, index) => (
                    <div key={index} className="space-y-1">
                      <SkeletonBlock className="h-3 w-16" />
                      <SkeletonBlock className="h-10 w-full rounded-md" />
                    </div>
                  ))}
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <div className="border-b border-slate-200 bg-[#F4FAFF] px-3 py-2.5">
                    <div className="grid grid-cols-6 gap-3">
                      {Array.from({ length: 6 }, (_, index) => (
                        <SkeletonBlock key={index} className="h-3 w-16" />
                      ))}
                    </div>
                  </div>
                  {Array.from({ length: 8 }, (_, index) => (
                    <TableRowSkeleton key={index} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="w-full shrink-0 bg-[#01458e] px-5 py-1.5">
        <div className="flex items-center justify-between">
          <SkeletonBlock className="h-2.5 w-52 rounded bg-white/20" />
          <SkeletonBlock className="h-3.5 w-16 rounded bg-white/20" />
        </div>
      </footer>

      <span className="sr-only">Loading page…</span>
    </div>
  )
}
