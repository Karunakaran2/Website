import WebsiteCmsReadOnlyTable from '@/domain/website-cms/components/WebsiteCmsReadOnlyTable'
import { useGetServicesQuery } from '../services/catalogApi'

export default function CatalogServicesPage() {
  const { data: rows = [], isLoading, isError } = useGetServicesQuery()

  return (
    <WebsiteCmsReadOnlyTable
      rows={rows}
      loading={isLoading}
      isError={isError}
      emptyMessage="No services are published yet."
      errorMessage="Could not load services."
    />
  )
}