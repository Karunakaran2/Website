import { lazy, Suspense, useCallback, useState } from 'react'

const TrackApplicationModal = lazy(() => import('./TrackApplicationModal'))
const LoginBrandPanel = lazy(() => import('./LoginBrandPanel'))

/**
 * Split login layout aligned with SPFO LoginLayout (46% brand / form column).
 */
export default function AuthLoginLayout({
  children,
  formAriaLabel = 'Login form',
  onApplyMockCredential,
}) {
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false)
  const [trackingIdInput, setTrackingIdInput] = useState('')

  const handleTrackSubmit = useCallback((event) => {
    event?.preventDefault()
    setIsTrackModalOpen(true)
  }, [])

  return (
    <>
      <div className="flex min-h-full w-full min-w-0 flex-1 flex-col overflow-x-hidden lg:h-full lg:flex-row lg:overflow-hidden">
        <div className="relative flex w-full shrink-0 flex-col lg:h-full lg:min-h-0 lg:w-[46%]">
          <Suspense fallback={null}>
            <LoginBrandPanel
              trackingIdInput={trackingIdInput}
              onTrackingIdChange={setTrackingIdInput}
              onTrackSubmit={handleTrackSubmit}
              onApplyMockCredential={onApplyMockCredential}
            />
          </Suspense>
        </div>
        <section
          className="flex min-h-0 min-w-0 flex-1 flex-col bg-white lg:overflow-y-auto"
          aria-label={formAriaLabel}
        >
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-6 sm:px-6 sm:py-8 lg:max-w-lg lg:px-8 xl:max-w-xl">
            {children}
          </div>
        </section>
      </div>

      {isTrackModalOpen ? (
        <Suspense fallback={null}>
          <TrackApplicationModal
            isOpen
            onClose={() => setIsTrackModalOpen(false)}
            initialTrackingId={trackingIdInput}
          />
        </Suspense>
      ) : null}
    </>
  )
}
