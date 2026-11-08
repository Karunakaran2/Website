/**
 * Auth page content width (SPFO-style full page-shell; wide for OTR / tracking cards).
 */
export default function AuthSecondaryContent({ children, width = 'standard' }) {
  const maxWidthClass = width === 'wide' ? 'max-w-6xl' : 'max-w-3xl'
  return (
    <div className={`page-shell mx-auto w-full font-noto ${maxWidthClass}`}>{children}</div>
  )
}
