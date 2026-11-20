import { Link } from 'react-router-dom'
import { PUBLIC_ROUTES } from '../constants/publicRoutes'

export default function PublicFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="public-footer">
      <div className="public-footer__inner">
        <div>
          <h4>KRAN Consulting Pvt. Ltd.</h4>
          <p>
            Simple IT solutions for overall transformation. Pioneers of digital transformation in
            public administration for over 30 years.
          </p>
        </div>
        <div>
          <h4>Quick links</h4>
          <p>
            <Link to={PUBLIC_ROUTES.ABOUT}>About us</Link>
            <br />
            <Link to={PUBLIC_ROUTES.NEWS}>News</Link>
            <br />
            <Link to={PUBLIC_ROUTES.CAREER}>Careers</Link>
            <br />
            <Link to={PUBLIC_ROUTES.CONTACT}>Contact</Link>
          </p>
        </div>
        <div>
          <h4>Contact</h4>
          <p>
            sales@kran.co.in
            <br />
            +91-8714646444
            <br />
            <a href="https://www.linkedin.com/company/kran-consulting-pvt-ltd/" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </p>
        </div>
      </div>
      <p className="public-footer__copy">© {year} KRAN Consulting Pvt. Ltd. All rights reserved.</p>
    </footer>
  )
}