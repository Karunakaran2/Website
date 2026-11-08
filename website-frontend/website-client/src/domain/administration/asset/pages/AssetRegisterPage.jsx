import React, { useCallback, useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useRegisterDashboardPageHeaderActions } from '@/app/shell/context/DashboardPageHeaderActionsContext'
import ActionButton from '@/shared/components/buttons/ActionButton'
import AssetModuleLayout from '../layouts/AssetModuleLayout'
import AssetDetailModal from '../components/AssetDetailModal'
import AssetRecordForm, { assetRecordFormTitle } from '../components/AssetRecordForm'
import { DomainListWithFormModal } from '@/shared/components/domain'
import { useAssetData } from '../hooks/useAssetData'
import { useDeleteConfirm } from '@/shared/components/confirm'
import { confirmAssetRegisterDelete } from '../../shared/listRecordConfirms'
import { formatINR, formatDate } from '../utils/assetUtils'
import {
  ASSET_CATEGORY_OPTIONS,
  ASSET_STATUS_OPTIONS,
} from '../constants/assetConstants'
import DataTable from '@/shared/components/DataTable'
import StatusChip from '@/shared/components/status/StatusChip'
import {
  TABLE_ROW_ACTIONS_CLASS,
  TableViewAction,
  TableEditAction,
  TableDeleteAction,
} from '@/shared/components/buttons'

export default function AssetRegisterPage() {
  const requestDelete = useDeleteConfirm()
  const {
    records,
    isFormModalOpen,
    setIsFormModalOpen,
    formModalMode,
    selectedAsset,
    isDetailModalOpen,
    setIsDetailModalOpen,
    openCreateModal,
    openEditModal,
    openDetailModal,
    handleCreate,
    handleUpdate,
    deleteRecord,
  } = useAssetData()

  const onConfirmDelete = useCallback(
    (row) => confirmAssetRegisterDelete(requestDelete, deleteRecord, row),
    [deleteRecord, requestDelete],
  )

  // Filter & Pagination States
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sort, setSort] = useState({ sortBy: 'purchaseDate', sortDir: 'desc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selectedIds, setSelectedIds] = useState([])

  // Column definitions following Probity shared DataTable conventions
  const columns = useMemo(
    () => [
      {
        id: 'code',
        header: 'Asset Code',
        accessor: 'code',
        sortable: true,
        pinned: true,
        minWidth: 125,
        cell: (row) => (
          <span className="font-mono font-bold text-[#01458e]">{row.code}</span>
        ),
      },
      {
        id: 'name',
        header: 'Asset Name',
        accessor: 'name',
        sortable: true,
        minWidth: 230,
        cell: (row) => (
          <span className="font-semibold text-slate-900">{row.name}</span>
        ),
      },
      {
        id: 'category',
        header: 'Category',
        accessor: 'category',
        sortable: true,
        minWidth: 150,
      },
      {
        id: 'department',
        header: 'Department',
        accessor: 'department',
        sortable: true,
        minWidth: 140,
      },
      {
        id: 'location',
        header: 'Location',
        accessor: 'location',
        sortable: true,
        minWidth: 170,
        hideable: true,
      },
      {
        id: 'purchaseValue',
        header: 'Value (₹)',
        accessor: 'purchaseValue',
        align: 'right',
        sortable: true,
        minWidth: 130,
        cell: (row) => (
          <span className="font-medium text-slate-900">
            {formatINR(row.purchaseValue)}
          </span>
        ),
      },
      {
        id: 'purchaseDate',
        header: 'Purchase Date',
        accessor: 'purchaseDate',
        align: 'center',
        sortable: true,
        minWidth: 125,
        cell: (row) => (
          <span className="text-slate-600 whitespace-nowrap">
            {formatDate(row.purchaseDate)}
          </span>
        ),
      },
      {
        id: 'assignedTo',
        header: 'Assigned User',
        accessor: 'assignedTo',
        sortable: true,
        minWidth: 140,
        hideable: true,
        cell: (row) => (
          <span className="text-slate-700">{row.assignedTo || '—'}</span>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        accessor: 'status',
        align: 'center',
        sortable: true,
        minWidth: 130,
        cell: (row) => <StatusChip label={row.status} />,
      },
      {
        id: 'actions',
        header: 'Actions',
        align: 'center',
        sortable: false,
        pinned: true,
        minWidth: 110,
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
            <TableDeleteAction
              onClick={() => onConfirmDelete(row)}
              title={`Retire ${row.name}`}
            />
          </div>
        ),
      },
    ],
    [onConfirmDelete, openDetailModal, openEditModal]
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
          (r.assignedTo && r.assignedTo.toLowerCase().includes(q)) ||
          r.department.toLowerCase().includes(q)
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
        let aVal = a[sort.sortBy]
        let bVal = b[sort.sortBy]

        if (sort.sortBy === 'purchaseValue') {
          aVal = Number(aVal) || 0
          bVal = Number(bVal) || 0
        }

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
        }}
        className="h-9 rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-700 focus:border-[#01458e] focus:outline-none"
        aria-label="Filter by Category"
      >
        {ASSET_CATEGORY_OPTIONS.map((opt) => (
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
        {ASSET_STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )

  const headerActions = useMemo(
    () => (
      <ActionButton variant="primary" onClick={openCreateModal} className="text-xs">
        <span className="mr-1.5">
          <Plus className="h-4 w-4" />
        </span>
        Register Asset
      </ActionButton>
    ),
    [openCreateModal],
  )
  useRegisterDashboardPageHeaderActions(headerActions)

  return (
    <AssetModuleLayout>
      <DomainListWithFormModal
        formOpen={isFormModalOpen}
        onCloseForm={() => setIsFormModalOpen(false)}
        modalTitle={assetRecordFormTitle(formModalMode, selectedAsset)}
        form={
          <AssetRecordForm
            mode={formModalMode}
            initialData={selectedAsset}
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
            emptyMessage="No assets matched your search or active filter criteria."
          />
        }
      />

      <AssetDetailModal
        isOpen={isDetailModalOpen}
        asset={selectedAsset}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={(item) => openEditModal(item)}
      />

    </AssetModuleLayout>
  )
}
