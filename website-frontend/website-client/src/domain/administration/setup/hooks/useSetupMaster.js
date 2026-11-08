import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  closeForm,
  openCreateForm,
  openEditForm,
  resetSetupState,
  setFormErrors,
  setPage,
  setPageSize,
  setSearch,
  setSort,
} from '../redux/slice'
import {
  selectSetupEditingId,
  selectSetupFieldErrors,
  selectSetupFormError,
  selectSetupFormOpen,
  selectSetupPage,
  selectSetupPageSize,
  selectSetupSearch,
  selectSetupSortBy,
  selectSetupSortDir,
} from '../redux/selectors'
import {
  useRemoveSetupMutation,
  useSaveSetupMutation,
  useSearchSetupQuery,
  useSubmitSetupMutation,
  useUpdateSetupActiveStatusMutation,
  useUpdateSetupDefaultStatusMutation,
  useUpdateSetupMutation,
} from '../services/setupApi'
import { isSetupRowActive } from '@/shared/components/status/statusLabels'
import { extractSetupFieldErrors, formatSetupLoadError } from '../utils/setupApiError'
import {
  normalizeSetupRows,
  resolveSetupPublicId,
  setupMutationIdFields,
} from '../utils/setupRowId'
import { resolveSetupServerSortFields } from '../constants/setupServerSortFields'
import { isSetupAmountField } from '../utils/setupAmountField'
import { isAmountFieldKey } from '@/shared/utils/amountFieldKey'
import { toApiAmount } from '@/shared/utils/probityFormat'

function formatLocalDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function toLocalDatePayload(value) {
  if (value == null || value === '') {
    return null
  }
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return formatLocalDate(value)
  }
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value
    }
    if (value.includes('T')) {
      return value.slice(0, 10)
    }
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) {
      return formatLocalDate(parsed)
    }
  }
  return value
}

function toPositiveId(value) {
  if (value == null || value === '') {
    return null
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

function toFormErrorMessage(error, fieldErrors) {
  const messages = Object.values(fieldErrors || {}).filter(Boolean)
  if (messages.length) {
    return ''
  }
  if (typeof error?.data === 'string' && error.data.trim()) {
    return error.data
  }
  return 'Unable to save details'
}

export function useSetupMaster(master) {
  const dispatch = useDispatch()
  const search = useSelector(selectSetupSearch)
  const page = useSelector(selectSetupPage)
  const pageSize = useSelector(selectSetupPageSize)
  const sortBy = useSelector(selectSetupSortBy)
  const sortDir = useSelector(selectSetupSortDir)
  const formOpen = useSelector(selectSetupFormOpen)
  const editingId = useSelector(selectSetupEditingId)
  const formError = useSelector(selectSetupFormError)
  const fieldErrors = useSelector(selectSetupFieldErrors)

  useEffect(() => {
    dispatch(resetSetupState())
    if (master.defaultSortBy) {
      dispatch(setSort({
        sortBy: master.defaultSortBy,
        sortDir: master.defaultSortDir || 'asc',
      }))
    }
  }, [master.resource, master.defaultSortBy, master.defaultSortDir, dispatch])

  const sortFields = resolveSetupServerSortFields(master.resource, master)

  const { data, isFetching, error, refetch } = useSearchSetupQuery({
    resource: master.resource,
    search,
    page,
    pageSize,
    sortBy,
    sortDir,
    sortFields,
  })

  const [saveSetup] = useSaveSetupMutation()
  const [updateSetup] = useUpdateSetupMutation()
  const [removeSetup] = useRemoveSetupMutation()
  const [updateActiveStatus] = useUpdateSetupActiveStatusMutation()
  const [updateDefaultStatus] = useUpdateSetupDefaultStatusMutation()
  const [submitSetup] = useSubmitSetupMutation()

  const handleSave = async (values) => {
    const body = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value === '' ? null : value]),
    )
    if ('fromDate' in body) {
      body.fromDate = toLocalDatePayload(body.fromDate)
    }
    if ('toDate' in body) {
      body.toDate = toLocalDatePayload(body.toDate)
    }
    if ('accountLedgerId' in body) {
      body.accountLedgerId = toPositiveId(body.accountLedgerId)
    }
    if ('custodianId' in body) {
      body.custodianId = toPositiveId(body.custodianId)
    }
    if ('seatUserAllotId' in body) {
      body.seatUserAllotId = toPositiveId(body.seatUserAllotId)
    }
    if (body.userBean && typeof body.userBean === 'object') {
      body.userBean = {
        seatUserAllotId: toPositiveId(body.userBean.seatUserAllotId),
      }
    }
    if ('bankId' in body && body.bankId != null) {
      const parsedBankId = Number(body.bankId)
      if (!Number.isNaN(parsedBankId)) {
        body.bankId = parsedBankId
      }
    }
    if ('branchId' in body && body.branchId != null) {
      const parsedBranchId = Number(body.branchId)
      if (!Number.isNaN(parsedBranchId)) {
        body.branchId = parsedBranchId
      }
    }
    for (const field of master.fields || []) {
      if (!isSetupAmountField(field)) {
        continue
      }
      const key = field.name
      if (!(key in body) || body[key] == null || body[key] === '') {
        continue
      }
      body[key] = toApiAmount(body[key])
    }
    for (const [key, value] of Object.entries(body)) {
      if (value == null || value === '' || typeof value !== 'string') {
        continue
      }
      if (isAmountFieldKey(key)) {
        body[key] = toApiAmount(value)
      }
    }
    if ('defaultStatus' in body) {
      body.defaultStatus = body.defaultStatus === true || body.defaultStatus === 'Y' ? 'Y' : 'N'
    }
    const rows = normalizeSetupRows(data?.data ?? [], master)
    const editingRow = editingId
      ? rows.find((row) => resolveSetupPublicId(row, master) === editingId)
      : null
    if (master.booleanStatus) {
      body.isDelete = editingRow ? editingRow.isDelete === true : false
      body.isActive = editingRow ? editingRow.isActive === true : true
    }
    const result = editingId
      ? await updateSetup({
          resource: master.resource,
          entityName: master.entityName,
          id: editingId,
          body: {
            ...body,
            ...setupMutationIdFields(editingRow, editingId),
          },
        })
      : await saveSetup({
          resource: master.resource,
          entityName: master.entityName,
          body,
        })

    if (result.error) {
      const nextFieldErrors = extractSetupFieldErrors(result.error)
      dispatch(setFormErrors({
        message: toFormErrorMessage(result.error, nextFieldErrors),
        fieldErrors: nextFieldErrors,
      }))
      return false
    }

    dispatch(closeForm())
    if (!editingId) {
      dispatch(setPage(1))
    }
    refetch()
    return true
  }

  const handleRemove = async (row) => {
    const id = resolveSetupPublicId(row, master)
    if (master.deleteViaUpdate) {
      const body = {
        ...row,
        ...setupMutationIdFields(row, id),
        isDelete: true,
        isActive: false,
      }
      if ('fromDate' in body) {
        body.fromDate = toLocalDatePayload(body.fromDate)
      }
      if ('toDate' in body) {
        body.toDate = toLocalDatePayload(body.toDate)
      }
      await updateSetup({
        resource: master.resource,
        entityName: master.entityName,
        id,
        body,
      })
    } else {
      await removeSetup({ resource: master.resource, entityName: master.entityName, id })
    }
    refetch()
  }

  const handleToggleActive = async (row) => {
    const id = resolveSetupPublicId(row, master)
    const nextStatus = isSetupRowActive(row) ? 'N' : 'Y'
    await updateActiveStatus({
      resource: master.resource,
      entityName: master.entityName,
      id,
      activeStatus: nextStatus,
    })
    refetch()
  }

  const handleSubmit = async (row) => {
    const id = resolveSetupPublicId(row, master)
    await submitSetup({ resource: master.resource, entityName: master.entityName, id })
    refetch()
  }

  const handleSetDefault = async (row, defaultStatus = 'Y') => {
    const id = resolveSetupPublicId(row, master)
    await updateDefaultStatus({
      resource: master.resource,
      entityName: master.entityName,
      id,
      defaultStatus: defaultStatus === true || defaultStatus === 'Y' ? 'Y' : 'N',
    })
    refetch()
  }

  const handleToggleDefault = async (row) => {
    await handleSetDefault(row, row.defaultStatus === 'Y' ? 'N' : 'Y')
  }

  const rows = normalizeSetupRows(data?.data ?? [], master)

  return {
    rows,
    total: data?.recordsFiltered ?? 0,
    isFetching,
    loadError: formatSetupLoadError(error),
    search,
    page,
    pageSize,
    sort: { sortBy, sortDir },
    formOpen,
    editingId,
    formError,
    fieldErrors,
    setSearch: (value) => dispatch(setSearch(value)),
    setPage: (value) => dispatch(setPage(value)),
    setPageSize: (value) => dispatch(setPageSize(value)),
    setSort: (value) => dispatch(setSort(value)),
    openCreate: () => dispatch(openCreateForm()),
    openEdit: (row) => dispatch(openEditForm(resolveSetupPublicId(row, master))),
    closeForm: () => dispatch(closeForm()),
    setFormErrors: (payload) => dispatch(setFormErrors(payload)),
    handleSave,
    handleRemove,
    handleToggleActive,
    handleSubmit,
    handleSetDefault,
    handleToggleDefault,
    refetch,
  }
}
