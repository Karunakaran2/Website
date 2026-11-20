const asset = (name) => `${import.meta.env.BASE_URL}kran/${name}`

export default function PublicAboutPage() {
  return (
    <>
      <div className="public-page-hero">
        <h1>About KRAN</h1>
      </div>
      <section className="public-about">
        <div className="public-about__media">
          <img src={asset('about/about-us-4.jpg')} alt="KRAN consulting" />
        </div>
        <div className="public-about__content">
          <h2>Overview</h2>
          <h1>Transforming public administration through e-Governance</h1>
          <p>
            KRAN Consulting Pvt. Ltd. has worked exclusively with government departments, state and
            central PSUs, and multilateral agencies for more than three decades. Our teams design,
            implement, and sustain mission-critical digital programmes that improve citizen services
            nationwide.
          </p>
          <p>
            Quality certifications including CMMI Level 5, ISO 9001, ISO 27001, and ISO 20000 underpin
            our delivery model. This React public site mirrors the legacy KRAN welcome experience while
            content is served from the new website microservices.
          </p>
        </div>
      </section>
    </>
  )
}