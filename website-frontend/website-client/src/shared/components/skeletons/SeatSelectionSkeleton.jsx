import Shimmer from '@/shared/components/ui/Shimmer'

export default function SeatSelectionSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-[1180px]"
      aria-busy="true"
      aria-label="Loading allotted seats"
    >
      <Shimmer className="h-8 w-64 max-w-full rounded-lg" />
      <Shimmer className="mt-3 h-5 w-full max-w-2xl rounded-lg" />

      <div className="mt-8 overflow-hidden rounded-md border border-slate-200 bg-white">
        <div className="flex items-start justify-between gap-4 bg-[#F4F7FB] px-5 py-4 sm:px-6">
          <div className="flex-1">
            <Shimmer className="h-5 w-36 rounded-md" />
            <Shimmer className="mt-2 h-4 w-72 max-w-full rounded-md" />
          </div>
          <Shimmer className="h-6 w-16 shrink-0 rounded-full" />
        </div>

        <div className="px-5 py-3 sm:px-6">
          {Array.from({ length: 2 }, (_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 border-b border-slate-100 py-4 last:border-b-0"
            >
              <Shimmer className="h-4 w-6 rounded" />
              <Shimmer className="h-4 w-40 rounded" />
              <Shimmer className="h-4 w-24 rounded" />
              <Shimmer className="h-4 flex-1 rounded" />
              <Shimmer className="h-4 w-28 rounded" />
              <Shimmer className="h-8 w-20 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
