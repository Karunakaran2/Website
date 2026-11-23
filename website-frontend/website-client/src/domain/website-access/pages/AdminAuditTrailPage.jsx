import { useMemo, useState } from 'react'
import DataTable from '@/shared/components/DataTable'
import { dataTableColumn } from '@/shared/utils/buildDataTableColumn'
import { useListAuditEventsQuery } from '../services/accessApi'
import { useWebsiteAccess } from '../hooks/useWebsiteAccess'
import { useWebsiteListQueryOptions } from '../hooks/useWebsiteListQueryOptions'
import { CMS_ADMIN } from '../constants/websitePrivileges'

function formatWhen(value) {
  if (!value) {
    return '—'
  }
  try {
    return new Date(value).toLocaleString()
  } catch {
    return String(value)
  }
}

export default function AdminAuditTrailPage() {
  const { can } = useWebsiteAccess()
  const canView = can(CMS_ADMIN.AUDIT_VIEW)
  const listQueryOptions = useWebsiteListQueryOptions(canView)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [moduleFilter, setModuleFilter] = useState('')
  const [usernameFilter, setUsernameFilter] = useState('')

  const { data, isLoading, isError, refetch, isFetching } = useListAuditEventsQuery(
    {
      page: page - 1,
      size: pageSize,
      module: moduleFilter,
      username: usernameFilter,
    },
    listQueryOptions,
  )

  const rows = data?.content ?? []
  const total = data?.totalElements ?? 0

  const columns = useMemo(
    () => [
      dataTableColumn({
        id: 'occurredAt',
        header: 'When',
        minWidth: 160,
        cell: (row) => formatWhen(row.occurredAt),
      }),
      dataTableColumn({ id: 'actorUsername', header: 'User', minWidth: 120 }),
      dataTableColumn({ id: 'action', header: 'Action', minWidth: 100 }),
      dataTableColumn({ id: 'moduleKey', header: 'Module', minWidth: 110 }),
      dataTableColumn({
        id: 'summary',
        header: 'Details',
        minWidth: 220,
        cell: (row) => row.summary || '—',
      }),
      dataTableColumn({
        id: 'ipAddress',
        header: 'IP',
        minWidth: 120,
        cell: (row) => row.ipAddress || '—',
      }),
    ],
    [],
  )

  if (!canView) {
    return (
      <p className="text-sm text-rose-700" role="alert">
        You do not have permission to view the audit trail. System administrators can grant{' '}
        <code className="text-xs">CMS_ADMIN_AUDIT_VIEW</code>.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Sign-in, password changes, user and role administration, and CMS changes (content, catalog,
        media uploads, careers, contacts, and mail setup) recorded after each successful save.
      </p>
      <div className="flex flex-wrap gap-3 rounded border border-slate-200 bg-slate-50 p-3">
        <label className="text-sm">
          Module
          <select
            className="ml-2 rounded border px-2 py-1"
            value={moduleFilter}
            onChange={(e) => {
              setModuleFilter(e.target.value)
              setPage(1)
            }}
          >
            <option value="">All</option>
            <option value="auth">auth</option>
            <option value="admin_users">admin_users</option>
            <option value="admin_roles">admin_roles</option>
            <option value="content_news">content_news</option>
            <option value="content_banner">content_banner</option>
            <option value="content_datasheet">content_datasheet</option>
            <option value="content_timeline">content_timeline</option>
            <option value="catalog_products">catalog_products</option>
            <option value="catalog_solutions">catalog_solutions</option>
            <option value="catalog_projects">catalog_projects</option>
            <option value="catalog_case_study">catalog_case_study</option>
            <option value="catalog_kran_seniors">catalog_kran_seniors</option>
            <option value="catalog_kran_faces">catalog_kran_faces</option>
            <option value="catalog_categories">catalog_categories</option>
            <option value="media_gallery">media_gallery</option>
            <option value="media_upload">media_upload</option>
            <option value="careers">careers</option>
            <option value="engagement">engagement</option>
            <option value="notification">notification</option>
            <option value="cms_other">cms_other</option>
          </select>
        </label>
        <label className="text-sm">
          Username
          <input
            className="ml-2 rounded border px-2 py-1"
            value={usernameFilter}
            placeholder="Contains…"
            onChange={(e) => {
              setUsernameFilter(e.target.value)
              setPage(1)
            }}
          />
        </label>
        <button
          type="button"
          className="self-end rounded border bg-white px-3 py-1 text-sm hover:bg-slate-100"
          onClick={() => refetch()}
        >
          Refresh
        </button>
      </div>
      {isError ? (
        <p className="text-sm text-rose-700" role="alert">
          Could not load audit events. Restart auth-service after Flyway V004.
        </p>
      ) : null}
      <DataTable
        rowKey="id"
        columns={columns}
        rows={rows}
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
        loading={isLoading || isFetching}
        emptyMessage="No audit events yet."
        enableColumnVisibility={false}
      />
    </div>
  )
}