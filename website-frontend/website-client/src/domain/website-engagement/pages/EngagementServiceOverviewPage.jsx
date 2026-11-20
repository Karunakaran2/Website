import WebsiteCmsSectionOverview from '@/domain/website-cms/components/WebsiteCmsSectionOverview'
import { useGetAdminContactsQuery } from '../services/engagementApi'

export default function EngagementServiceOverviewPage() {
  const contacts = useGetAdminContactsQuery()
  const count = contacts.isLoading ? '…' : (contacts.data?.length ?? 0)

  return (
    <WebsiteCmsSectionOverview
      title="Enquiries"
      subtitle="Use the sub-navigation bar above to open Contacts."
      footer={`${count} contact request(s)`}
    />
  )
}