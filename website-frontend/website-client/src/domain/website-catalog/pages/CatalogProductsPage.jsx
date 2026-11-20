import WebsiteCmsReadOnlyTable from '@/domain/website-cms/components/WebsiteCmsReadOnlyTable'
import { useGetCatalogProductsQuery } from '../services/catalogApi'

const COLUMNS = [
  { id: 'id', header: 'ID', minWidth: 72 },
  { id: 'name', minWidth: 140 },
  { id: 'title', minWidth: 160 },
  { id: 'type', minWidth: 100 },
  { id: 'category', minWidth: 120 },
]

export default function CatalogProductsPage() {
  const { data: rows = [], isLoading, isError } = useGetCatalogProductsQuery()

  return (
    <WebsiteCmsReadOnlyTable
      rows={rows}
      loading={isLoading}
      isError={isError}
      columnKeys={COLUMNS}
      emptyMessage="No products are published on the website yet."
      errorMessage="Could not load products."
    />
  )
}