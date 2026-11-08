import { useCallback, useEffect, useMemo, useState } from 'react'
import { Play } from 'lucide-react'
import DashboardPageHeaderActions from '@/app/shell/components/DashboardPageHeaderActions'
import { DataTable, showAppToast } from '@/shared/components'
import { confirmBeforeAction, useActionConfirm } from '@/shared/components/confirm'
import { GigwButton } from '@/shared/components/buttons/gigw'
import {
  createEmptyDepreciationForm,
  depreciationCategoryLabel,
} from '../constants/assetDepreciation'
import AssetDepreciationActionCell from '../components/AssetDepreciationActionCell'
import AssetDepreciationHistoryModal from '../components/AssetDepreciationHistoryModal'
import AssetDepreciationProcessModal from '../components/AssetDepreciationProcessModal'
import {
  useGetDepreciationListMutation,
  useGetDepreciationProcessDefaultsQuery,
  useProcessDepreciationRunMutation,
  useSearchDepreciationRunsQuery,
} from '../services/assetApi'
import { validateDepreciationProcessForm } from '../utils/assetDepreciationValidation'
import { unwrapErrorMessage } from '../services/assetApiUtils'

import { TABLE_ACTION_COLUMN_CLASS } from '@/shared/components/listing/listingTableStyles'

export default function AssetDepreciationScreen() {
  const requestConfirm = useActionConfirm()
  const [processOpen, setProcessOpen] = useState(false)
  const [formValues, setFormValues] = useState(createEmptyDepreciationForm)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [preview, setPreview] = useState(null)
  const [viewRow, setViewRow] = useState(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sort, setSort] = useState({ sortBy: 'depreciationDate', sortDir: 'desc' })

  const { data: defaults } = useGetDepreciationProcessDefaultsQuery()
  const { data, isFetching, refetch } = useSearchDepreciationRunsQuery({
    search,
    page,
    pageSize,
    sortBy: sort.sortBy,
    sortDir: sort.sortDir,
  })
  const [loadPreview, { isLoading: previewLoading }] = useGetDepreciationListMutation()
  const [processRun, { isLoading: approving }] = useProcessDepreciationRunMutation()

  useEffect(() => {
    if (!defaults) {
      return
    }
    setFormValues((previous) => ({
      ...previous,
      depreciationNo: defaults.depreciationNo,
      processUpToStr: defaults.processUpToStr,
    }))
  }, [defaults])

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
    setPreview(null)
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
      if (field === 'category' || field === 'categoryList' || field === 'depreciationDateStr') {
        resetPreview()
      }
    },
    [resetPreview],
  )

  const openProcess = useCallback(() => {
    setFieldErrors({})
    setFormError('')
    resetPreview()
    setProcessOpen(true)
  }, [resetPreview])

  const closeProcess = useCallback(() => {
    setProcessOpen(false)
    setFieldErrors({})
    setFormError('')
    resetPreview()
  }, [resetPreview])

  const openView = useCallback((row) => {
    setViewRow(row)
  }, [])

  const closeView = useCallback(() => {
    setViewRow(null)
  }, [])

  const handleLoadPreview = useCallback(async () => {
    const errors = validateDepreciationProcessForm(formValues)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    try {
      const result = await loadPreview(formValues).unwrap()
      setPreview(result)
      if (!result.lines?.length) {
        setFormError('No assets eligible for depreciation with the selected filters.')
      } else {
        setFormError('')
      }
    } catch (error) {
      const message = unwrapErrorMessage(error) || 'Unable to load depreciation preview.'
      setFormError(message)
      showAppToast(message, 'error')
    }
  }, [formValues, loadPreview])

  const handleApprove = useCallback(async () => {
    if (!preview?.lines?.length) {
      setFormError('Run Process first to load the depreciation preview.')
      return
    }

    try {
      const result = await processRun({ formValues, preview }).unwrap()
      if (!result.success) {
        const message = 'Depreciation was not processed. No eligible assets were found.'
        setFormError(message)
        showAppToast(message, 'error')
        return
      }
      showAppToast(
        `Processed depreciation for ${result.rowCount} asset line(s).`,
        'success',
      )
      closeProcess()
      refetch()
      setPage(1)
      setFieldErrors({})
      setFormError('')
    } catch (error) {
      const message = unwrapErrorMessage(error) || 'Unable to process depreciation.'
      setFormError(message)
      showAppToast(message, 'error')
    }
  }, [closeProcess, formValues, preview, processRun, refetch])

  const handleApproveRequest = useCallback(() => {
    confirmBeforeAction(requestConfirm, {
      action: 'process',
      recordLabel: formValues.depreciationNo,
      stack: 'nested',
      showSuccessToast: false,
      validate: () => {
        const errors = validateDepreciationProcessForm(formValues)
        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors)
          return false
        }
        if (!preview?.lines?.length) {
          setFormError('Run Process first to load the depreciation preview.')
          return false
        }
        return true
      },
      runAction: handleApprove,
    })
  }, [formValues, handleApprove, preview, requestConfirm])

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
        id: 'depreciationAmount',
        header: 'depreciation amount',
        accessor: 'depreciationAmount',
        cellClassName: 'text-right tabular-nums',
        headerClassName: 'text-right',
      },
      {
        id: 'depreciationNumber',
        header: 'depreciation number',
        accessor: 'depreciationNumber',
        headerClassName: 'text-center',
        cellClassName: 'text-center',
      },
      {
        id: 'depreciationDate',
        header: 'Date',
        accessor: 'depreciationDate',
        headerClassName: 'text-center',
        cellClassName: 'text-center',
      },
      {
        id: 'processUpTo',
        header: 'Process Upto',
        accessor: 'processUpTo',
        valueFormat: 'date',
        headerClassName: 'text-center',
        cellClassName: 'text-center',
      },
      {
        id: 'action',
        header: 'action',
        sortable: false,
        headerClassName: TABLE_ACTION_COLUMN_CLASS,
        cellClassName: TABLE_ACTION_COLUMN_CLASS,
        cell: (row) => <AssetDepreciationActionCell row={row} onView={openView} />,
      },
    ],
    [openView],
  )

  const viewRowEnriched = useMemo(() => {
    if (!viewRow) {
      return null
    }
    return {
      ...viewRow,
      categoryLabel: depreciationCategoryLabel(viewRow.category),
    }
  }, [viewRow])

  return (
    <>
      <DashboardPageHeaderActions>
        <GigwButton type="button" variant="primary" icon={Play} onClick={openProcess}>
          Process
        </GigwButton>
      </DashboardPageHeaderActions>

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

      <AssetDepreciationProcessModal
        open={processOpen}
        onClose={closeProcess}
        values={formValues}
        fieldErrors={fieldErrors}
        formError={formError}
        previewLoading={previewLoading}
        previewLines={preview?.lines ?? []}
        previewTotal={preview?.totalDepreciation ?? 0}
        approving={approving}
        onChange={handleFormChange}
        onLoadPreview={handleLoadPreview}
        onApprove={handleApproveRequest}
      />

      <AssetDepreciationHistoryModal
        open={Boolean(viewRow)}
        row={viewRowEnriched}
        onClose={closeView}
      />
    </>
  )
}
