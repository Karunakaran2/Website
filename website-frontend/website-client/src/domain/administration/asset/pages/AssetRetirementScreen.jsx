import { useCallback, useEffect, useMemo, useState } from 'react'
import { Play } from 'lucide-react'
import DashboardPageHeaderActions from '@/app/shell/components/DashboardPageHeaderActions'
import { DataTable, showAppToast } from '@/shared/components'
import {
  confirmBeforeAction,
  saveOrUpdateConfirmAction,
  useActionConfirm,
} from '@/shared/components/confirm'
import { GigwButton } from '@/shared/components/buttons/gigw'
import { useGetSalesCustomerListQuery } from '../services/assetApi'
import {
  RETIREMENT_SALES_VALUE_COLUMN_HEADER,
  createEmptyRetirementProcessForm,
} from '../constants/assetRetirement'
import AssetDisposalForwardModal from '../components/AssetDisposalForwardModal'
import AssetRetirementActionCell from '../components/AssetRetirementActionCell'
import AssetRetirementEditModal from '../components/AssetRetirementEditModal'
import AssetRetirementProcessModal from '../components/AssetRetirementProcessModal'
import AssetRetirementViewModal from '../components/AssetRetirementViewModal'
import {
  useGetDisposalProcessDefaultsQuery,
  useGetDisposalPreviewListMutation,
  useProcessAssetDisposalMutation,
  useSearchAssetRetirementQuery,
  useLazyGetAssetDisposalViewQuery,
  useLazyGetAssetDisposalForEditQuery,
  useUpdateAssetDisposalMutation,
  useApproveAssetDisposalMutation,
  useVerifyAssetDisposalMutation,
  useDeleteAssetDisposalMutation,
} from '../services/assetApi'
import { extractAssetWorkflowError } from '../utils/assetWorkflowError'
import {
  validateRetirementEditForm,
  validateRetirementPreviewLines,
  validateRetirementProcessForm,
} from '../utils/assetRetirementValidation'
import { unwrapErrorMessage } from '../services/assetApiUtils'

import { TABLE_ACTION_COLUMN_CLASS } from '@/shared/components/listing/listingTableStyles'

export default function AssetRetirementScreen() {
  const requestConfirm = useActionConfirm()
  const [processOpen, setProcessOpen] = useState(false)
  const [formValues, setFormValues] = useState(createEmptyRetirementProcessForm)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [previewState, setPreviewState] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [editOpen, setEditOpen] = useState(false)
  const [editRow, setEditRow] = useState(null)
  const [editLoading, setEditLoading] = useState(false)
  const [forwardOpen, setForwardOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sort, setSort] = useState({ sortBy: 'retirementDate', sortDir: 'desc' })

  const { data: defaults, refetch: refetchDisposalDefaults } = useGetDisposalProcessDefaultsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })
  const { data: customerList = [] } = useGetSalesCustomerListQuery()
  const { data, isFetching, refetch } = useSearchAssetRetirementQuery({
    search,
    page,
    pageSize,
    sortBy: sort.sortBy,
    sortDir: sort.sortDir,
  })
  const [loadPreview, { isLoading: previewLoading }] = useGetDisposalPreviewListMutation()
  const [processDisposal, { isLoading: processing }] = useProcessAssetDisposalMutation()
  const [fetchView] = useLazyGetAssetDisposalViewQuery()
  const [fetchEdit] = useLazyGetAssetDisposalForEditQuery()
  const [updateDisposal, { isLoading: updatingDisposal }] = useUpdateAssetDisposalMutation()
  const [approveDisposal, { isLoading: approvingDisposal }] = useApproveAssetDisposalMutation()
  const [verifyDisposal, { isLoading: verifyingDisposal }] = useVerifyAssetDisposalMutation()
  const [deleteDisposal] = useDeleteAssetDisposalMutation()

  const editingIdMask = editRow?.idMask ?? ''
  const workflowBusy = approvingDisposal || verifyingDisposal

  useEffect(() => {
    if (!defaults) {
      return
    }
    setFormValues((previous) => ({
      ...previous,
      retirementDateStr: defaults.retirementDateStr ?? previous.retirementDateStr,
      previewCountDisposalNumber: defaults.previewCountDisposalNumber ?? '',
      retirementGroupId:
        previous.retirementGroupId || defaults.retirementNumberingGroups?.[0]?.value || '',
    }))
  }, [defaults])

  const retirementGroupOptions = defaults?.retirementNumberingGroups ?? []
  const previewLines = previewState?.lines ?? []
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

  const resetPreview = useCallback(() => {
    setPreviewState(null)
  }, [])

  const handleFormChange = useCallback(
    (field, value) => {
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
      if (field === 'category' || field === 'categoryList' || field === 'retirementDateStr') {
        resetPreview()
      }
    },
    [resetPreview],
  )

  const handlePreviewLineChange = useCallback((lineIdMask, field, value) => {
    setPreviewState((previous) => {
      if (!previous?.lines) {
        return previous
      }
      const lines = previous.lines.map((line) => {
        if (line.assetInformationIdMask !== lineIdMask) {
          return line
        }
        const next = { ...line, [field]: value }
        if (field === 'selected' && !value) {
          next.saleValue = ''
          next.customerId = ''
        }
        return next
      })
      return { ...previous, lines }
    })
  }, [])

  const handleSalesNumberingChange = useCallback((value) => {
    setPreviewState((previous) => (previous ? { ...previous, salesNumberingIdMask: value } : previous))
  }, [])

  const handlePreviewSelectAllChange = useCallback((selected) => {
    setPreviewState((previous) => {
      if (!previous?.lines) {
        return previous
      }
      return {
        ...previous,
        lines: previous.lines.map((line) => ({
          ...line,
          selected,
          ...(selected ? {} : { saleValue: '', customerId: '' }),
        })),
      }
    })
  }, [])

  const openProcess = useCallback(() => {
    setFieldErrors({})
    setFormError('')
    resetPreview()
    refetchDisposalDefaults()
    setProcessOpen(true)
  }, [refetchDisposalDefaults, resetPreview])

  const closeProcess = useCallback(() => {
    setProcessOpen(false)
    setFieldErrors({})
    setFormError('')
    resetPreview()
  }, [resetPreview])

  const openView = useCallback(
    async (row) => {
      if (!row?.idMask) {
        setViewRow(row)
        return
      }
      try {
        const detail = await fetchView(row.idMask).unwrap()
        setViewRow(detail ?? row)
      } catch {
        setViewRow(row)
      }
    },
    [fetchView],
  )

  const closeView = useCallback(() => {
    setViewRow(null)
  }, [])

  const closeEdit = useCallback(() => {
    setEditOpen(false)
    setForwardOpen(false)
    setEditRow(null)
    setEditLoading(false)
  }, [])

  const reloadEditedDisposal = useCallback(async () => {
    if (!editingIdMask) {
      refetch()
      return
    }
    try {
      const detail = await fetchEdit(editingIdMask).unwrap()
      if (detail) {
        setEditRow(detail)
      }
      refetch()
    } catch {
      refetch()
    }
  }, [editingIdMask, fetchEdit, refetch])

  const openEdit = useCallback(
    async (row) => {
      if (!row?.idMask) {
        return
      }
      setEditOpen(true)
      setEditRow(null)
      setEditLoading(true)
      try {
        const detail = await fetchEdit(row.idMask).unwrap()
        setEditRow(detail)
      } catch (error) {
        closeEdit()
        showAppToast(unwrapErrorMessage(error) || 'Unable to load retirement for edit.', 'error')
      } finally {
        setEditLoading(false)
      }
    },
    [closeEdit, fetchEdit],
  )

  const runUpdate = useCallback(
    async (formValues) => {
      try {
        const updated = await updateDisposal(formValues).unwrap()
        setEditRow({
          ...updated,
          saleValue:
            updated?.saleValue != null && updated.saleValue !== ''
              ? updated.saleValue
              : formValues.saleValue,
        })
        refetch()
        showAppToast('Retirement updated.', 'success')
      } catch (error) {
        showAppToast(unwrapErrorMessage(error) || 'Unable to update retirement.', 'error')
      }
    },
    [refetch, updateDisposal],
  )

  const runApprove = useCallback(
    async (formValues) => {
      if (!formValues?.idMask) {
        return false
      }
      const errors = validateRetirementEditForm(formValues)
      if (Object.keys(errors).length > 0) {
        return false
      }
      try {
        await approveDisposal(formValues.idMask).unwrap()
        closeEdit()
        refetch()
        showAppToast('Retirement approved.', 'success', { action: 'approve' })
        return true
      } catch (error) {
        showAppToast(
          extractAssetWorkflowError(error)
            || unwrapErrorMessage(error)
            || 'Unable to approve retirement.',
          'error',
        )
        return false
      }
    },
    [approveDisposal, closeEdit, refetch],
  )

  const handleUpdateRequest = useCallback(
    (formValues) => {
      confirmBeforeAction(requestConfirm, {
        action: saveOrUpdateConfirmAction(true),
        recordLabel: formValues.assetId || formValues.assetDescription || undefined,
        stack: 'nested',
        showSuccessToast: false,
        validate: () => {
          const errors = validateRetirementEditForm(formValues)
          return Object.keys(errors).length === 0
        },
        runAction: () => runUpdate(formValues),
      })
    },
    [requestConfirm, runUpdate],
  )

  const handleApproveRequest = useCallback(
    (formValues) => {
      confirmBeforeAction(requestConfirm, {
        action: 'approve',
        recordLabel: formValues.assetId || formValues.assetDescription || undefined,
        stack: 'nested',
        showSuccessToast: false,
        validate: () => {
          const errors = validateRetirementEditForm(formValues)
          return Object.keys(errors).length === 0
        },
        runAction: () => runApprove(formValues),
      })
    },
    [requestConfirm, runApprove],
  )

  const handleVerifyRequest = useCallback(() => {
    if (!editingIdMask) {
      return
    }
    confirmBeforeAction(requestConfirm, {
      action: 'verify',
      stack: 'nested',
      showSuccessToast: false,
      runAction: async () => {
        try {
          const verified = await verifyDisposal(editingIdMask).unwrap()
          setEditRow(verified)
          await reloadEditedDisposal()
          showAppToast('Disposal record verified.', 'success', { action: 'verify' })
          return true
        } catch (error) {
          showAppToast(
            extractAssetWorkflowError(error)
              || unwrapErrorMessage(error)
              || 'Unable to verify disposal record.',
            'error',
          )
          return false
        }
      },
    })
  }, [editingIdMask, reloadEditedDisposal, requestConfirm, verifyDisposal])

  const handleForwardOpen = useCallback(() => {
    if (editingIdMask) {
      setForwardOpen(true)
    }
  }, [editingIdMask])

  const runDeleteDisposal = useCallback(
    async (row) => {
      if (!row?.idMask) {
        return
      }
      try {
        await deleteDisposal(row.idMask).unwrap()
        refetch()
        showAppToast('Disposal removed. Asset returned to active inventory.', 'success')
      } catch (error) {
        showAppToast(unwrapErrorMessage(error) || 'Unable to remove disposal.', 'error')
      }
    },
    [deleteDisposal, refetch],
  )

  const handleDeleteDisposalRequest = useCallback(
    (row) => {
      confirmBeforeAction(requestConfirm, {
        action: 'delete',
        recordLabel: row.assetId || row.assetDescription || undefined,
        message:
          'Remove this disposal record and return the asset to the asset register? The asset will not be deleted.',
        showSuccessToast: false,
        runAction: () => runDeleteDisposal(row),
      })
    },
    [requestConfirm, runDeleteDisposal],
  )

  const handleLoadPreview = useCallback(async () => {
    const errors = validateRetirementProcessForm(formValues)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    try {
      const result = await loadPreview(formValues).unwrap()
      setPreviewState(result)
      if (!result.lines?.length) {
        setFormError('No approved assets match the selected filters.')
      } else {
        setFormError('')
      }
    } catch (error) {
      const message = unwrapErrorMessage(error) || 'Unable to load retirement preview.'
      setFormError(message)
      showAppToast(message, 'error')
    }
  }, [formValues, loadPreview])

  const handleProcess = useCallback(async () => {
    if (!previewState?.lines?.length) {
      setFormError('Load preview first to select assets.')
      return
    }
    const lineErrors = validateRetirementPreviewLines(previewState.lines, previewState)
    if (Object.keys(lineErrors).length > 0) {
      setFormError(lineErrors._form || 'Fix validation errors on preview lines.')
      return
    }

    try {
      const result = await processDisposal({ formValues, previewState }).unwrap()
      showAppToast(
        `Processed retirement for ${result.rowCount} asset line(s).`,
        'success',
      )
      closeProcess()
      refetch()
      setPage(1)
    } catch (error) {
      const message = unwrapErrorMessage(error) || 'Unable to process retirement.'
      setFormError(message)
      showAppToast(message, 'error')
    }
  }, [closeProcess, formValues, previewState, processDisposal, refetch])

  const handleProcessRequest = useCallback(() => {
    confirmBeforeAction(requestConfirm, {
      action: previewState?.lines?.length ? 'process' : 'assetRetirement',
      recordLabel: formValues.retirementDateStr,
      stack: 'nested',
      showSuccessToast: false,
      validate: () => {
        const errors = validateRetirementProcessForm(formValues)
        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors)
          return false
        }
        if (previewState?.lines?.length) {
          const lineErrors = validateRetirementPreviewLines(previewState.lines, previewState)
          if (Object.keys(lineErrors).length > 0) {
            setFormError(lineErrors._form || 'Fix preview line errors.')
            return false
          }
        }
        return true
      },
      runAction: previewState?.lines?.length ? handleProcess : handleLoadPreview,
    })
  }, [formValues, handleLoadPreview, handleProcess, previewState, requestConfirm])

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
        id: 'retirementDate',
        header: 'Date',
        accessor: 'retirementDate',
        headerClassName: 'text-center',
        cellClassName: 'text-center',
      },
      {
        id: 'assetId',
        header: 'asset id',
        accessor: 'assetId',
        headerClassName: 'text-center',
        cellClassName: 'text-center',
      },
      {
        id: 'assetDescription',
        header: 'asset description',
        accessor: 'assetDescription',
      },
      {
        id: 'bookValue',
        header: 'book value',
        accessor: 'bookValue',
        valueFormat: 'currency',
        cellClassName: 'text-right tabular-nums',
        headerClassName: 'text-right',
      },
      {
        id: 'retirementType',
        header: 'retirement type',
        accessor: 'retirementType',
        headerClassName: 'text-center',
        cellClassName: 'text-center',
      },
      {
        id: 'saleValue',
        header: RETIREMENT_SALES_VALUE_COLUMN_HEADER,
        accessor: (row) => row.saleValue ?? row.salesValue,
        valueFormat: 'currency',
        cellClassName: 'text-right tabular-nums',
        headerClassName: 'text-right',
      },
      {
        id: 'customerName',
        header: 'customer name',
        accessor: 'customerName',
      },
      {
        id: 'action',
        header: 'action',
        sortable: false,
        headerClassName: TABLE_ACTION_COLUMN_CLASS,
        cellClassName: TABLE_ACTION_COLUMN_CLASS,
        cell: (row) => (
          <AssetRetirementActionCell
            row={row}
            onView={openView}
            onEdit={openEdit}
            onDelete={handleDeleteDisposalRequest}
          />
        ),
      },
    ],
    [handleDeleteDisposalRequest, openEdit, openView],
  )

  return (
    <>
      <DashboardPageHeaderActions>
        <GigwButton type="button" variant="primary" icon={Play} onClick={openProcess}>
          Process
        </GigwButton>
      </DashboardPageHeaderActions>

      <DataTable
        rowKey="idMask"
        columns={columns}
        rows={rows}
        loading={isFetching}
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
        emptyMessage="No data available in table"
      />

      <AssetRetirementProcessModal
        open={processOpen}
        onClose={closeProcess}
        values={formValues}
        fieldErrors={fieldErrors}
        formError={formError}
        previewLoading={previewLoading}
        previewLines={previewLines}
        previewState={previewState}
        retirementGroupOptions={retirementGroupOptions}
        customers={customerList}
        processing={processing}
        onChange={handleFormChange}
        onLoadPreview={handleProcessRequest}
        onProcess={handleProcessRequest}
        onPreviewLineChange={handlePreviewLineChange}
        onPreviewSelectAllChange={handlePreviewSelectAllChange}
        onSalesNumberingChange={handleSalesNumberingChange}
      />

      <AssetRetirementViewModal open={Boolean(viewRow)} row={viewRow} onClose={closeView} />

      <AssetRetirementEditModal
        open={editOpen}
        loading={editLoading}
        row={editRow}
        customers={customerList}
        saving={updatingDisposal}
        approving={approvingDisposal}
        verifying={verifyingDisposal}
        workflowLoading={workflowBusy}
        onClose={closeEdit}
        onUpdate={handleUpdateRequest}
        onForward={handleForwardOpen}
        onVerify={handleVerifyRequest}
        onApprove={handleApproveRequest}
      />

      <AssetDisposalForwardModal
        idMask={editingIdMask}
        isOpen={forwardOpen && Boolean(editingIdMask)}
        onClose={() => setForwardOpen(false)}
        onForwarded={async () => {
          setForwardOpen(false)
          await reloadEditedDisposal()
          showAppToast('Disposal record forwarded.', 'success', { action: 'forward' })
        }}
      />
    </>
  )
}
