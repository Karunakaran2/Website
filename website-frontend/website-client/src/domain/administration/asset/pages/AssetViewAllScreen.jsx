import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getModuleRoute } from '@/shared/constants'
import { DataTable, showAppToast } from '@/shared/components'
import {
  confirmBeforeAction,
  confirmedActionFailure,
  useActionConfirm,
} from '@/shared/components/confirm'
import AssetInformationViewModal from '../components/AssetInformationViewModal'
import AssetViewAllActionCell from '../components/AssetViewAllActionCell'
import AssetViewAllEditDescriptionModal from '../components/AssetViewAllEditDescriptionModal'
import {
  useLazyGetAssetInformationByIdQuery,
  useSearchAssetInformationQuery,
  useUpdateApprovedAssetDescriptionMutation,
} from '../services/assetApi'
import {
  ASSET_VIEW_ALL_ALLOCATION_FILTER,
  ASSET_VIEW_ALL_ALLOCATION_FILTER_OPTIONS,
} from '../constants/assetViewAll'
import { FormLabel } from '@/shared/components/forms'
import { TABLE_ACTION_COLUMN_CLASS } from '@/shared/components/listing/listingTableStyles'
function normalizeDescription(value) {
  return typeof value === 'string' ? value.trim() : ''
}

export default function AssetViewAllScreen() {
  const navigate = useNavigate()
  const requestConfirm = useActionConfirm()

  const [viewOpen, setViewOpen] = useState(false)
  const [viewRow, setViewRow] = useState(null)
  const [viewLoading, setViewLoading] = useState(false)

  const [editOpen, setEditOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [editLoading, setEditLoading] = useState(false)
  const [editDescription, setEditDescription] = useState('')
  const [editFormError, setEditFormError] = useState('')

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sort, setSort] = useState({ sortBy: 'assetId', sortDir: 'asc' })
  const [allocationFilter, setAllocationFilter] = useState(
    ASSET_VIEW_ALL_ALLOCATION_FILTER.ALL,
  )

  const [fetchAssetInformationById] = useLazyGetAssetInformationByIdQuery()
  const [updateApprovedAssetDescription, { isLoading: updateDescriptionPending }] =
    useUpdateApprovedAssetDescriptionMutation()

  const { data, isFetching, refetch } = useSearchAssetInformationQuery({
    search,
    page,
    pageSize,
    sortBy: sort.sortBy,
    sortDir: sort.sortDir,
    approvedOnly: true,
    allocationFilter,
  })

  const tableRows = data?.rows ?? []
  const total = data?.total ?? 0

  const rows = useMemo(
    () =>
      tableRows.map((row, index) => ({
        ...row,
        _serial: (page - 1) * pageSize + index + 1,
      })),
    [tableRows, page, pageSize],
  )

  const openView = useCallback(
    async (row) => {
      if (!row?.idMask) {
        return
      }
      setViewOpen(true)
      setViewRow(null)
      setViewLoading(true)
      try {
        const full = await fetchAssetInformationById(row.idMask).unwrap()
        setViewRow(full)
      } catch (error) {
        setViewOpen(false)
        showAppToast(error?.data?.message || 'Unable to load asset for view.', 'error')
      } finally {
        setViewLoading(false)
      }
    },
    [fetchAssetInformationById],
  )

  const closeView = useCallback(() => {
    setViewOpen(false)
    setViewRow(null)
    setViewLoading(false)
  }, [])

  const closeEdit = useCallback(() => {
    setEditOpen(false)
    setEditRow(null)
    setEditLoading(false)
    setEditDescription('')
    setEditFormError('')
  }, [])

  const openEdit = useCallback(
    async (row) => {
      if (!row?.idMask) {
        return
      }
      setEditOpen(true)
      setEditRow(null)
      setEditDescription('')
      setEditFormError('')
      setEditLoading(true)
      try {
        const full = await fetchAssetInformationById(row.idMask).unwrap()
        setEditRow(full)
        setEditDescription(full.assetDescription ?? '')
      } catch (error) {
        setEditOpen(false)
        showAppToast(error?.data?.message || 'Unable to load asset for edit.', 'error')
      } finally {
        setEditLoading(false)
      }
    },
    [fetchAssetInformationById],
  )

  const handleAllocate = useCallback(
    (row) => {
      if (!row?.idMask) {
        return
      }
      navigate(getModuleRoute('asset', 'assets-allocation'), {
        state: {
          assetInformationIdMask: row.idMask,
          from: 'view-all-asset',
        },
      })
    },
    [navigate],
  )

  const submitDescriptionUpdate = useCallback(async () => {
    const idMask = editRow?.idMask
    const assetDescription = normalizeDescription(editDescription)
    if (!idMask) {
      return confirmedActionFailure('Missing asset id.')
    }
    if (!assetDescription) {
      setEditFormError('Please enter asset description.')
      return false
    }
    setEditFormError('')
    try {
      await updateApprovedAssetDescription({ idMask, assetDescription }).unwrap()
      showAppToast('Asset description updated successfully.', 'success')
      await refetch()
      closeEdit()
      return true
    } catch (error) {
      const fieldErrors =
        error?.data?.fieldErrors ?? error?.payload?.fieldErrors
      if (fieldErrors?.assetDescription) {
        setEditFormError(fieldErrors.assetDescription)
      } else if (fieldErrors?.status) {
        setEditFormError(fieldErrors.status)
      } else {
        setEditFormError(error?.data?.message || 'Unable to update asset description.')
      }
      return confirmedActionFailure(
        error?.data?.message || 'Unable to update asset description.',
      )
    }
  }, [
    closeEdit,
    editDescription,
    editRow?.idMask,
    refetch,
    updateApprovedAssetDescription,
  ])

  const handleEditSubmit = useCallback(() => {
    confirmBeforeAction(requestConfirm, {
      action: 'update',
      stack: 'nested',
      recordLabel: editRow?.assetId || editRow?.assetDescription || undefined,
      showSuccessToast: false,
      validate: () => {
        if (!normalizeDescription(editDescription)) {
          setEditFormError('Please enter asset description.')
          return false
        }
        return true
      },
      runAction: submitDescriptionUpdate,
    })
  }, [
    editDescription,
    editRow?.assetDescription,
    editRow?.assetId,
    editRow?.idMask,
    requestConfirm,
    submitDescriptionUpdate,
  ])

  const allocationFilterControl = (
    <div className="ml-2 flex flex-wrap items-end gap-2 border-l border-slate-200 pl-2">
      <div className="flex min-w-[10rem] flex-col gap-1">
        <FormLabel htmlFor="view-all-allocation-filter" as="span">
          Allocation status
        </FormLabel>
        <select
          id="view-all-allocation-filter"
          name="allocationFilter"
          value={allocationFilter}
          onChange={(event) => {
            setAllocationFilter(event.target.value || ASSET_VIEW_ALL_ALLOCATION_FILTER.ALL)
            setPage(1)
          }}
          className="input-field min-h-9 w-full min-w-[10rem] text-sm"
        >
        {ASSET_VIEW_ALL_ALLOCATION_FILTER_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
        </select>
      </div>
    </div>
  )

  const columns = useMemo(
    () => [
      {
        id: '_serial',
        header: 'Sl. No.',
        sortable: false,
        headerClassName: '!min-w-[4.75rem] !w-[4.75rem] whitespace-nowrap !text-center',
        cellClassName: '!text-center text-slate-600',
        accessor: '_serial',
      },
      { id: 'assetId', header: 'asset id', accessor: 'assetId' },
      { id: 'assetDescription', header: 'asset description', accessor: 'assetDescription' },
      { id: 'assetTypeLabel', header: 'asset type', accessor: 'assetTypeLabel' },
      { id: 'capitalisationDate', header: 'capitalisation date', accessor: 'capitalisationDate' },
      { id: 'putToUseDate', header: 'put to use date', accessor: 'putToUseDate' },
      {
        id: 'action',
        header: 'action',
        sortable: false,
        headerClassName: TABLE_ACTION_COLUMN_CLASS,
        cellClassName: TABLE_ACTION_COLUMN_CLASS,
        cell: (row) => (
          <AssetViewAllActionCell
            row={row}
            onView={openView}
            onEdit={openEdit}
            onAllocate={handleAllocate}
          />
        ),
      },
    ],
    [handleAllocate, openEdit, openView],
  )

  return (
    <>
      <DataTable
        columns={columns}
        rows={rows}
        rowKey="idMask"
        toolbarExtra={allocationFilterControl}
        search={search}
        onSearchChange={(value) => {
          setSearch(value)
          setPage(1)
        }}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(value) => {
          setPageSize(value)
          setPage(1)
        }}
        sort={sort}
        onSortChange={setSort}
        loading={isFetching}
        emptyMessage="No data available in table"
      />

      <AssetInformationViewModal
        open={viewOpen}
        row={viewRow}
        loading={viewLoading}
        showValuationSummary
        onClose={closeView}
      />

      <AssetViewAllEditDescriptionModal
        open={editOpen}
        row={editRow}
        loading={editLoading}
        formError={editFormError}
        assetDescription={editDescription}
        onDescriptionChange={setEditDescription}
        onClose={closeEdit}
        onSubmit={handleEditSubmit}
        submitLoading={updateDescriptionPending}
      />
    </>
  )
}
