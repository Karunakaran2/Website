import { useCallback, useMemo, useState } from 'react'
import { DataTable, showAppToast } from '@/shared/components'
import {
  confirmBeforeAction,
  saveOrUpdateConfirmAction,
  useActionConfirm,
} from '@/shared/components/confirm'
import {
  DomainListPageHeaderActions,
  DomainListWithFormModal,
} from '@/shared/components/domain'
import AssetInformationActionCell from '../components/AssetInformationActionCell'
import AssetInformationCapitalisationForm from '../components/AssetInformationCapitalisationForm'
import AssetInformationViewModal from '../components/AssetInformationViewModal'
import AssetEditFormSkeleton from '../components/AssetModalSkeleton'
import { createEmptyAssetInformationForm } from '../constants/assetInformation'
import AssetInformationForwardModal from '../components/AssetInformationForwardModal'
import {
  useApproveAssetInformationMutation,
  useLazyGetAssetInformationByIdQuery,
  useSaveAssetInformationMutation,
  useSearchAssetInformationQuery,
  useSubmitAssetInformationMutation,
  useVerifyAssetInformationMutation,
} from '../services/assetApi'
import { useAssetInformationApprove } from '../hooks/useAssetInformationApprove'
import { assetInformationRowToForm } from '../utils/assetInformationRow'
import {
  normalizeAssetInformationStatus,
  resolveAssetInformationFormFooterActions,
} from '../utils/assetInformationFormFooterActions'
import { assetInformationWorkflowStatusLabel } from '../utils/assetInformationStatus'
import { validateAssetInformationForm } from '../utils/assetInformationValidation'
import { apiErrorMessage } from '@/shared/api/apiError'
import { extractAssetWorkflowError } from '../utils/assetWorkflowError'
import { TABLE_ACTION_COLUMN_CLASS } from '@/shared/components/listing/listingTableStyles'

export default function AssetInformationScreen() {
  const requestConfirm = useActionConfirm()
  const [formOpen, setFormOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [viewRow, setViewRow] = useState(null)
  const [viewLoading, setViewLoading] = useState(false)
  const [editFormLoading, setEditFormLoading] = useState(false)
  const [formValues, setFormValues] = useState(createEmptyAssetInformationForm)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sort, setSort] = useState({ sortBy: 'assetId', sortDir: 'asc' })
  const [forwardOpen, setForwardOpen] = useState(false)

  const { data, isFetching, refetch } = useSearchAssetInformationQuery({
    search,
    page,
    pageSize,
    sortBy: sort.sortBy,
    sortDir: sort.sortDir,
  })

  const [saveAssetInformation, { isLoading: saveLoading }] = useSaveAssetInformationMutation()
  const [approveAssetInformation, { isLoading: approveLoading }] =
    useApproveAssetInformationMutation()
  const [submitAssetInformation, { isLoading: submitWorkflowLoading }] =
    useSubmitAssetInformationMutation()
  const [verifyAssetInformation, { isLoading: verifyWorkflowLoading }] =
    useVerifyAssetInformationMutation()
  const [fetchAssetInformationById] = useLazyGetAssetInformationByIdQuery()
  const workflowLoading = submitWorkflowLoading || verifyWorkflowLoading

  const tableRows = data?.rows ?? []
  const total = data?.total ?? 0
  const editingIdMask = formValues.idMask || ''

  const rows = useMemo(
    () =>
      tableRows.map((row, index) => ({
        ...row,
        _serial: (page - 1) * pageSize + index + 1,
      })),
    [tableRows, page, pageSize],
  )

  const handleFormChange = useCallback((field, value) => {
    setFormValues((previous) => ({ ...previous, [field]: value }))
    setFieldErrors((previous) => {
      if (!previous[field]) {
        return previous
      }
      const next = { ...previous }
      delete next[field]
      return next
    })
    setFormError('')
  }, [])

  const resetForm = useCallback(() => {
    setFormValues(createEmptyAssetInformationForm())
    setFieldErrors({})
    setFormError('')
  }, [])

  const closeForm = useCallback(() => {
    setFormOpen(false)
    setEditFormLoading(false)
    resetForm()
  }, [resetForm])

  const footerActions = resolveAssetInformationFormFooterActions({
    status: formValues.status,
    hasId: Boolean(editingIdMask),
    canSubmit: formValues.canSubmit,
    canForward: formValues.canForward,
    canVerify: formValues.canVerify,
    canApprove: formValues.canApprove,
  })

  const { handleApproveRequest } = useAssetInformationApprove({
    requestConfirm,
    formValues,
    editingIdMask,
    setFieldErrors,
    setFormError,
    saveAssetInformation,
    approveAssetInformation,
    closeForm,
    refetch,
    setPage,
  })

  const openCreate = useCallback(() => {
    resetForm()
    setFormOpen(true)
  }, [resetForm])

  const openEdit = useCallback(
    async (row) => {
      if (!row?.idMask) {
        return
      }
      setFieldErrors({})
      setFormError('')
      setFormValues({ ...createEmptyAssetInformationForm(), idMask: row.idMask })
      setEditFormLoading(true)
      setFormOpen(true)
      try {
        const full = await fetchAssetInformationById(row.idMask).unwrap()
        const mapped = assetInformationRowToForm(full)
        if (mapped) {
          setFormValues({
            ...mapped,
            status: mapped.status || row?.status || '',
          })
        }
      } catch (error) {
        setFormOpen(false)
        showAppToast(error?.data?.message || 'Unable to load asset for edit.', 'error')
      } finally {
        setEditFormLoading(false)
      }
    },
    [fetchAssetInformationById],
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

  const reloadEditedAsset = useCallback(async () => {
    if (!editingIdMask) {
      refetch()
      return
    }
    try {
      const full = await fetchAssetInformationById(editingIdMask).unwrap()
      const mapped = assetInformationRowToForm(full)
      if (mapped) {
        setFormValues((previous) => ({ ...previous, ...mapped, status: mapped.status }))
      }
      refetch()
    } catch {
      refetch()
    }
  }, [editingIdMask, fetchAssetInformationById, refetch])

  const handleSubmitWorkflow = useCallback(() => {
    if (!editingIdMask) {
      return
    }
    confirmBeforeAction(requestConfirm, {
      action: 'submit',
      stack: 'base',
      runAction: async () => {
        try {
          const submitted = await submitAssetInformation(editingIdMask).unwrap()
          const mapped = assetInformationRowToForm(submitted)
          if (mapped) {
            setFormValues((previous) => ({ ...previous, ...mapped, status: mapped.status }))
          }
          await reloadEditedAsset()
          showAppToast(
            'Submitted. You may Verify and Approve here, or Forward to another user.',
            'success',
            { action: 'submit' },
          )
          return true
        } catch (error) {
          showAppToast(extractAssetWorkflowError(error) || 'Unable to submit asset information.', 'error')
          return false
        }
      },
    })
  }, [editingIdMask, reloadEditedAsset, requestConfirm, submitAssetInformation])

  const handleVerifyWorkflow = useCallback(() => {
    if (!editingIdMask) {
      return
    }
    confirmBeforeAction(requestConfirm, {
      action: 'verify',
      stack: 'base',
      runAction: async () => {
        try {
          const verified = await verifyAssetInformation(editingIdMask).unwrap()
          const mapped = assetInformationRowToForm(verified)
          if (mapped) {
            setFormValues((previous) => ({ ...previous, ...mapped, status: mapped.status }))
          }
          await reloadEditedAsset()
          showAppToast('Asset information verified.', 'success', { action: 'verify' })
          return true
        } catch (error) {
          const message =
            apiErrorMessage(error, '')
            || extractAssetWorkflowError(error)
            || 'Unable to verify asset information.'
          setFormError(message)
          showAppToast(message, 'error')
          return false
        }
      },
    })
  }, [editingIdMask, reloadEditedAsset, requestConfirm, verifyAssetInformation])

  const handleSubmit = useCallback(async () => {
    const validation = validateAssetInformationForm(formValues)
    if (!validation.valid) {
      setFieldErrors(validation.fieldErrors)
      setFormError('Please correct the highlighted fields.')
      return
    }

    try {
      const saved = await saveAssetInformation(formValues).unwrap()
      const mapped = assetInformationRowToForm(saved)
      const statusCode = normalizeAssetInformationStatus(mapped?.status ?? saved?.status)
      const keepOpenForWorkflow =
        Boolean(mapped)
        && (!editingIdMask || statusCode === 'I' || statusCode === 'V')
      if (keepOpenForWorkflow) {
        setFormValues({
          ...mapped,
          status: mapped.status || saved?.status || '',
        })
        setFieldErrors({})
        setFormError('')
      } else {
        closeForm()
        setPage(1)
      }
      refetch()
    } catch (error) {
      const serverFieldErrors =
        error?.data?.fieldErrors ?? error?.payload?.fieldErrors
      if (serverFieldErrors && typeof serverFieldErrors === 'object') {
        setFieldErrors(serverFieldErrors)
      }
      setFormError(error?.data?.message || error?.message || 'Unable to save asset information.')
    }
  }, [closeForm, editingIdMask, formValues, refetch, saveAssetInformation])

  const handleSubmitRequest = useCallback(() => {
    confirmBeforeAction(requestConfirm, {
      action: saveOrUpdateConfirmAction(Boolean(editingIdMask)),
      recordLabel: formValues.assetId || formValues.assetDescription || undefined,
      stack: 'base',
      validate: () => {
        const validation = validateAssetInformationForm(formValues)
        if (!validation.valid) {
          setFieldErrors(validation.fieldErrors)
          setFormError('Please correct the highlighted fields.')
          return false
        }
        return true
      },
      runAction: handleSubmit,
    })
  }, [editingIdMask, formValues, handleSubmit, requestConfirm])

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
      {
        id: 'status',
        header: 'status',
        accessor: 'status',
        cell: (row) => assetInformationWorkflowStatusLabel(row.status),
      },
      { id: 'capitalisationDate', header: 'capitalisation date', accessor: 'capitalisationDate' },
      { id: 'putToUseDate', header: 'put to use date', accessor: 'putToUseDate' },
      {
        id: 'action',
        header: 'action',
        sortable: false,
        headerClassName: TABLE_ACTION_COLUMN_CLASS,
        cellClassName: TABLE_ACTION_COLUMN_CLASS,
        cell: (row) => (
          <AssetInformationActionCell row={row} onView={openView} onEdit={openEdit} />
        ),
      },
    ],
    [openEdit, openView],
  )

  const modalTitle = editingIdMask ? 'Edit Asset Information' : 'Add Asset Information'

  return (
    <>
      <DomainListPageHeaderActions onAdd={openCreate} label="Add" />

      <DomainListWithFormModal
        formOpen={formOpen}
        onCloseForm={closeForm}
        modalTitle={modalTitle}
        modalSize="5xl"
        form={
          formOpen ? (
            editFormLoading && editingIdMask ? (
              <AssetEditFormSkeleton sections={[{ fields: 12, cols: 3 }]} />
            ) : (
              <AssetInformationCapitalisationForm
                values={formValues}
                fieldErrors={fieldErrors}
                formError={formError}
                isEditing={Boolean(editingIdMask)}
                readOnly={footerActions.readOnlyForm}
                showSubmit={footerActions.showSubmit}
                showForward={footerActions.showForward}
                showVerify={footerActions.showVerify}
                showApprove={footerActions.showApprove}
                showUpdate={footerActions.showUpdate || footerActions.showDraftSave}
                onSubmitWorkflow={footerActions.showSubmit ? handleSubmitWorkflow : undefined}
                onForward={footerActions.showForward ? () => setForwardOpen(true) : undefined}
                onVerify={footerActions.showVerify ? handleVerifyWorkflow : undefined}
                onApprove={footerActions.showApprove ? handleApproveRequest : undefined}
                submitLoading={saveLoading}
                workflowLoading={workflowLoading}
                approveLoading={approveLoading}
                onChange={handleFormChange}
                onSubmit={handleSubmitRequest}
                onCancelEdit={closeForm}
              />
            )
          ) : null
        }
        list={
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
        }
      />

      <AssetInformationViewModal
        open={viewOpen}
        row={viewRow}
        loading={viewLoading}
        onClose={closeView}
      />

      <AssetInformationForwardModal
        idMask={editingIdMask}
        isOpen={forwardOpen && Boolean(editingIdMask)}
        onClose={() => setForwardOpen(false)}
        onForwarded={async () => {
          setForwardOpen(false)
          await reloadEditedAsset()
          showAppToast('Asset information forwarded.', 'success', { action: 'forward' })
        }}
      />
    </>
  )
}
