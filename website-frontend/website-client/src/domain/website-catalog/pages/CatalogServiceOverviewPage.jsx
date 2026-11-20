import WebsiteCmsSectionOverview from '@/domain/website-cms/components/WebsiteCmsSectionOverview'
import { useGetCatalogProductsQuery, useGetServicesQuery, useGetSolutionsQuery } from '../services/catalogApi'

export default function CatalogServiceOverviewPage() {
  const products = useGetCatalogProductsQuery()
  const services = useGetServicesQuery()
  const solutions = useGetSolutionsQuery()

  const footer = [
    `${products.isLoading ? '…' : (products.data?.length ?? 0)} products`,
    `${services.isLoading ? '…' : (services.data?.length ?? 0)} services`,
    `${solutions.isLoading ? '…' : (solutions.data?.length ?? 0)} solutions`,
  ].join(' · ')

  return (
    <WebsiteCmsSectionOverview
      title="Catalog"
      subtitle="Use the sub-navigation bar above for Products, Services, and Solutions."
      footer={footer}
    />
  )
}