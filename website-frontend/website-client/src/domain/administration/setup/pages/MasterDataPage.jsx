import React, { useCallback, useState, useMemo, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useRegisterDashboardPageHeaderActions } from '@/app/shell/context/DashboardPageHeaderActionsContext'
import ActionButton from '@/shared/components/buttons/ActionButton'
import SetupModuleLayout from '../layouts/SetupModuleLayout'
import SetupRecordDetailModal from '../components/SetupRecordDetailModal'
import SetupRecordForm, { setupRecordFormTitle } from '../components/SetupRecordForm'
import { DomainListWithFormModal } from '@/shared/components/domain'
import { useSetupData } from '../hooks/useSetupData'
import { useActionConfirm, useDeleteConfirm } from '@/shared/components/confirm'
import {
  confirmSetupMasterDelete,
  confirmSetupMasterStatus,
} from '../../shared/listRecordConfirms'
import { formatDate } from '../utils/setupUtils'
import {
  MASTER_CATEGORY_OPTIONS,
  MASTER_STATUS_OPTIONS,
} from '../constants/setupConstants'
import DataTable from '@/shared/components/DataTable'
import StatusChip from '@/shared/components/status/StatusChip'
import {
  TABLE_ROW_ACTIONS_CLASS,
  TableViewAction,
  TableEditAction,
  TableDeleteAction,
  TableActivateAction,
  TableDeactivateAction,
} from '@/shared/components/buttons'

export default function MasterDataPage() {
  const requestConfirm = useActionConfirm()
  const requestDelete = useDeleteConfirm()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCategoryParam = searchParams.get('category') || 'All'

  const {
    records,
    isFormModalOpen,
    setIsFormModalOpen,
    formModalMode,
    selectedRecord,
    isDetailModalOpen,
    setIsDetailModalOpen,
    openCreateModal,
    openEditModal,
    openDetailModal,
    handleCreate,
    handleUpdate,
    deleteRecord,
    toggleRecordStatus,
  } = useSetupData()

  const onConfirmDelete = useCallback(
    (row) => confirmSetupMasterDelete(requestDelete, deleteRecord, row),
    [deleteRecord, requestDelete],
  )

  const onConfirmStatus = useCallback(
    (row) => confirmSetupMasterStatus(requestConfirm, toggleRecordStatus, row),
    [requestConfirm, toggleRecordStatus],
  )

  // Filter & Pagination States
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState(initialCategoryParam)
  const [statusFilter, setStatusFilter] = useState('All')
  const [sort, setSort] = useState({ sortBy: 'code', sortDir: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedIds, setSelectedIds] = useState([])

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat && cat !== categoryFilter) {
      setCategoryFilter(cat)
      setCurrentPage(1)
    }
  }, [searchParams])

  // Columns definition using Probity shared DataTable conventions
  const columns = useMemo(
    () => [
      {
        id: 'code',
        header: 'Code',
        accessor: 'code',
        sortable: true,
        pinned: true,
        minWidth: 135,
        cell: (row) => (
          <span className="font-mono font-bold text-[#01458e]">{row.code}</span>
        ),
      },
      {
        id: 'name',
        header: 'Configuration Name',
        accessor: 'name',
        sortable: true,
        minWidth: 240,
        cell: (row) => (
          <span className="font-semibold text-slate-900">{row.name}</span>
        ),
      },
      {
        id: 'category',
        header: 'Category',
        accessor: 'category',
        sortable: true,
        minWidth: 160,
      },
      {
        id: 'description',
        header: 'Description',
        accessor: 'description',
        minWidth: 260,
        hideable: true,
        cell: (row) => (
          <span className="text-slate-600 line-clamp-1">{row.description}</span>
        ),
      },
      {
        id: 'head',
        header: 'Responsible Head',
        accessor: 'head',
        sortable: true,
        minWidth: 160,
        hideable: true,
        cell: (row) => (
          <span className="text-slate-700">{row.head || '—'}</span>
        ),
      },
      {
        id: 'updatedDate',
        header: 'Last Updated',
        accessor: 'updatedDate',
        align: 'center',
        sortable: true,
        minWidth: 120,
        cell: (row) => (
          <span className="text-slate-600 whitespace-nowrap">
            {formatDate(row.updatedDate)}
          </span>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        accessor: 'status',
        align: 'center',
        sortable: true,
        minWidth: 120,
        cell: (row) => <StatusChip label={row.status} />,
      },
      {
        id: 'actions',
        header: 'Actions',
        align: 'center',
        sortable: false,
        pinned: true,
        minWidth: 130,
        cell: (row) => (
          <div className={TABLE_ROW_ACTIONS_CLASS}>
            <TableViewAction
              onClick={() => openDetailModal(row)}
              title={`View ${row.name}`}
            />
            <TableEditAction
              onClick={() => openEditModal(row)}
              title={`Edit ${row.name}`}
            />
            {row.status === 'Active' ? (
              <TableDeactivateAction
                onClick={() => onConfirmStatus(row)}
                title={`Deactivate ${row.name}`}
              />
            ) : (
              <TableActivateAction
                onClick={() => onConfirmStatus(row)}
                title={`Activate ${row.name}`}
              />
            )}
            <TableDeleteAction
              onClick={() => onConfirmDelete(row)}
              title={`Delete ${row.name}`}
            />
          </div>
        ),
      },
    ],
    [onConfirmDelete, onConfirmStatus, openDetailModal, openEditModal]
  )

  // Filtered & Sorted Records
  const processedRecords = useMemo(() => {
    let result = [...records]

    if (searchTerm) {
      const q = searchTerm.toLowerCase()
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.code.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q))
      )
    }

    if (categoryFilter !== 'All') {
      result = result.filter((r) => r.category === categoryFilter)
    }

    if (statusFilter !== 'All') {
      result = result.filter((r) => r.status === statusFilter)
    }

    if (sort.sortBy) {
      result.sort((a, b) => {
        let aVal = a[sort.sortBy] || ''
        let bVal = b[sort.sortBy] || ''

        if (aVal < bVal) return sort.sortDir === 'asc' ? -1 : 1
        if (aVal > bVal) return sort.sortDir === 'asc' ? 1 : -1
        return 0
      })
    }

    return result
  }, [records, searchTerm, categoryFilter, statusFilter, sort])

  // Pagination Slice
  const totalItems = processedRecords.length
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return processedRecords.slice(start, start + pageSize)
  }, [processedRecords, currentPage, pageSize])

  // Toolbar extra filters
  const toolbarExtra = (
    <div className="flex items-center gap-2">
      <select
        value={categoryFilter}
        onChange={(e) => {
          setCategoryFilter(e.target.value)
          setCurrentPage(1)
          if (e.target.value === 'All') {
            searchParams.delete('category')
          } else {
            searchParams.set('category', e.target.value)
          }
          setSearchParams(searchParams)
        }}
        className="h-9 rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-700 focus:border-[#01458e] focus:outline-none"
        aria-label="Filter by Category"
      >
        {MASTER_CATEGORY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value)
          setCurrentPage(1)
        }}
        className="h-9 rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-700 focus:border-[#01458e] focus:outline-none"
        aria-label="Filter by Status"
      >
        {MASTER_STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )

  const headerActions = useMemo(
    () => (
      <ActionButton
        variant="primary"
        onClick={() =>
          openCreateModal(categoryFilter === 'All' ? 'Departments' : categoryFilter)
        }
        className="text-xs"
      >
        <span className="mr-1.5">
          <Plus className="h-4 w-4" />
        </span>
        Add Configuration Record
      </ActionButton>
    ),
    [categoryFilter, openCreateModal],
  )
  useRegisterDashboardPageHeaderActions(headerActions)

  return (
    <SetupModuleLayout>
      <DomainListWithFormModal
        formOpen={isFormModalOpen}
        onCloseForm={() => setIsFormModalOpen(false)}
        modalTitle={setupRecordFormTitle(formModalMode, selectedRecord)}
        form={
          <SetupRecordForm
            mode={formModalMode}
            initialData={selectedRecord}
            existingRecords={records}
            onCancel={() => setIsFormModalOpen(false)}
            onSave={formModalMode === 'create' ? handleCreate : handleUpdate}
          />
        }
        list={
          <DataTable
            columns={columns}
            rows={paginatedRecords}
            rowKey="id"
            search={searchTerm}
            onSearchChange={(val) => {
              setSearchTerm(val)
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
            pageSizeOptions={[5, 10, 20, 50]}
            sort={sort}
            onSortChange={setSort}
            selectable
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            toolbarExtra={toolbarExtra}
            emptyMessage="No master data records matched your filter or search criteria."
          />
        }
      />

      <SetupRecordDetailModal
        isOpen={isDetailModalOpen}
        record={selectedRecord}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={(item) => openEditModal(item)}
      />

    </SetupModuleLayout>
  )
}
