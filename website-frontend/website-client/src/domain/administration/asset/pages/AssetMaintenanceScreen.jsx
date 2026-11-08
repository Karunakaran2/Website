import { useCallback, useEffect, useMemo, useState } from 'react'
import { DataTable, showAppToast } from '@/shared/components'
import {
  confirmBeforeAction,
  confirmedActionFailure,
  saveOrUpdateConfirmAction,
  useActionConfirm,
} from '@/shared/components/confirm'
import { DomainListPageHeaderActions } from '@/shared/components/domain'
import { SelectField } from '@/shared/components/forms'
import { MODULE_PAGE_CONTENT_CLASS } from '@/shared/constants/moduleLayoutStyles'
import {
  createEmptyAssetMaintenanceForm,
  isMaintenanceApproved,
  MAINTENANCE_WORKFLOW_FILTER_DEFAULT,
  MAINTENANCE_WORKFLOW_FILTER_OPTIONS,
  maintenanceWorkflowLabel,
} from '../constants/assetMaintenance'
import AssetMaintenanceActionCell from '../components/AssetMaintenanceActionCell'
import AssetMaintenanceFormModal from '../components/AssetMaintenanceFormModal'
import AssetMaintenanceForwardModal from '../components/AssetMaintenanceForwardModal'
import AssetMaintenanceViewModal from '../components/AssetMaintenanceViewModal'
import {
  useApproveAssetMaintenanceMutation,
  useDeleteAssetMaintenanceMutation,
  useLazyGetAssetMaintenanceByIdMaskQuery,
  useListAssetsForMaintenanceQuery,
  useListMaintenancePurchaseInvoicesQuery,
  useSaveAssetMaintenanceMutation,
  useSearchAssetMaintenanceQuery,
  useSubmitAssetMaintenanceMutation,
  useVerifyAssetMaintenanceMutation,
} from '../services/assetApi'
import { unwrapErrorMessage } from '../services/assetApiUtils'
import { withMaintenanceAssetOptionForEdit } from '../services/assetMaintenanceApiMappers'
import { assetMaintenanceRowToForm } from '../utils/assetMaintenanceRow'
import { extractAssetWorkflowError } from '../utils/assetWorkflowError'
import { validateAssetMaintenanceForm } from '../utils/assetMaintenanceValidation'

function mapMaintenanceApiFieldErrors(fieldErrors) {
  if (!fieldErrors || typeof fieldErrors !== 'object') {
    return {}
  }
  const mapped = { ...fieldErrors }
  if (mapped.description != null && mapped.maintenanceDescription == null) {
    mapped.maintenanceDescription = mapped.description
    delete mapped.description
  }
  return mapped
}

import { TABLE_ACTION_COLUMN_CLASS } from '@/shared/components/listing/listingTableStyles'

export default function AssetMaintenanceScreen() {
  const requestConfirm = useActionConfirm()
  const [createOpen, setCreateOpen] = useState(false)
  const [createValues, setCreateValues] = useState(() => createEmptyAssetMaintenanceForm())
  const [createFieldErrors, setCreateFieldErrors] = useState({})
  const [createFormError, setCreateFormError] = useState('')

  const [editOpen, setEditOpen] = useState(false)
  const [editValues, setEditValues] = useState(() => createEmptyAssetMaintenanceForm())
  const [editFieldErrors, setEditFieldErrors] = useState({})
  const [editFormError, setEditFormError] = useState('')

  const [viewRow, setViewRow] = useState(null)
  const [forwardOpen, setForwardOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState(MAINTENANCE_WORKFLOW_FILTER_DEFAULT)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sort, setSort] = useState({ sortBy: 'maintenanceDate', sortDir: 'desc' })

  const { data: assetOptions = [], refetch: refetchMaintenanceAssets } = useListAssetsForMaintenanceQuery(
    undefined,
    { refetchOnMountOrArgChange: true },
  )
  const createAssetOptions = assetOptions
  const editAssetOptions = useMemo(
    () => withMaintenanceAssetOptionForEdit(assetOptions, editValues),
    [assetOptions, editValues],
  )

  useEffect(() => {
    if (!createOpen || !createValues.assetInformationIdMask) {
      return
    }
    if (!createAssetOptions.some((opt) => opt.idMask === createValues.assetInformationIdMask)) {
      setCreateValues((prev) => ({
        ...prev,
        assetInformationIdMask: '',
        assetDescription: '',
      }))
    }
  }, [createOpen, createAssetOptions, createValues.assetInformationIdMask])
  const { data: createInvoices = [] } = useListMaintenancePurchaseInvoicesQuery(
    createValues.maintenanceDateStr,
    { skip: !createOpen || !createValues.maintenanceDateStr },
  )
  const { data: editInvoices = [] } = useListMaintenancePurchaseInvoicesQuery(
    editValues.maintenanceDateStr,
    { skip: !editOpen || !editValues.maintenanceDateStr },
  )

  const { data, isFetching, refetch } = useSearchAssetMaintenanceQuery({
    search,
    statusFilter,
    page,
    pageSize,
    sortBy: sort.sortBy,
    sortDir: sort.sortDir,
  })
  const [saveMaintenance, { isLoading: savingCreate }] = useSaveAssetMaintenanceMutation()
  const [saveMaintenanceEdit, { isLoading: savingEdit }] = useSaveAssetMaintenanceMutation()
  const [approveMaintenance, { isLoading: approving }] = useApproveAssetMaintenanceMutation()
  const [submitMaintenance, { isLoading: submitting }] = useSubmitAssetMaintenanceMutation()
  const [verifyMaintenance, { isLoading: verifying }] = useVerifyAssetMaintenanceMutation()
  const [deleteMaintenance, { isLoading: deletingMaintenance }] =
    useDeleteAssetMaintenanceMutation()
  const [fetchMaintenanceById, { isFetching: editLoading }] = useLazyGetAssetMaintenanceByIdMaskQuery()

  const editingIdMask = editValues.idMask || ''
  const workflowBusy = approving || submitting || verifying

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

  const resetCreateForm = useCallback(() => {
    setCreateValues(createEmptyAssetMaintenanceForm())
    setCreateFieldErrors({})
    setCreateFormError('')
  }, [])

  const openCreate = useCallback(() => {
    resetCreateForm()
    refetchMaintenanceAssets()
    setCreateOpen(true)
  }, [resetCreateForm, refetchMaintenanceAssets])

  const closeCreate = useCallback(() => {
    setCreateOpen(false)
    resetCreateForm()
  }, [resetCreateForm])

  const handleCreateChange = useCallback((field, value) => {
    setCreateValues((previous) => ({ ...previous, [field]: value }))
    setCreateFieldErrors((previous) => {
      if (!previous[field]) {
        return previous
      }
      const next = { ...previous }
      delete next[field]
      return next
    })
    setCreateFormError('')
  }, [])

  const handleEditChange = useCallback((field, value) => {
    setEditValues((previous) => ({ ...previous, [field]: value }))
    setEditFieldErrors((previous) => {
      if (!previous[field]) {
        return previous
      }
      const next = { ...previous }
      delete next[field]
      return next
    })
    setEditFormError('')
  }, [])

  const runCreateSave = useCallback(async () => {
    setCreateFormError('')
    try {
      await saveMaintenance(createValues).unwrap()
      closeCreate()
      refetch()
      setPage(1)
      showAppToast('Maintenance record saved.', 'success', { action: 'save' })
      return true
    } catch (error) {
      const fieldErrors = error?.data?.fieldErrors
      if (fieldErrors && typeof fieldErrors === 'object') {
        setCreateFieldErrors(mapMaintenanceApiFieldErrors(fieldErrors))
      }
      const message =
        unwrapErrorMessage(error) || 'Unable to save maintenance record.'
      setCreateFormError(message)
      return confirmedActionFailure(message)
    }
  }, [closeCreate, createValues, refetch, saveMaintenance])

  const handleCreateSaveRequest = useCallback(() => {
    confirmBeforeAction(requestConfirm, {
      action: saveOrUpdateConfirmAction(false),
      recordLabel: createValues.maintenanceDescription || undefined,
      stack: 'nested',
      showSuccessToast: false,
      validate: () => {
        const errors = validateAssetMaintenanceForm(createValues)
        if (Object.keys(errors).length > 0) {
          setCreateFieldErrors(errors)
          return false
        }
        return true
      },
      runAction: runCreateSave,
    })
  }, [createValues, requestConfirm, runCreateSave])

  const openEdit = useCallback(
    (row) => {
      setEditFieldErrors({})
      setEditFormError('')
      setEditValues(assetMaintenanceRowToForm(row))
      setEditOpen(true)
      if (!row?.idMask) {
        return
      }
      fetchMaintenanceById(row.idMask)
        .unwrap()
        .then((detail) => {
          if (detail) {
            setEditValues(assetMaintenanceRowToForm(detail))
          }
        })
        .catch(() => {
          setEditFormError('Unable to load maintenance details. Showing list data.')
        })
    },
    [fetchMaintenanceById],
  )

  const closeEdit = useCallback(() => {
    setEditOpen(false)
    setForwardOpen(false)
    setEditFieldErrors({})
    setEditFormError('')
  }, [])

  const reloadEditedMaintenance = useCallback(async () => {
    if (!editingIdMask) {
      refetch()
      return
    }
    try {
      const detail = await fetchMaintenanceById(editingIdMask).unwrap()
      if (detail) {
        setEditValues(assetMaintenanceRowToForm(detail))
      }
      refetch()
    } catch {
      refetch()
    }
  }, [editingIdMask, fetchMaintenanceById, refetch])

  const runEditSave = useCallback(async () => {
    setEditFormError('')
    try {
      await saveMaintenanceEdit(editValues).unwrap()
      closeEdit()
      refetch()
      showAppToast('Maintenance record updated.', 'success', { action: 'update' })
      return true
    } catch (error) {
      const fieldErrors = error?.data?.fieldErrors
      if (fieldErrors && typeof fieldErrors === 'object') {
        setEditFieldErrors(mapMaintenanceApiFieldErrors(fieldErrors))
      }
      const message =
        unwrapErrorMessage(error) || 'Unable to update maintenance record.'
      setEditFormError(message)
      return confirmedActionFailure(message)
    }
  }, [closeEdit, editValues, refetch, saveMaintenanceEdit])

  const handleEditSaveRequest = useCallback(() => {
    if (isMaintenanceApproved(editValues.approve)) {
      return
    }
    confirmBeforeAction(requestConfirm, {
      action: saveOrUpdateConfirmAction(true),
      recordLabel: editValues.maintenanceDescription || editValues.idMask,
      stack: 'nested',
      showSuccessToast: false,
      validate: () => {
        const errors = validateAssetMaintenanceForm(editValues)
        if (Object.keys(errors).length > 0) {
          setEditFieldErrors(errors)
          return false
        }
        return true
      },
      runAction: runEditSave,
    })
  }, [editValues, requestConfirm, runEditSave])

  const handleSubmitWorkflow = useCallback(() => {
    if (!editingIdMask) {
      return
    }
    confirmBeforeAction(requestConfirm, {
      action: 'submit',
      stack: 'nested',
      runAction: async () => {
        try {
          const submitted = await submitMaintenance(editingIdMask).unwrap()
          setEditValues(assetMaintenanceRowToForm(submitted))
          await reloadEditedMaintenance()
          showAppToast(
            'Submitted. You may Verify and Approve here, or Forward to another user.',
            'success',
            { action: 'submit' },
          )
          return true
        } catch (error) {
          const message =
            extractAssetWorkflowError(error) || 'Unable to submit maintenance record.'
          setEditFormError(message)
          showAppToast(message, 'error')
          return false
        }
      },
    })
  }, [editingIdMask, reloadEditedMaintenance, requestConfirm, submitMaintenance])

  const handleVerifyWorkflow = useCallback(() => {
    if (!editingIdMask) {
      return
    }
    confirmBeforeAction(requestConfirm, {
      action: 'verify',
      stack: 'nested',
      runAction: async () => {
        try {
          const verified = await verifyMaintenance(editingIdMask).unwrap()
          setEditValues(assetMaintenanceRowToForm(verified))
          await reloadEditedMaintenance()
          showAppToast('Maintenance record verified.', 'success', { action: 'verify' })
          return true
        } catch (error) {
          const message =
            extractAssetWorkflowError(error)
            || unwrapErrorMessage(error)
            || 'Unable to verify maintenance record.'
          setEditFormError(message)
          showAppToast(message, 'error')
          return false
        }
      },
    })
  }, [editingIdMask, reloadEditedMaintenance, requestConfirm, verifyMaintenance])

  const handleEditApproveRequest = useCallback(() => {
    confirmBeforeAction(requestConfirm, {
      action: 'approve',
      recordLabel: editValues.maintenanceDescription || editValues.assetId,
      stack: 'nested',
      validate: () => {
        const errors = validateAssetMaintenanceForm(editValues)
        if (Object.keys(errors).length > 0) {
          setEditFieldErrors(errors)
          return false
        }
        return true
      },
      runAction: async () => {
        try {
          await approveMaintenance(editingIdMask).unwrap()
          closeEdit()
          refetch()
          showAppToast('Maintenance approved.', 'success', { action: 'approve' })
          return true
        } catch (error) {
          const message =
            extractAssetWorkflowError(error)
            || error?.data?.message
            || 'Unable to approve maintenance record.'
          setEditFormError(message)
          showAppToast(message, 'error')
          return false
        }
      },
    })
  }, [
    approveMaintenance,
    closeEdit,
    editValues,
    editingIdMask,
    refetch,
    requestConfirm,
  ])

  const runDeleteMaintenance = useCallback(
    async (row) => {
      if (!row?.idMask) {
        return
      }
      try {
        await deleteMaintenance(row.idMask).unwrap()
        if (editOpen && editValues.idMask === row.idMask) {
          closeEdit()
        }
        refetch()
        refetchMaintenanceAssets()
        showAppToast('Maintenance record deleted.', 'success')
      } catch (error) {
        showAppToast(unwrapErrorMessage(error) || 'Unable to delete maintenance record.', 'error')
      }
    },
    [
      closeEdit,
      deleteMaintenance,
      editOpen,
      editValues.idMask,
      refetch,
      refetchMaintenanceAssets,
    ],
  )

  const handleDeleteMaintenanceRequest = useCallback(
    (row) => {
      confirmBeforeAction(requestConfirm, {
        action: 'delete',
        recordLabel: row.assetId || row.description || undefined,
        message: 'Delete this draft maintenance record? This cannot be undone.',
        showSuccessToast: false,
        runAction: () => runDeleteMaintenance(row),
      })
    },
    [requestConfirm, runDeleteMaintenance],
  )

  const handleEditDeleteRequest = useCallback(() => {
    if (!editValues.idMask || isMaintenanceApproved(editValues.approve)) {
      return
    }
    confirmBeforeAction(requestConfirm, {
      action: 'delete',
      recordLabel: editValues.assetId || editValues.maintenanceDescription || editValues.idMask,
      confirmMessage: 'Delete this draft maintenance record? This cannot be undone.',
      showSuccessToast: false,
      stack: 'nested',
      runAction: () => runDeleteMaintenance(editValues),
    })
  }, [editValues, requestConfirm, runDeleteMaintenance])

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
      {
        id: 'assetId',
        header: 'asset id',
        accessor: 'assetId',
      },
      {
        id: 'assetDescription',
        header: 'Asset Description',
        accessor: 'assetDescription',
      },
      {
        id: 'description',
        header: 'Maintenance Description',
        accessor: 'description',
      },
      {
        id: 'maintenanceDate',
        header: 'Maintenance Date',
        accessor: 'maintenanceDate',
        headerClassName: 'text-center',
        cellClassName: 'text-center',
      },
      {
        id: 'vendorName',
        header: 'vendor name',
        accessor: 'vendorName',
      },
      {
        id: 'cost',
        header: 'cost',
        accessor: 'cost',
        cellClassName: 'text-right tabular-nums',
        headerClassName: 'text-right',
      },
      {
        id: 'approve',
        header: 'Status',
        accessor: (row) => maintenanceWorkflowLabel(row.approve, row.workflowStatus),
        headerClassName: 'text-center',
        cellClassName: 'text-center',
      },
      {
        id: 'action',
        header: 'action',
        sortable: false,
        headerClassName: TABLE_ACTION_COLUMN_CLASS,
        cellClassName: TABLE_ACTION_COLUMN_CLASS,
        cell: (row) => (
          <AssetMaintenanceActionCell
            row={row}
            onView={setViewRow}
            onEdit={openEdit}
            onDelete={handleDeleteMaintenanceRequest}
          />
        ),
      },
    ],
    [handleDeleteMaintenanceRequest, openEdit],
  )

  return (
    <>
      <DomainListPageHeaderActions onAdd={openCreate} label="Add" />

      <div className={`${MODULE_PAGE_CONTENT_CLASS} gap-4`}>
        <div className="max-w-xs">
          <SelectField
            label="Filter by Status"
            name="statusFilter"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value)
              setPage(1)
            }}
          >
            {MAINTENANCE_WORKFLOW_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </SelectField>
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          rowKey="idMask"
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
      </div>

      <AssetMaintenanceFormModal
        open={createOpen}
        mode="create"
        values={createValues}
        fieldErrors={createFieldErrors}
        formError={createFormError}
        saving={savingCreate}
        assetOptions={createAssetOptions}
        purchaseInvoiceOptions={createInvoices}
        onChange={handleCreateChange}
        onSave={handleCreateSaveRequest}
        onClose={closeCreate}
      />

      <AssetMaintenanceViewModal
        open={Boolean(viewRow)}
        row={viewRow}
        onClose={() => setViewRow(null)}
      />

      <AssetMaintenanceFormModal
        open={editOpen}
        mode="edit"
        values={editValues}
        fieldErrors={editFieldErrors}
        formError={editFormError}
        saving={savingEdit}
        loading={editLoading}
        approving={approving}
        workflowLoading={workflowBusy}
        assetOptions={editAssetOptions}
        purchaseInvoiceOptions={editInvoices}
        onChange={handleEditChange}
        onSave={handleEditSaveRequest}
        onDelete={handleEditDeleteRequest}
        onSubmitWorkflow={handleSubmitWorkflow}
        onForward={() => setForwardOpen(true)}
        onVerify={handleVerifyWorkflow}
        onApprove={handleEditApproveRequest}
        deleting={deletingMaintenance}
        onClose={closeEdit}
      />

      <AssetMaintenanceForwardModal
        idMask={editingIdMask}
        isOpen={forwardOpen && editOpen}
        onClose={() => setForwardOpen(false)}
        onForwarded={async () => {
          setForwardOpen(false)
          await reloadEditedMaintenance()
          showAppToast('Maintenance record forwarded.', 'success', { action: 'forward' })
        }}
      />
    </>
  )
}
