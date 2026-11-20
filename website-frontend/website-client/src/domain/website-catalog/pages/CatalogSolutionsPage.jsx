import WebsiteCmsReadOnlyTable from '@/domain/website-cms/components/WebsiteCmsReadOnlyTable'
import { useGetSolutionsQuery } from '../services/catalogApi'

export default function CatalogSolutionsPage() {
  const { data: rows = [], isLoading, isError } = useGetSolutionsQuery()

  return (
    <WebsiteCmsReadOnlyTable
      rows={rows}
      loading={isLoading}
      isError={isError}
      emptyMessage="No solutions are published yet."
      errorMessage="Could not load solutions."
    />
  )
}