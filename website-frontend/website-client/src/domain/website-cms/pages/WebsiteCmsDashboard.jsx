import { FileText, Image, Layers, Briefcase, Inbox } from 'lucide-react'
import SetupStatsCard from '@/domain/administration/setup/components/SetupStatsCard'
import { useWebsiteCmsDashboardStats } from '../hooks/useWebsiteCmsDashboardStats'

/** Summary counts only — use gold/white navigation to open each area (no duplicate card menu). */
export default function WebsiteCmsDashboard() {
  const stats = useWebsiteCmsDashboardStats()

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <SetupStatsCard title="News" value={stats.news} icon={FileText} variant="primary" />
      <SetupStatsCard title="Banners" value={stats.banners} icon={Image} variant="primary" />
      <SetupStatsCard title="Products" value={stats.products} icon={Layers} variant="purple" />
      <SetupStatsCard title="Jobs" value={stats.jobs} icon={Briefcase} variant="success" />
      <SetupStatsCard title="Contacts" value={stats.contacts} icon={Inbox} variant="warning" />
    </div>
  )
}