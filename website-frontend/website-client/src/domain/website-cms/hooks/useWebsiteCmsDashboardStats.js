import { useMemo } from 'react'
import { useGetAdminBannersQuery, useGetAdminNewsQuery } from '@/domain/website-content/services/contentApi'
import { useGetCatalogProductsQuery } from '@/domain/website-catalog/services/catalogApi'
import { useGetJobsQuery } from '@/domain/website-careers/services/careersApi'
import { useGetAdminContactsQuery } from '@/domain/website-engagement/services/engagementApi'

function countOrDash(data, loading) {
  if (loading) return '—'
  return Array.isArray(data) ? String(data.length) : '0'
}

export function useWebsiteCmsDashboardStats() {
  const news = useGetAdminNewsQuery()
  const banners = useGetAdminBannersQuery()
  const products = useGetCatalogProductsQuery()
  const jobs = useGetJobsQuery()
  const contacts = useGetAdminContactsQuery()

  return useMemo(
    () => ({
      news: countOrDash(news.data, news.isLoading),
      banners: countOrDash(banners.data, banners.isLoading),
      products: countOrDash(products.data, products.isLoading),
      jobs: countOrDash(jobs.data, jobs.isLoading),
      contacts: countOrDash(contacts.data, contacts.isLoading),
      isLoading:
        news.isLoading ||
        banners.isLoading ||
        products.isLoading ||
        jobs.isLoading ||
        contacts.isLoading,
    }),
    [banners.data, banners.isLoading, contacts.data, contacts.isLoading, jobs.data, jobs.isLoading, news.data, news.isLoading, products.data, products.isLoading],
  )
}