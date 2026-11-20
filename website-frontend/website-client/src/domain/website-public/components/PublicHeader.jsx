import { Link, NavLink } from 'react-router-dom'
import { ROUTES } from '@/shared/constants'
import { PUBLIC_NAV_ITEMS } from '../constants/publicNav'

const LOGO = `${import.meta.env.BASE_URL}kran/Kran-Logo-2024.svg`

export default function PublicHeader() {
  return (
    <header className="public-header">
      <div className="public-header__inner">
        <Link to="/" className="public-header__brand" aria-label="KRAN Consulting home">
          <img src={LOGO} alt="KRAN Consulting" />
        </Link>
        <nav className="public-header__nav" aria-label="Main">
          {PUBLIC_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'is-active' : undefined)}
              end={item.to === '/'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="public-header__actions">
          <Link to={ROUTES.LOGIN} className="public-btn public-btn--ghost">
            Admin login
          </Link>
        </div>
      </div>
    </header>
  )
}