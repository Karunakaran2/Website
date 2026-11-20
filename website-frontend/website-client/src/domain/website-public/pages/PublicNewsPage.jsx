import { useGetPublicNewsQuery } from '@/domain/website-content/services/contentApi'

export default function PublicNewsPage() {
  const { data: newsItems = [], isLoading, isError } = useGetPublicNewsQuery()

  return (
    <>
      <div className="public-page-hero">
        <h1>News &amp; updates</h1>
      </div>
      <section className="public-section">
        <div className="public-container">
          {isLoading ? <p>Loading news…</p> : null}
          {isError ? <p>Unable to load news right now. Please try again later.</p> : null}
          {!isLoading && !isError && newsItems.length === 0 ? (
            <p className="public-coming-soon">No news items published yet.</p>
          ) : null}
          <div className="public-news-list">
            {newsItems.map((item) => (
              <article key={item.id} className="public-news-card">
                <h3>{item.title ?? item.heading}</h3>
                {item.newsDate ? <time dateTime={item.newsDate}>{item.newsDate}</time> : null}
                {item.description ? <p style={{ marginTop: '0.75rem', lineHeight: 1.6 }}>{item.description}</p> : null}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}