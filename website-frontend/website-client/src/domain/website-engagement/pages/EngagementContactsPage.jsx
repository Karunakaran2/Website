import WebsiteCmsReadOnlyTable from '@/domain/website-cms/components/WebsiteCmsReadOnlyTable'
import { useDashboardRouteIds } from '@/app/shell/hooks/useDashboardRouteIds'
import { useGetAdminContactsQuery } from '../services/engagementApi'

const COLUMNS = [
  { id: 'id', header: 'ID', minWidth: 72 },
  { id: 'name', minWidth: 140 },
  { id: 'email', minWidth: 180 },
  { id: 'mobile', minWidth: 120 },
  { id: 'requestType', header: 'Type', minWidth: 80 },
  {
    id: 'submittedOn',
    header: 'Submitted',
    minWidth: 160,
    cell: (row) => (row.submittedOn ? new Date(row.submittedOn).toLocaleString() : '—'),
  },
  { id: 'productName', header: 'Product', minWidth: 120 },
  { id: 'remarks', minWidth: 200 },
]

export default function EngagementContactsPage() {
  const routeIds = useDashboardRouteIds()
  const scope =
    routeIds?.primaryId === 'website-engagement' &&
    routeIds?.secondaryId === 'solution-request'
      ? 'solution'
      : routeIds?.primaryId === 'website-engagement'
        ? 'request'
        : undefined
  const { data: rows = [], isLoading, isError } = useGetAdminContactsQuery(scope)

  return (
    <WebsiteCmsReadOnlyTable
      rows={rows}
      loading={isLoading}
      isError={isError}
      columnKeys={COLUMNS}
      emptyMessage="No contact requests have been submitted yet."
      errorMessage="Could not load contact requests. Sign in with a valid CMS session."
    />
  )
}