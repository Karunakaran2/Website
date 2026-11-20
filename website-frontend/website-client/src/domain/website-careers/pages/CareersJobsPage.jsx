import WebsiteCmsReadOnlyTable from '@/domain/website-cms/components/WebsiteCmsReadOnlyTable'
import { useGetJobsQuery } from '../services/careersApi'

export default function CareersJobsPage() {
  const { data: rows = [], isLoading, isError } = useGetJobsQuery()

  return (
    <WebsiteCmsReadOnlyTable
      rows={rows}
      loading={isLoading}
      isError={isError}
      emptyMessage="No job postings are available."
      errorMessage="Could not load jobs."
    />
  )
}