export default function PublicComingSoonPage({ title = 'Coming soon' }) {
  return (
    <>
      <div className="public-page-hero">
        <h1>{title}</h1>
      </div>
      <p className="public-coming-soon">
        This section matches the legacy KRAN site navigation and will be wired to catalog and
        engagement services next.
      </p>
    </>
  )
}