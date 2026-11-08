import Shimmer from '@/shared/components/ui/Shimmer'

function FormFieldSkeleton() {
  return (
    <div className="mb-6">
      <Shimmer className="mb-2 h-5 w-24" />
      <Shimmer className="h-[58px] w-full rounded-md" />
    </div>
  )
}

export default function LoginFormSkeleton() {
  return (
    <div className="w-full max-w-[550px]" aria-busy="true" aria-label="Loading login form">
      <Shimmer className="h-10 w-3/4" />
      <Shimmer className="mt-3 h-6 w-full max-w-md" />

      <div className="mt-8 lg:mt-10">
        <FormFieldSkeleton />

        <div className="mb-6">
          <Shimmer className="mb-2 h-5 w-24" />
          <Shimmer className="h-[58px] w-full rounded-md" />
          <div className="mt-3.5 flex w-full justify-end">
            <Shimmer className="h-5 w-36 max-w-[60%] shrink-0 sm:w-40" />
          </div>
        </div>

        <div className="mb-6">
          <Shimmer className="mb-2 h-5 w-24" />
          <div className="mb-3 flex items-center gap-3">
            <Shimmer className="h-[50px] w-[160px] rounded-md" />
            <Shimmer className="h-[50px] w-[50px] rounded-md" />
          </div>
          <Shimmer className="h-[58px] w-full rounded-md" />
        </div>
      </div>

      <Shimmer className="h-[58px] w-full rounded-none" />

      <div className="mt-10 flex items-center gap-4 lg:mt-12">
        <Shimmer className="h-px flex-1" />
        <Shimmer className="h-5 w-52 shrink-0" />
        <Shimmer className="h-px flex-1" />
      </div>
    </div>
  )
}
