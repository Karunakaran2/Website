import { FileText, Image, Layers, Briefcase, Inbox } from 'lucide-react'
import CmsStatsCard from '../components/CmsStatsCard'
import { useWebsiteCmsDashboardStats } from '../hooks/useWebsiteCmsDashboardStats'

/** Summary counts only — use gold/white navigation to open each area (no duplicate card menu). */
export default function WebsiteCmsDashboard() {
  const stats = useWebsiteCmsDashboardStats()

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <CmsStatsCard title="News" value={stats.news} icon={FileText} variant="primary" />
      <CmsStatsCard title="Banners" value={stats.banners} icon={Image} variant="primary" />
      <CmsStatsCard title="Products" value={stats.products} icon={Layers} variant="purple" />
      <CmsStatsCard title="Jobs" value={stats.jobs} icon={Briefcase} variant="success" />
      <CmsStatsCard title="Contacts" value={stats.contacts} icon={Inbox} variant="warning" />
    </div>
  )
}