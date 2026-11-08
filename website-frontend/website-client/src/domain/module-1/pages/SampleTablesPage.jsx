import React, { useCallback, useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import SampleModuleLayout from '../layouts/SampleModuleLayout'
import SampleRecordDetailModal from '../components/SampleRecordDetailModal'
import SampleRecordForm, { sampleRecordFormTitle } from '../components/SampleRecordForm'
import { DomainListWithFormModal } from '@/shared/components/domain'
import { confirmBeforeAction, useActionConfirm, useDeleteConfirm } from '@/shared/components/confirm'
import ModuleInnerCard from '@/shared/layouts/ModuleInnerCard'
import { useSampleModuleData } from '../hooks/useSampleModuleData'
import { formatINR, formatDate } from '../utils/sampleModuleUtils'
import {
  SAMPLE_CATEGORY_OPTIONS,
  SAMPLE_STATUS_OPTIONS,
} from '../constants/sampleModuleConstants'
import StatusChip from '@/shared/components/status/StatusChip'
import { TableViewAction, TableEditAction, TableDeleteAction } from '@/shared/components/buttons'
import TableRowActionsGroup from '@/shared/components/buttons/TableRowActionsGroup'
import { dataTableActionColumn, dataTableColumn } from '@/shared/utils/buildDataTableColumn'
import DataTable from '@/shared/components/DataTable'
import { useListPageHeaderActions } from '@/shared/hooks/useListPageHeaderActions'
import { PageContentToolbar, PageToolbarSelect } from '@/shared/components/page'
import { exportTableCsv } from '@/shared/utils/exportTableCsv'
import { showAppToast } from '@/shared/components'
import { GIGW_ADD_ICON, GigwButton } from '@/shared/components/buttons/gigw'

export default function SampleTablesPage() {
  const requestConfirm = useActionConfirm()
  const requestDelete = useDeleteConfirm()
  const {
    records,
    handleCreate,
    handleUpdate,
    deleteRecord,
    openCreateModal,
    openEditModal,
    openDetailModal,
    isFormModalOpen,
    setIsFormModalOpen,
    formModalMode,
    selectedRecord,
    isDetailModalOpen,
    setIsDetailModalOpen,
  } = useSampleModuleData()

  const confirmDeleteRecord = useCallback(
    (row) => {
      if (!requestDelete) return
      requestDelete(async () => deleteRecord(row), {
        recordLabel: row.title,
        description: `"${row.title}" (${row.code}) will be permanently removed.`,
      })
    },
    [deleteRecord, requestDelete],
  )

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [sort, setSort] = useState({ sortBy: 'createdDate', sortDir: 'desc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isTableLoading, setIsTableLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])

  // Columns definition using Probity DataTable conventions
  const columns = useMemo(
    () => [
      dataTableColumn({
        id: 'code',
        sortable: true,
        pinned: true,
        minWidth: 100,
        cell: (row) => (
          <span className="font-mono font-bold text-[#01458e]">{row.code}</span>
        ),
      }),
      dataTableColumn({
        id: 'title',
        header: 'Project Title',
        sortable: true,
        minWidth: 220,
        cell: (row) => <span className="font-semibold text-slate-900">{row.title}</span>,
      }),
      dataTableColumn({ id: 'category', sortable: true, minWidth: 150, hideable: true }),
      dataTableColumn({ id: 'department', sortable: true, minWidth: 140, hideable: true }),
      dataTableColumn({
        id: 'amount',
        header: 'Budget (₹)',
        headerTitleCase: false,
        align: 'right',
        sortable: true,
        minWidth: 130,
        hideable: true,
        cell: (row) => <span className="font-medium text-slate-900">{formatINR(row.amount)}</span>,
      }),
      dataTableColumn({
        id: 'dueDate',
        header: 'Target Due',
        align: 'center',
        sortable: true,
        minWidth: 120,
        hideable: true,
        cell: (row) => (
          <span className="whitespace-nowrap text-slate-600">{formatDate(row.dueDate)}</span>
        ),
      }),
      dataTableColumn({
        id: 'status',
        align: 'center',
        sortable: true,
        minWidth: 120,
        cell: (row) => <StatusChip label={row.status} />,
      }),
      dataTableActionColumn({
        cell: (row) => (
          <TableRowActionsGroup
            items={[
              {
                key: 'view',
                label: 'View',
                render: () => (
                  <TableViewAction
                    onClick={() => openDetailModal(row)}
                    ariaLabel={`View ${row.code}`}
                  />
                ),
              },
              {
                key: 'edit',
                label: 'Edit',
                render: () => (
                  <TableEditAction
                    onClick={() => openEditModal(row)}
                    ariaLabel={`Edit ${row.code}`}
                  />
                ),
              },
              {
                key: 'delete',
                label: 'Delete',
                render: () => (
                  <TableDeleteAction
                    onClick={() => confirmDeleteRecord(row)}
                    ariaLabel={`Delete ${row.code}`}
                  />
                ),
              },
            ]}
          />
        ),
      }),
    ],
    [confirmDeleteRecord, openDetailModal, openEditModal],
  )

  // Filtered & Sorted Records
  const processedRecords = useMemo(() => {
    let result = [...records]

    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.code.toLowerCase().includes(q) ||
          r.assignee.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== 'All') {
      result = result.filter((r) => r.status === statusFilter)
    }

    if (categoryFilter !== 'All') {
      result = result.filter((r) => r.category === categoryFilter)
    }

    if (sort.sortBy) {
      result.sort((a, b) => {
        let aVal = a[sort.sortBy]
        let bVal = b[sort.sortBy]

        if (sort.sortBy === 'amount') {
          aVal = Number(aVal) || 0
          bVal = Number(bVal) || 0
        }

        if (aVal < bVal) return sort.sortDir === 'asc' ? -1 : 1
        if (aVal > bVal) return sort.sortDir === 'asc' ? 1 : -1
        return 0
      })
    }

    return result
  }, [records, searchTerm, statusFilter, categoryFilter, sort])

  // Pagination Slice
  const totalItems = processedRecords.length
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return processedRecords.slice(start, start + pageSize)
  }, [processedRecords, currentPage, pageSize])

  const handleExport = useCallback(() => {
    const ok = exportTableCsv(processedRecords, columns, 'master-records.csv')
    if (ok) {
      showAppToast('Export prepared successfully.', 'success', { action: 'export' })
    } else {
      showAppToast('No records to export.', 'warning')
    }
  }, [processedRecords, columns])

  const pageToolbar = useMemo(
    () => (
      <>
        <PageToolbarSelect
          label="Status"
          name="tablesStatus"
          value={statusFilter}
          options={SAMPLE_STATUS_OPTIONS}
          onChange={(value) => {
            setStatusFilter(value)
            setCurrentPage(1)
          }}
          minWidth="min-w-[100px]"
        />
        <PageToolbarSelect
          label="Category"
          name="tablesCategory"
          value={categoryFilter}
          options={SAMPLE_CATEGORY_OPTIONS}
          onChange={(value) => {
            setCategoryFilter(value)
            setCurrentPage(1)
          }}
        />
        <GigwButton type="button" variant="primary" icon={GIGW_ADD_ICON} onClick={openCreateModal}>
          Add Record
        </GigwButton>
        <GigwButton
          type="button"
          variant="outline"
          icon={RefreshCw}
          onClick={() => setIsTableLoading((v) => !v)}
        >
          {isTableLoading ? 'Stop Skeleton' : 'Simulate Loader'}
        </GigwButton>
      </>
    ),
    [statusFilter, categoryFilter, openCreateModal, isTableLoading],
  )

  useListPageHeaderActions({
    onExport: handleExport,
  })

  return (
    <SampleModuleLayout activeTab="tables">
      {!isFormModalOpen ? <PageContentToolbar>{pageToolbar}</PageContentToolbar> : null}

      <DomainListWithFormModal
        formOpen={isFormModalOpen}
        onCloseForm={() => setIsFormModalOpen(false)}
        modalTitle={sampleRecordFormTitle(formModalMode)}
        form={
          <SampleRecordForm
            mode={formModalMode}
            initialData={selectedRecord}
            onCancel={() => setIsFormModalOpen(false)}
            onSave={formModalMode === 'create' ? handleCreate : handleUpdate}
          />
        }
        list={
          <ModuleInnerCard title="Master records" sectionId="sample-tables-list">
            <DataTable
              columns={columns}
              rows={paginatedRecords}
              rowKey="id"
              search={searchTerm}
              onSearchChange={(value) => {
                setSearchTerm(value)
                setCurrentPage(1)
              }}
              page={currentPage}
              pageSize={pageSize}
              total={totalItems}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize)
                setCurrentPage(1)
              }}
              sort={sort}
              onSortChange={setSort}
              selectable
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              loading={isTableLoading}
              emptyMessage="No matching data records found. Adjust your search terms or active filters to populate results."
            />
          </ModuleInnerCard>
        }
      />

      <SampleRecordDetailModal
        isOpen={isDetailModalOpen}
        record={selectedRecord}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={(rec) => openEditModal(rec)}
      />

    </SampleModuleLayout>
  )
}

