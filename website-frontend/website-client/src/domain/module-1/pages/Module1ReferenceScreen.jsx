import { useCallback, useMemo } from 'react'
import DataTable from '@/shared/components/DataTable'
import StatusChip from '@/shared/components/status/StatusChip'
import { showAppToast } from '@/shared/components'
import { dataTableActionColumn, dataTableColumn } from '@/shared/utils/buildDataTableColumn'
import TableRowActionsGroup from '@/shared/components/buttons/TableRowActionsGroup'
import { TableViewAction } from '@/shared/components/buttons'
import SampleModuleLayout from '../layouts/SampleModuleLayout'
import SampleRecordDetailModal from '../components/SampleRecordDetailModal'
import { useSampleModuleData } from '../hooks/useSampleModuleData'
import { formatINR, formatDate } from '../utils/sampleModuleUtils'
import { useListPageHeaderActions } from '@/shared/hooks/useListPageHeaderActions'
import { exportTableCsv } from '@/shared/utils/exportTableCsv'

export default function Module1ReferenceScreen({
  statusFilter = null,
  emptyHint = 'No records match the current filters.',
}) {
  const {
    filteredRecords,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    page,
    setPage,
    pageSize,
    setPageSize,
    openDetailModal,
    isDetailModalOpen,
    setIsDetailModalOpen,
    selectedRecord,
  } = useSampleModuleData()

  const filteredForView = useMemo(() => {
    if (!statusFilter) return filteredRecords
    return filteredRecords.filter(
      (r) => r.applicationStatus === statusFilter || r.status === statusFilter,
    )
  }, [filteredRecords, statusFilter])

  const total = filteredForView.length

  const rows = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredForView.slice(start, start + pageSize)
  }, [filteredForView, page, pageSize])

  const columns = useMemo(
    () => [
      dataTableColumn({ id: 'code', header: 'Reference', sortable: true, minWidth: 120 }),
      dataTableColumn({ id: 'title', sortable: true, minWidth: 180 }),
      dataTableColumn({ id: 'category', sortable: true, minWidth: 120 }),
      dataTableColumn({
        id: 'amount',
        align: 'right',
        format: 'currency',
        cell: (row) => formatINR(row.amount),
      }),
      dataTableColumn({
        id: 'status',
        align: 'center',
        minWidth: 120,
        cell: (row) => (
          <StatusChip label={row.applicationStatus || row.status} status={row.status} />
        ),
      }),
      dataTableColumn({
        id: 'updated',
        header: 'Updated Date',
        accessor: 'createdDate',
        cell: (row) => formatDate(row.createdDate),
        minWidth: 110,
      }),
      dataTableActionColumn({
        cell: (row) => (
          <TableRowActionsGroup
            items={[
              {
                key: 'view',
                label: 'View',
                onClick: () => openDetailModal(row),
                render: () => (
                  <TableViewAction
                    onClick={() => openDetailModal(row)}
                    ariaLabel={`View ${row.code}`}
                  />
                ),
              },
            ]}
          />
        ),
      }),
    ],
    [openDetailModal],
  )

  const handleExport = useCallback(() => {
    const ok = exportTableCsv(filteredForView, columns, 'records.csv')
    if (ok) {
      showAppToast('Export prepared successfully.', 'success', { action: 'export' })
    } else {
      showAppToast('No records to export.', 'warning')
    }
  }, [filteredForView, columns])

  const statusOptions = useMemo(
    () => [
      { value: 'All', label: 'All' },
      { value: 'Draft', label: 'Draft' },
      { value: 'Submitted', label: 'Submitted' },
      { value: 'Under Review', label: 'Under Review' },
      { value: 'Approved', label: 'Approved' },
      { value: 'Rejected', label: 'Rejected' },
    ],
    [],
  )

  useListPageHeaderActions({
    filterLabel: 'Status',
    filterValue: statusFilter ? statusFilter : selectedStatus,
    filterOptions: statusFilter ? null : statusOptions,
    onFilterChange: statusFilter
      ? undefined
      : (value) => {
          setSelectedStatus(value)
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
        search={searchQuery}
        onSearchChange={(value) => {
          setSearchQuery(value)
          setPage(1)
        }}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(n) => {
          setPageSize(n)
          setPage(1)
        }}
        emptyMessage={emptyHint}
      />

      <SampleRecordDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        record={selectedRecord}
      />
    </SampleModuleLayout>
  )
}
