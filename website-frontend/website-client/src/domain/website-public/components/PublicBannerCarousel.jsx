import { useEffect, useMemo, useState } from 'react'
import { useGetPublicBannersQuery } from '@/domain/website-content/services/contentApi'

const FALLBACK_SLIDES = [
  {
    id: 'fallback-1',
    title: 'Simple IT Solutions for Overall Transformation',
    heading: 'KRAN Consulting',
    imagePath: `${import.meta.env.BASE_URL}kran/about/about-us-4.jpg`,
  },
]

function resolveImageUrl(imagePath) {
  if (!imagePath) {
    return FALLBACK_SLIDES[0].imagePath
  }
  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath
  }
  return imagePath.startsWith('/') ? imagePath : `${import.meta.env.BASE_URL}${imagePath}`
}

export default function PublicBannerCarousel() {
  const { data: rows } = useGetPublicBannersQuery()
  const slides = useMemo(() => {
    if (Array.isArray(rows) && rows.length > 0) {
      return rows
    }
    return FALLBACK_SLIDES
  }, [rows])

  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) {
      return undefined
    }
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length)
    }, 4500)
    return () => window.clearInterval(timer)
  }, [slides.length])

  const active = slides[index] ?? slides[0]

  return (
    <section className="public-banner" aria-label="Highlights">
      <div
        className="public-banner__slide"
        style={{ backgroundImage: `url(${resolveImageUrl(active?.imagePath)})` }}
      >
        <div className="public-banner__overlay" />
        <div className="public-banner__caption">
          {active?.heading ? <p className="public-banner__heading">{active.heading}</p> : null}
          {active?.title ? <p className="public-banner__heading">{active.title}</p> : null}
        </div>
      </div>
      {slides.length > 1 ? (
        <div className="public-banner__dots" role="tablist" aria-label="Banner slides">
          {slides.map((slide, slideIndex) => (
            <button
              key={slide.id ?? slideIndex}
              type="button"
              className={`public-banner__dot${slideIndex === index ? ' is-active' : ''}`}
              aria-label={`Show slide ${slideIndex + 1}`}
              aria-selected={slideIndex === index}
              onClick={() => setIndex(slideIndex)}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}