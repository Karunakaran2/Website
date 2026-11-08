/**
 * Page-local actions and filters — render below the shell PageSectionHeaderBar, not inside it.
 */
export default function PageContentToolbar({ children, className = '' }) {
  if (children == null) {
    return null
  }

  return (
    <div
      className={`mb-4 flex w-full min-w-0 flex-wrap items-center justify-start gap-2 sm:justify-end ${className}`.trim()}
    >
      {children}
    </div>
  )
}
