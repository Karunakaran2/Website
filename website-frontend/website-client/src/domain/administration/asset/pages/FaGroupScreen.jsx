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
import FaGroupActionCell from '../components/FaGroupActionCell'
import FaGroupAssetDetailsForm from '../components/FaGroupAssetDetailsForm'
import FaGroupViewModal from '../components/FaGroupViewModal'
import { createEmptyFaGroupForm } from '../constants/faGroup'
import { isRowActive } from '@/shared/components/status/statusLabels'
import {
  useLazyGetFixedAssetGroupByIdQuery,
  useSaveFaGroupMutation,
  useSearchFaGroupQuery,
  useToggleFaGroupActiveMutation,
} from '../services/assetApi'
import { faGroupFormToRow, faGroupRowToForm } from '../utils/faGroupRow'
import { formatDepreciationRate } from '../utils/formatDepreciationRate'
import { validateFaGroupForm } from '../utils/faGroupValidation'

import { TABLE_ACTION_COLUMN_CLASS } from '@/shared/components/listing/listingTableStyles'

export default function FaGroupScreen() {
  const requestConfirm = useActionConfirm()
  const [formOpen, setFormOpen] = useState(false)
  const [viewRow, setViewRow] = useState(null)
  const [viewLoading, setViewLoading] = useState(false)
  const [formValues, setFormValues] = useState(createEmptyFaGroupForm)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sort, setSort] = useState({ sortBy: 'assetType', sortDir: 'asc' })

  const { data, isFetching, refetch } = useSearchFaGroupQuery({
    search,
    page,
    pageSize,
    sortBy: sort.sortBy,
    sortDir: sort.sortDir,
  })

  const [saveFaGroup] = useSaveFaGroupMutation()
  const [toggleFaGroupActive] = useToggleFaGroupActiveMutation()
  const [fetchFaGroupById] = useLazyGetFixedAssetGroupByIdQuery()

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

  const editingIdMask = formValues.idMask || ''

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
    setFormValues(createEmptyFaGroupForm())
    setFieldErrors({})
    setFormError('')
  }, [])

  const closeForm = useCallback(() => {
    setFormOpen(false)
    resetForm()
  }, [resetForm])

  const openCreate = useCallback(() => {
    resetForm()
    setFormOpen(true)
  }, [resetForm])

  const openEdit = useCallback((row) => {
    const mapped = faGroupRowToForm(row)
    if (mapped) {
      setFormValues(mapped)
      setFieldErrors({})
      setFormError('')
      setFormOpen(true)
    }
  }, [])

  const openView = useCallback(
    async (row) => {
      if (!row?.idMask) {
        return
      }
      setViewRow(row)
      setViewLoading(true)
      try {
        const full = await fetchFaGroupById(row.idMask).unwrap()
        if (full) {
          setViewRow(full)
        }
      } catch (error) {
        showAppToast(error?.data?.message || 'Unable to load FA group for view.', 'error')
      } finally {
        setViewLoading(false)
      }
    },
    [fetchFaGroupById],
  )

  const closeView = useCallback(() => {
    setViewRow(null)
    setViewLoading(false)
  }, [])

  const handleSubmit = useCallback(async () => {
    const errors = validateFaGroupForm(formValues)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    const payload = faGroupFormToRow(formValues)
    try {
      await saveFaGroup(payload).unwrap()
      closeForm()
      refetch()
      setPage(1)
    } catch (error) {
      const serverFieldErrors =
        error?.data?.fieldErrors ?? error?.payload?.fieldErrors
      if (serverFieldErrors && typeof serverFieldErrors === 'object') {
        setFieldErrors(serverFieldErrors)
      }
      setFormError(error?.data?.message || error?.message || 'Unable to save FA group.')
    }
  }, [closeForm, formValues, refetch, saveFaGroup])

  const handleSubmitRequest = useCallback(() => {
    confirmBeforeAction(requestConfirm, {
      action: saveOrUpdateConfirmAction(Boolean(editingIdMask)),
      recordLabel: formValues.assetType || undefined,
      stack: 'base',
      validate: () => {
        const errors = validateFaGroupForm(formValues)
        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors)
          return false
        }
        return true
      },
      runAction: handleSubmit,
    })
  }, [editingIdMask, formValues, handleSubmit, requestConfirm])

  const handleToggleActive = useCallback(
    async (row) => {
      if (!row?.idMask) {
        return
      }
      try {
        await toggleFaGroupActive({
          idMask: row.idMask,
          isActive: isRowActive(row),
        }).unwrap()
        refetch()
      } catch (error) {
        showAppToast(error?.data?.message || 'Unable to update status.', 'error')
      }
    },
    [refetch, toggleFaGroupActive],
  )

  const columns = useMemo(() => {
    const defs = [
      {
        id: '_serial',
        header: 'Sl. No.',
        sortable: false,
        headerClassName: '!min-w-[4.75rem] !w-[4.75rem] whitespace-nowrap !text-center',
        cellClassName: '!text-center text-slate-600',
        accessor: '_serial',
      },
      { id: 'assetType', header: 'asset type', accessor: 'assetType' },
      { id: 'assetClassLabel', header: 'asset class', accessor: 'assetClassLabel' },
      {
        id: 'depreciationRateIt',
        header: 'depreciation rate',
        accessor: 'depreciationRateIt',
        format: 'text',
        cell: (row) => formatDepreciationRate(row.depreciationRateIt),
      },
      {
        id: 'depreciationMethodLabel',
        header: 'depreciation method',
        accessor: 'depreciationMethodLabel',
      },
      { id: 'assetAccount', header: 'asset account', accessor: 'assetAccount' },
      {
        id: 'depreciationAccount',
        header: 'depreciation account',
        accessor: 'depreciationAccount',
      },
      {
        id: 'cumDepreciationAccount',
        header: 'accumulated depreciation',
        accessor: 'cumDepreciationAccount',
      },
      {
        id: 'cwipAccount',
        header: 'CWIP account',
        headerClassName: '!normal-case',
        accessor: 'cwipAccount',
      },
      {
        id: 'action',
        header: 'action',
        sortable: false,
        headerClassName: TABLE_ACTION_COLUMN_CLASS,
        cellClassName: TABLE_ACTION_COLUMN_CLASS,
        cell: (row) => (
          <FaGroupActionCell
            row={row}
            onView={openView}
            onEdit={openEdit}
            onToggleActive={handleToggleActive}
            onRequestConfirm={requestConfirm}
          />
        ),
      },
    ]
    return defs
  }, [handleToggleActive, openEdit, openView, requestConfirm])

  const modalTitle = editingIdMask ? 'Edit FA Group' : 'Add FA Group'

  return (
    <>
      <DomainListPageHeaderActions onAdd={openCreate} label="Add" />

      <DomainListWithFormModal
        formOpen={formOpen}
        onCloseForm={closeForm}
        modalTitle={modalTitle}
        modalSize="4xl"
        form={
          formOpen ? (
            <FaGroupAssetDetailsForm
              values={formValues}
              fieldErrors={fieldErrors}
              formError={formError}
              editingIdMask={editingIdMask}
              showFooter
              onChange={handleFormChange}
              onSubmit={handleSubmitRequest}
              onCancelEdit={closeForm}
            />
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

      <FaGroupViewModal open={Boolean(viewRow)} row={viewRow} onClose={closeView} />
    </>
  )
}
