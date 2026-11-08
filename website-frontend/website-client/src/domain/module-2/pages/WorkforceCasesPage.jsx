import { useMemo, useState } from 'react'
import DataTable from '@/shared/components/DataTable'
import StatusChip from '@/shared/components/status/StatusChip'
import { showAppToast } from '@/shared/components'
import { confirmBeforeAction } from '@/shared/components/confirm'
import { useActionConfirm } from '@/shared/components/confirm'
import { TABLE_ACTION_COLUMN_CLASS } from '@/shared/components/listing/listingTableStyles'
import TableRowActionsGroup from '@/shared/components/buttons/TableRowActionsGroup'
import { TableApproveAction, TableViewAction } from '@/shared/components/buttons'
import { workforceCaseService } from '../services/workforceCaseService'
import { useListPageHeaderActions } from '@/shared/hooks/useListPageHeaderActions'
import { exportTableCsv } from '@/shared/utils/exportTableCsv'
import ModuleInnerCard from '@/shared/layouts/ModuleInnerCard'

export default function WorkforceCasesPage() {
  const requestConfirm = useActionConfirm()
  const [cases, setCases] = useState(() => workforceCaseService.getAll())
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const refresh = () => setCases(workforceCaseService.getAll())

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return cases
    return cases.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q),
    )
  }, [cases, search])

  const rows = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page, pageSize],
  )

  const closeCase = (row) => {
    confirmBeforeAction(requestConfirm, {
      action: 'save',
      title: 'Close case',
      message: `Close case "${row.title}" (${row.id})?`,
      runAction: async () => {
        workforceCaseService.updateStatus(row.id, 'Closed')
        refresh()
        showAppToast(`Case ${row.id} closed.`, 'success', { action: 'save' })
        return true
      },
    })
  }

  const columns = useMemo(
    () => [
      { id: 'id', header: 'Case ID', accessor: 'id', minWidth: 100 },
      { id: 'title', header: 'Subject', accessor: 'title', minWidth: 200 },
      { id: 'category', header: 'Category', accessor: 'category' },
      {
        id: 'priority',
        header: 'Priority',
        accessor: 'priority',
        align: 'center',
        cell: (row) => <StatusChip label={row.priority} />,
      },
      {
        id: 'status',
        header: 'Status',
        accessor: 'status',
        align: 'center',
        cell: (row) => <StatusChip label={row.status} />,
      },
      { id: 'assignee', header: 'Assignee', accessor: 'assignee' },
      {
        id: 'action',
        header: 'Action',
        align: 'center',
        headerClassName: TABLE_ACTION_COLUMN_CLASS,
        cellClassName: TABLE_ACTION_COLUMN_CLASS,
        cell: (row) => {
          const items = [
            {
              key: 'view',
              label: 'View',
              onClick: () => showAppToast(`Case ${row.id} — preview`, 'info'),
              render: () => (
                <TableViewAction
                  onClick={() => showAppToast(`Case ${row.id} — preview`, 'info')}
                  ariaLabel={`View case ${row.id}`}
                />
              ),
            },
          ]
          if (row.status !== 'Closed') {
            items.push({
              key: 'close',
              label: 'Close case',
              onClick: () => closeCase(row),
              render: () => (
                <TableApproveAction
                  onClick={() => closeCase(row)}
                  tooltip="Close case"
                  ariaLabel={`Close case ${row.id}`}
                />
              ),
            })
          }
          return <TableRowActionsGroup items={items} />
        },
      },
    ],
    [requestConfirm],
  )

  useListPageHeaderActions({
    onExport: () => {
      const ok = exportTableCsv(filtered, columns, 'cases.csv')
      if (ok) showAppToast('Export prepared successfully.', 'success', { action: 'export' })
      else showAppToast('No records to export.', 'warning')
    },
  })

  return (
    <div className="space-y-4">
      <ModuleInnerCard title="Workforce cases" sectionId="workforce-cases-list">
      <DataTable
        columns={columns}
        rows={rows}
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
        emptyMessage="No cases in the queue"
      />
      </ModuleInnerCard>
    </div>
  )
}
