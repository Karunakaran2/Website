import { Link } from 'react-router-dom'
import { useGetPublicNewsQuery } from '@/domain/website-content/services/contentApi'
import PublicBannerCarousel from '../components/PublicBannerCarousel'
import { PUBLIC_ROUTES } from '../constants/publicRoutes'

const asset = (name) => `${import.meta.env.BASE_URL}kran/${name}`

const QUALITY_CERTS = [
  { img: 'CMMI_quality.png', value: '175+', label: 'CMMI-DEV ML5 V3.0' },
  { img: 'ISO 9001_quality.png', value: '100+', label: 'ISO 9001:2015' },
  { img: 'ISO 27001_quality.png', value: '10+', label: 'ISO/IEC 27001:2022' },
  { img: 'ISO 20000_quality.png', value: '57', label: 'ISO/IEC 20000-1:2018' },
]

const COMPANY_STATS_ROW_A = [
  { value: '30', label: 'Years of Service' },
  { value: '250', label: 'Committed Professionals' },
  { value: '20', label: 'Domain Experts' },
  { value: '3', label: 'Centres of Excellence' },
]

const COMPANY_STATS_ROW_B = [
  { value: '9', label: 'Locations Nationwide' },
  { value: '100', label: 'Satisfied Clients' },
  { value: '100', label: 'e-Governance projects' },
  { value: '40', label: 'Innovative solutions' },
]

export default function PublicWelcomePage() {
  const { data: newsItems = [] } = useGetPublicNewsQuery()
  const latestNews = Array.isArray(newsItems) ? newsItems.slice(0, 3) : []

  return (
    <>
      <PublicBannerCarousel />

      <section className="public-section">
        <div className="public-container">
          <div className="public-quality-grid">
            {QUALITY_CERTS.map((cert) => (
              <article key={cert.label} className="public-quality-card">
                <img src={asset(cert.img)} alt="" />
                <h3>{cert.value}</h3>
                <p>{cert.label}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="public-about">
        <div className="public-about__media">
          <img src={asset('about/about-us-4.jpg')} alt="KRAN team at work" />
        </div>
        <div className="public-about__content">
          <h2>About us</h2>
          <h1>
            Pioneers of Digital Transformation
            <br />
            in Public Administration
          </h1>
          <p>
            KRAN has been one of the leaders in the country to bring transformation in the Government
            Sector through e-Governance solutions. Over the past 30 years, KRAN has dedicated its
            efforts exclusively to the government sector and has participated in numerous
            mission-critical projects throughout the country.
          </p>
          <Link to={PUBLIC_ROUTES.ABOUT} className="public-btn public-btn--primary">
            Know more
          </Link>
        </div>
      </section>

      <section className="public-section public-section--muted">
        <div className="public-container">
          <div className="public-stats-grid">
            {COMPANY_STATS_ROW_A.map((stat) => (
              <div key={stat.label} className="public-stat">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <div className="public-stats-grid" style={{ marginTop: '1px' }}>
            {COMPANY_STATS_ROW_B.map((stat) => (
              <div key={stat.label} className="public-stat">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section">
        <div className="public-container public-vision-grid">
          <article className="public-vision-card public-vision-card--vision">
            <div className="public-vision-card__title">
              <img src={asset('about/vision.png')} alt="" />
              <span>Vision</span>
            </div>
            <p>
              To be a leading provider of innovative solutions that transform organizations and drive
              positive change, recognized for excellence, empathy, and environmental responsibility.
            </p>
          </article>
          <article className="public-vision-card public-vision-card--mission">
            <div className="public-vision-card__title">
              <img src={asset('about/mission.png')} alt="" />
              <span>Mission</span>
            </div>
            <p>
              Deliver world-class consulting services and simple solutions to complex problems for
              government and public-sector clients across India.
            </p>
          </article>
        </div>
      </section>

      {latestNews.length > 0 ? (
        <section className="public-section public-section--muted">
          <div className="public-container">
            <h2 style={{ marginTop: 0, fontFamily: 'Montserrat, sans-serif' }}>Latest news</h2>
            <div className="public-news-list">
              {latestNews.map((item) => (
                <article key={item.id} className="public-news-card">
                  <h3>{item.title ?? item.heading}</h3>
                  {item.newsDate ? <time dateTime={item.newsDate}>{item.newsDate}</time> : null}
                </article>
              ))}
            </div>
            <p style={{ marginTop: '1.5rem' }}>
              <Link to={PUBLIC_ROUTES.NEWS} className="public-btn public-btn--ghost">
                View all news
              </Link>
            </p>
          </div>
        </section>
      ) : null}
    </>
  )
}