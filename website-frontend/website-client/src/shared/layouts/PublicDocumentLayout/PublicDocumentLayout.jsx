import AuthPageShell from '@/shared/layouts/AuthPageShell'

/** Public policy pages — same chrome as SPFO accessibility / screen-reader pages. */
export default function PublicDocumentLayout({ children }) {
  return <AuthPageShell variant="page">{children}</AuthPageShell>
}
