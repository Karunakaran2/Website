import WebsiteCmsSectionOverview from '@/domain/website-cms/components/WebsiteCmsSectionOverview'
import { useGetJobsQuery } from '../services/careersApi'

export default function CareersServiceOverviewPage() {
  const jobs = useGetJobsQuery()
  const count = jobs.isLoading ? '…' : (jobs.data?.length ?? 0)

  return (
    <WebsiteCmsSectionOverview
      title="Careers"
      subtitle="Use the sub-navigation bar above to open Jobs."
      footer={`${count} job posting(s)`}
    />
  )
}