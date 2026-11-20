import { Outlet } from 'react-router-dom'
import PublicFooter from '../components/PublicFooter'
import PublicHeader from '../components/PublicHeader'
import '../styles/public-site.css'

export default function PublicSiteLayout() {
  return (
    <div className="public-site">
      <PublicHeader />
      <main>
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}