import WebsiteCmsSectionOverview from '@/domain/website-cms/components/WebsiteCmsSectionOverview'
import { useGetAdminBannersQuery, useGetAdminNewsQuery } from '../services/contentApi'

export default function ContentServiceOverviewPage() {
  const news = useGetAdminNewsQuery()
  const banners = useGetAdminBannersQuery()
  const newsCount = news.isLoading ? '…' : (news.data?.length ?? 0)
  const bannerCount = banners.isLoading ? '…' : (banners.data?.length ?? 0)

  return (
    <WebsiteCmsSectionOverview
      title="Content"
      subtitle="Use the sub-navigation bar above to open News or Banners."
      footer={`${newsCount} news article(s) · ${bannerCount} banner(s)`}
    />
  )
}