import { useCallback, useMemo, useState } from 'react'
import DataTable from '@/shared/components/DataTable'
import StatusChip from '@/shared/components/status/StatusChip'
import { showAppToast } from '@/shared/components'
import { confirmBeforeAction } from '@/shared/components/confirm'
import { useActionConfirm } from '@/shared/components/confirm'
import { dataTableActionColumn, dataTableColumn } from '@/shared/utils/buildDataTableColumn'
import TableRowActionsGroup from '@/shared/components/buttons/TableRowActionsGroup'
import {
  TableApproveAction,
  TableEditAction,
  TableViewAction,
} from '@/shared/components/buttons'
import { useModule2PortalScreen } from '../hooks/useModule2PortalScreen'
import { useListPageHeaderActions } from '@/shared/hooks/useListPageHeaderActions'
import { exportTableCsv } from '@/shared/utils/exportTableCsv'

function buildColumns(dataset, handlers) {
  switch (dataset) {
    case 'attendance':
      return [
        dataTableColumn({ id: 'employee', minWidth: 160 }),
        dataTableColumn({ id: 'date', minWidth: 100 }),
        dataTableColumn({
          id: 'status',
          align: 'center',
          cell: (r) => <StatusChip label={r.status} />,
        }),
        dataTableColumn({ id: 'checkIn', header: 'Check-in', headerTitleCase: false }),
        dataTableColumn({ id: 'checkOut', header: 'Check-out', headerTitleCase: false }),
        dataTableColumn({ id: 'department' }),
        handlers.actionColumn((row) => [
          {
            key: 'view',
            label: 'View',
            onClick: () => handlers.onView(row),
            render: () => (
              <TableViewAction onClick={() => handlers.onView(row)} ariaLabel={`View ${row.employee}`} />
            ),
          },
        ]),
      ]
    case 'leave':
      return [
        dataTableColumn({ id: 'id', header: 'Request ID', minWidth: 90 }),
        dataTableColumn({ id: 'employee', minWidth: 140 }),
        dataTableColumn({ id: 'type' }),
        dataTableColumn({ id: 'from' }),
        dataTableColumn({ id: 'to' }),
        dataTableColumn({ id: 'days', align: 'center' }),
        dataTableColumn({ id: 'status', cell: (r) => <StatusChip label={r.status} /> }),
        handlers.actionColumn((row) => {
          const items = [
            {
              key: 'view',
              label: 'View',
              onClick: () => handlers.onView(row),
              render: () => (
                <TableViewAction onClick={() => handlers.onView(row)} ariaLabel={`View leave ${row.id}`} />
              ),
            },
          ]
          if (row.status === 'Pending approval') {
            items.push({
              key: 'approve',
              label: 'Approve',
              onClick: () => handlers.onApproveLeave(row),
              render: () => (
                <TableApproveAction
                  onClick={() => handlers.onApproveLeave(row)}
                  ariaLabel={`Approve leave ${row.id}`}
                />
              ),
            })
          }
          return items
        }),
      ]
    case 'collaboration':
    case 'activity':
      return [
        dataTableColumn({ id: 'subject', minWidth: 220 }),
        dataTableColumn({ id: 'channel', header: 'Type' }),
        dataTableColumn({ id: 'author' }),
        dataTableColumn({ id: 'updated' }),
        dataTableColumn({ id: 'visibility' }),
        handlers.actionColumn((row) => [
          {
            key: 'view',
            label: 'View',
            onClick: () => handlers.onView(row),
            render: () => (
              <TableViewAction onClick={() => handlers.onView(row)} ariaLabel={`View ${row.subject}`} />
            ),
          },
        ]),
      ]
    case 'reports':
      return [
        dataTableColumn({ id: 'name', header: 'Report', minWidth: 220 }),
        dataTableColumn({ id: 'period' }),
        dataTableColumn({ id: 'records', header: 'Rows', align: 'right' }),
        dataTableColumn({ id: 'status', cell: (r) => <StatusChip label={r.status} /> }),
        handlers.actionColumn((row) => [
          {
            key: 'view',
            label: 'Preview',
            onClick: () => handlers.onView(row),
            render: () => (
              <TableViewAction onClick={() => handlers.onView(row)} ariaLabel={`Preview ${row.name}`} />
            ),
          },
        ]),
      ]
    case 'config':
      return [
        dataTableColumn({ id: 'scope' }),
        dataTableColumn({ id: 'key', header: 'Setting', minWidth: 200 }),
        dataTableColumn({ id: 'value', minWidth: 180 }),
        handlers.actionColumn((row) => [
          {
            key: 'edit',
            label: 'Edit',
            onClick: () => handlers.onEditConfig(row),
            render: () => (
              <TableEditAction onClick={() => handlers.onEditConfig(row)} ariaLabel={`Edit ${row.key}`} />
            ),
          },
        ]),
      ]
    case 'people-meta':
      return [
        dataTableColumn({ id: 'name', header: 'Employee', minWidth: 160 }),
        dataTableColumn({ id: 'designation' }),
        dataTableColumn({ id: 'department' }),
        dataTableColumn({ id: 'team' }),
        dataTableColumn({ id: 'manager', header: 'Reports To' }),
        handlers.actionColumn((row) => [
          {
            key: 'view',
            label: 'View',
            onClick: () => handlers.onView(row),
            render: () => (
              <TableViewAction onClick={() => handlers.onView(row)} ariaLabel={`View ${row.name}`} />
            ),
          },
        ]),
      ]
    case 'tasks':
      return [
        dataTableColumn({ id: 'id', header: 'Task ID', minWidth: 90 }),
        dataTableColumn({ id: 'title', minWidth: 200 }),
        dataTableColumn({ id: 'assignee' }),
        dataTableColumn({ id: 'priority', cell: (r) => <StatusChip label={r.priority} /> }),
        dataTableColumn({ id: 'status', cell: (r) => <StatusChip label={r.status} /> }),
        dataTableColumn({ id: 'dueDate', header: 'Due' }),
        handlers.actionColumn((row) => [
          {
            key: 'view',
            label: 'View',
            onClick: () => handlers.onView(row),
            render: () => (
              <TableViewAction onClick={() => handlers.onView(row)} ariaLabel={`View task ${row.title}`} />
            ),
          },
          {
            key: 'edit',
            label: 'Edit',
            onClick: () => handlers.onView(row),
            render: () => (
              <TableEditAction onClick={() => handlers.onView(row)} ariaLabel={`Edit task ${row.title}`} />
            ),
          },
        ]),
      ]
    case 'cases':
      return [
        dataTableColumn({ id: 'id', header: 'Case ID' }),
        dataTableColumn({ id: 'title', header: 'Subject', minWidth: 200 }),
        dataTableColumn({ id: 'status', cell: (r) => <StatusChip label={r.status} /> }),
        dataTableColumn({ id: 'priority', cell: (r) => <StatusChip label={r.priority} /> }),
        dataTableColumn({ id: 'assignee' }),
        handlers.actionColumn((row) => [
          {
            key: 'view',
            label: 'View',
            onClick: () => handlers.onView(row),
            render: () => (
              <TableViewAction onClick={() => handlers.onView(row)} ariaLabel={`View case ${row.id}`} />
            ),
          },
        ]),
      ]
    default:
      return [
        dataTableColumn({ id: 'title', header: 'Item', minWidth: 200 }),
        dataTableColumn({ id: 'status' }),
        handlers.actionColumn((row) => [
          {
            key: 'view',
            label: 'View',
            onClick: () => handlers.onView(row),
            render: () => (
              <TableViewAction onClick={() => handlers.onView(row)} ariaLabel="View row" />
            ),
          },
        ]),
      ]
  }
}

export default function Module2ReferenceScreen() {
  const requestConfirm = useActionConfirm()
  const { dataset, rows, refresh, updatePortalRow } = useModule2PortalScreen()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [preview, setPreview] = useState(null)

  const handlers = useMemo(
    () => ({
      onView: (row) => setPreview(row),
      onApproveLeave: (row) => {
        confirmBeforeAction(requestConfirm, {
          action: 'approve',
          title: 'Approve leave request',
          message: `Approve ${row.type} for ${row.employee}?`,
          runAction: async () => {
            updatePortalRow('leave', row.id, { status: 'Approved' })
            showAppToast('Leave request approved.', 'success', { action: 'approve' })
            return true
          },
        })
      },
      onEditConfig: (row) => {
        confirmBeforeAction(requestConfirm, {
          action: 'save',
          title: 'Save setting',
          message: `Save changes to "${row.key}"?`,
          runAction: async () => {
            updatePortalRow('config', row.id, { value: `${row.value} (updated)` })
            showAppToast('Setting saved.', 'success', { action: 'save' })
            return true
          },
        })
      },
      actionColumn: (buildItems) =>
        dataTableActionColumn({
          cell: (row) => <TableRowActionsGroup items={buildItems(row)} />,
        }),
    }),
    [requestConfirm, updatePortalRow],
  )

  const columns = useMemo(() => buildColumns(dataset, handlers), [dataset, handlers])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(q)),
    )
  }, [rows, search])

  const paged = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize],
  )

  const handleExport = useCallback(() => {
    const ok = exportTableCsv(filtered, columns, 'export.csv')
    if (ok) {
      showAppToast('Export prepared successfully.', 'success', { action: 'export' })
    } else {
      showAppToast('No records to export.', 'warning')
    }
  }, [filtered, columns])

  useListPageHeaderActions({
    onExport: handleExport,
  })

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        rows={paged}
        rowKey="id"
        search={search}
        onSearchChange={(value) => {
          setSearch(value)
          setPage(1)
        }}
        page={page}
        pageSize={pageSize}
        total={filtered.length}
        onPageChange={setPage}
        onPageSizeChange={(n) => {
          setPageSize(n)
          setPage(1)
        }}
        emptyMessage="No records match the current filters."
      />
      {preview ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
          <p className="m-0 font-semibold text-[#01458e]">Record Preview</p>
          <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap text-xs">{JSON.stringify(preview, null, 2)}</pre>
          <button
            type="button"
            className="mt-2 text-xs text-[#01458e] underline"
            onClick={() => setPreview(null)}
          >
            Close Preview
          </button>
        </div>
      ) : null}
    </div>
  )
}
