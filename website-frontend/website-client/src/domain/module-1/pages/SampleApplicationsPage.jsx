import { useCallback, useMemo, useState } from 'react'
import SampleModuleLayout from '../layouts/SampleModuleLayout'
import SampleRecordDetailModal from '../components/SampleRecordDetailModal'
import { useSampleModuleData } from '../hooks/useSampleModuleData'
import { formatINR, formatDate } from '../utils/sampleModuleUtils'
import { APPLICATION_STATUS_OPTIONS } from '../services/sampleModuleService'
import StatusChip from '@/shared/components/status/StatusChip'
import DataTable from '@/shared/components/DataTable'
import { dataTableActionColumn, dataTableColumn } from '@/shared/utils/buildDataTableColumn'
import TableRowActionsGroup from '@/shared/components/buttons/TableRowActionsGroup'
import { TableSubmitAction, TableViewAction } from '@/shared/components/buttons'
import { GIGW_SUBMIT_ICON } from '@/shared/components/buttons/gigw/gigwLucideIcons'
import { useListPageHeaderActions } from '@/shared/hooks/useListPageHeaderActions'
import { exportTableCsv } from '@/shared/utils/exportTableCsv'
import { showAppToast } from '@/shared/components'

export default function SampleApplicationsPage() {
  const {
    records,
    submitApplication,
    openDetailModal,
    isDetailModalOpen,
    setIsDetailModalOpen,
    selectedRecord,
  } = useSampleModuleData()

  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const q = search.trim().toLowerCase()
      const matchesQ =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.code.toLowerCase().includes(q)
      const matchesStatus =
        statusFilter === 'All' || r.applicationStatus === statusFilter
      return matchesQ && matchesStatus
    })
  }, [records, search, statusFilter])

  const rows = useMemo(
    () =>
      filtered.slice((page - 1) * pageSize, page * pageSize).map((r, i) => ({
        ...r,
        _serial: (page - 1) * pageSize + i + 1,
      })),
    [filtered, page, pageSize],
  )

  const columns = useMemo(
    () => [
      dataTableColumn({
        id: '_serial',
        header: '#',
        headerTitleCase: false,
        accessor: '_serial',
        align: 'center',
        minWidth: 44,
        hideable: false,
      }),
      dataTableColumn({ id: 'code', header: 'Application No.', sortable: true, minWidth: 110 }),
      dataTableColumn({ id: 'title', sortable: true, minWidth: 200 }),
      dataTableColumn({
        id: 'applicationStatus',
        header: 'Workflow Status',
        align: 'center',
        cell: (row) => <StatusChip label={row.applicationStatus} />,
      }),
      dataTableColumn({
        id: 'amount',
        align: 'right',
        format: 'currency',
        cell: (row) => formatINR(row.amount),
      }),
      dataTableColumn({
        id: 'createdDate',
        cell: (row) => formatDate(row.createdDate),
      }),
      dataTableActionColumn({
        cell: (row) => {
          const items = [
            {
              key: 'view',
              label: 'View',
              onClick: () => openDetailModal(row),
              render: () => (
                <TableViewAction onClick={() => openDetailModal(row)} ariaLabel={`View ${row.title}`} />
              ),
            },
          ]
          if (['Draft', 'Returned'].includes(row.applicationStatus)) {
            items.push({
              key: 'submit',
              label: 'Submit for review',
              icon: GIGW_SUBMIT_ICON,
              onClick: () => submitApplication(row.id),
              render: () => (
                <TableSubmitAction
                  onClick={() => submitApplication(row.id)}
                  tooltip="Submit for review"
                  ariaLabel={`Submit ${row.title}`}
                />
              ),
            })
          }
          return <TableRowActionsGroup items={items} />
        },
      }),
    ],
    [openDetailModal, submitApplication],
  )

  const handleExport = useCallback(() => {
    const ok = exportTableCsv(filtered, columns, 'applications.csv')
    if (ok) {
      showAppToast('Export prepared successfully.', 'success', { action: 'export' })
    } else {
      showAppToast('No records to export.', 'warning')
    }
  }, [filtered, columns])

  const workflowOptions = useMemo(
    () => [
      { value: 'All', label: 'All' },
      ...APPLICATION_STATUS_OPTIONS.map((s) => ({ value: s, label: s })),
    ],
    [],
  )

  useListPageHeaderActions({
    filterLabel: 'Workflow',
    filterValue: statusFilter,
    filterOptions: workflowOptions,
    onFilterChange: (value) => {
      setStatusFilter(value)
      setPage(1)
    },
    onExport: handleExport,
  })

  return (
    <SampleModuleLayout>
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
        emptyMessage="No applications match the current filters"
      />
      <SampleRecordDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        record={selectedRecord}
      />
    </SampleModuleLayout>
  )
}
