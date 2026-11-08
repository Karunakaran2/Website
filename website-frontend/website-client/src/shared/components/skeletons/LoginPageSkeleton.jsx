import Shimmer from '@/shared/components/ui/Shimmer'
import LoginFormSkeleton from '@/shared/components/skeletons/LoginFormSkeleton'
import AuthPageShell from '@/shared/layouts/AuthPageShell'

function BrandPanelSkeleton() {
  return (
    <section
      className="relative isolate h-full min-h-0 w-full overflow-hidden bg-[#eef4fc] max-lg:min-h-[min(100dvh,42rem)] lg:h-full lg:min-h-0"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/88 via-[#eef4fc]/78 to-[#dbe8f9]/72" />

      <div className="relative z-10 flex h-full min-h-[inherit] w-full max-w-full flex-col px-4 py-5 sm:px-6 sm:py-6 md:px-7 md:py-7 lg:px-[66px] lg:py-[40px]">
        <div className="flex shrink-0 items-start justify-between gap-2 max-[399px]:gap-2 sm:gap-4 md:gap-6">
          <div className="ml-0 mt-6 min-w-0 sm:mt-6 md:mt-8 lg:mt-[40px]">
            <Shimmer className="h-9 w-28 sm:h-10 sm:w-32 lg:h-11 lg:w-36" />
            <Shimmer className="mt-1 h-4 w-44 sm:w-52 lg:h-5" />
          </div>
          <Shimmer className="h-6 w-20 shrink-0 max-[399px]:h-6 max-[399px]:w-20 sm:h-8 sm:w-32 md:h-9 md:w-36 lg:h-12 lg:w-44" />
        </div>

        <div className="ml-0 mt-8 shrink-0 sm:mt-10 md:mt-12 lg:mt-[48px]">
          <Shimmer className="h-9 w-full max-w-[280px] sm:h-10 sm:max-w-[320px] lg:h-12 lg:max-w-[360px]" />
          <Shimmer className="mt-1 h-9 w-full max-w-[300px] sm:h-10 sm:max-w-[340px] lg:h-12 lg:max-w-[380px]" />
          <Shimmer className="mt-4 h-14 w-full max-w-[439px] lg:h-16" />
        </div>

        <div className="mt-auto mb-4 w-full min-w-0 shrink-0 pt-6 max-sm:mb-4 sm:mb-6 lg:mb-0 lg:pt-0">
          <div className="flex h-[84px] min-h-[84px] flex-col overflow-hidden !rounded-[5px] border border-white/90 bg-white/95 shadow-[0_8px_28px_rgba(15,40,80,0.09)] sm:h-[90px] sm:min-h-[90px] lg:h-[169px] lg:min-h-[169px]">
            <div className="flex h-full w-full min-w-0 divide-x divide-slate-200/90">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="flex min-w-0 flex-1 basis-0 flex-col items-center justify-center px-1 py-2 sm:px-1.5 sm:py-3 md:px-2 md:py-4 lg:px-4 lg:py-[22px]"
                >
                  <Shimmer className="h-5 w-5 rounded-md sm:h-6 sm:w-6 md:h-7 md:w-7 lg:h-9 lg:w-9" />
                  <Shimmer className="mt-1 h-2.5 w-10 sm:mt-1.5 sm:h-3 sm:w-12 lg:mt-2 lg:h-3.5 lg:w-16" />
                  <Shimmer className="mt-0.5 h-2 w-full max-w-[3.5rem] sm:max-w-[4.75rem] lg:mt-1 lg:max-w-[7.5rem]" />
                </div>
              ))}
            </div>
          </div>

          <Shimmer className="mt-4 h-2.5 w-full max-w-[14rem] sm:mt-5 sm:h-3" />
        </div>
      </div>
    </section>
  )
}

/** Same chrome as loaded login — accessibility bar stays visible while lazy-loading. */
export default function LoginPageSkeleton() {
  return (
    <AuthPageShell variant="login">
      <div
        className="grid min-h-0 flex-1 grid-cols-1 bg-white lg:grid-cols-2 lg:grid-rows-1"
        aria-busy="true"
        aria-label="Loading login page"
      >
        <BrandPanelSkeleton />
        <section className="flex min-h-0 items-center justify-center px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:h-full lg:px-[72px] lg:py-0 xl:px-[88px]">
          <LoginFormSkeleton />
        </section>
      </div>
    </AuthPageShell>
  )
}
