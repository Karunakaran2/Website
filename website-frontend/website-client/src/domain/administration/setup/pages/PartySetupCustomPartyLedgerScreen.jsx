import { useCallback, useMemo, useState } from 'react'
import PartySetupDetailsModal from '../components/PartySetupDetailsModal'
import { Controller, useFieldArray } from 'react-hook-form'
import { mergeProbityFieldRules } from '@/shared/utils/fieldValidationRules'
import { useProbityForm } from '@/shared/utils/useProbityForm'
import { FeaturedBasicSelect } from '@/shared/lib/tailwreck'
import { SetupFormRowActions } from '../components/setupGigwButtons'
import SetupDataTable from '../components/SetupDataTable'
import {
  FieldError,
  FieldGrid,
  FormLabel,
  InputField,
  formFieldCellClass,
} from '@/shared/components/forms'
import {
  orgProbityControlSlotClass,
  orgProbitySelectInvalidClass,
  tailwreckSelectTriggerClass,
} from '@/shared/components/forms/tailwreckFormShell'
import { resolveSelectValue } from '@/shared/utils'
import SetupFormFooter from '../components/SetupFormFooter'
import SetupFormShell from '../components/SetupFormShell'
import SetupListPageHeaderActions from '../components/SetupListPageHeaderActions'
import SetupListScreen from '../components/SetupListScreen'
import SetupLoadErrorAlert from '../components/SetupLoadErrorAlert'
import { useSetupMaster } from '../hooks/useSetupMaster'
import { useSetupFormSaveRequest } from '../hooks/useSetupFormSaveRequest'
import {
  useGetAccountSetupListQuery,
  useSavePartyCustomLedgerListMutation,
} from '../services/setupApi'
import {
  createPartyDetailColumns,
  PARTY_CUSTOM_LEDGER_DETAIL_KINDS,
} from '../utils/partySetupDetailColumns'

const EMPTY_CUSTOM_LEDGER = {
  prefix: '',
  accountTypeId: '',
}

function responseList(response) {
  if (Array.isArray(response)) {
    return response
  }
  if (Array.isArray(response?.data)) {
    return response.data
  }
  if (Array.isArray(response?.response)) {
    return response.response
  }
  return []
}

function selectValue(valueOrEvent) {
  const value = resolveSelectValue(valueOrEvent)
  return value && typeof value === 'object' && 'value' in value ? value.value : value
}

function extractFieldErrors(error) {
  const payload = error?.payload
  if (payload?.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
    return payload.data
  }
  return {}
}

function backendFieldError(fieldErrors, collection, index, fieldName) {
  return fieldErrors?.[`${collection}[${index}].${fieldName}`]
    || fieldErrors?.[`${collection}.${index}.${fieldName}`]
    || ''
}

function queryErrorMessage(error, fallback) {
  if (!error) {
    return ''
  }
  if (typeof error.data === 'string' && error.data.trim()) {
    return error.data
  }
  if (typeof error.data?.message === 'string' && error.data.message.trim()) {
    return error.data.message
  }
  return fallback
}

function toAccountTypeId(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && String(value).trim() !== '' ? parsed : value
}

export default function PartySetupCustomPartyLedgerScreen({ master }) {
  const setup = useSetupMaster(master)
  const requestSave = useSetupFormSaveRequest(false)
  const [formOpen, setFormOpen] = useState(false)
  const [detailsPartyId, setDetailsPartyId] = useState(null)
  const [detailsKind, setDetailsKind] = useState(null)
  const openDetails = useCallback((partyId, kind) => {
    setDetailsPartyId(partyId)
    setDetailsKind(kind)
  }, [])
  const closeDetails = useCallback(() => {
    setDetailsPartyId(null)
    setDetailsKind(null)
  }, [])
  const [modalSelectedIds, setModalSelectedIds] = useState([])
  const [formError, setFormError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const {
    data: accountGroupResponse,
    error: accountGroupError,
    isFetching: isAccountGroupLoading,
  } = useGetAccountSetupListQuery()
  const [savePartyCustomLedgerList, { isLoading: isSaving }] = useSavePartyCustomLedgerListMutation()

  const accountGroups = useMemo(
    () => responseList(accountGroupResponse),
    [accountGroupResponse],
  )
  const groupOptions = useMemo(
    () => [
      { value: '', label: 'Select Group' },
      ...accountGroups
        .filter((group) => group?.id && group?.accountName)
        .map((group) => ({
          value: String(group.id),
          label: group.accountName,
        })),
    ],
    [accountGroups],
  )

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useProbityForm({
    defaultValues: { customLedgerEntries: [{ ...EMPTY_CUSTOM_LEDGER }] },
  })
  const customLedgers = useFieldArray({ control, name: 'customLedgerEntries' })
  const accountGroupLoadError = queryErrorMessage(
    accountGroupError,
    'Unable to load Extra Ledger groups.',
  )

  const resetForm = () => {
    reset({ customLedgerEntries: [{ ...EMPTY_CUSTOM_LEDGER }] })
    setFormError('')
    setFieldErrors({})
    setModalSelectedIds([])
  }

  const partyPickerColumns = useMemo(
    () => master.columns.filter((column) => ['partyName', 'partyType', 'panNo'].includes(column.id)),
    [master.columns],
  )

  const listColumns = useMemo(
    () => [
      ...master.columns,
      ...createPartyDetailColumns({
        master,
        kinds: PARTY_CUSTOM_LEDGER_DETAIL_KINDS,
        onOpenDetails: openDetails,
      }),
    ],
    [master, openDetails],
  )

  const submitValues = async (values) => {
    if (isSaving) {
      return
    }
    clearErrors()
    setFormError('')
    setFieldErrors({})
    let invalid = false
    const entries = values.customLedgerEntries || []
    if (modalSelectedIds.length === 0) {
      setFormError('Please select at least one party.')
      invalid = true
    }
    entries.forEach((entry, index) => {
      if (!String(entry.prefix || '').trim()) {
        setError(`customLedgerEntries.${index}.prefix`, {
          type: 'required',
          message: 'Please enter prefix.',
        })
        invalid = true
      }
      if (!String(entry.accountTypeId || '').trim()) {
        setError(`customLedgerEntries.${index}.accountTypeId`, {
          type: 'required',
          message: 'Please select group.',
        })
        invalid = true
      }
    })
    if (invalid) {
      return
    }

    const persist = async () => {
      const result = await savePartyCustomLedgerList({
        partyIds: modalSelectedIds,
        customLedgerEntries: entries.map((entry) => ({
          prefix: String(entry.prefix).trim(),
          accountTypeId: toAccountTypeId(entry.accountTypeId),
        })),
      })
      if (result.error) {
        const nextFieldErrors = extractFieldErrors(result.error)
        setFieldErrors(nextFieldErrors)
        setFormError(
          Object.values(nextFieldErrors).filter(Boolean).join(' ')
            || (typeof result.error.data === 'string' && result.error.data.trim())
            || 'Unable to save party ledgers.',
        )
        return
      }
      resetForm()
      setFormOpen(false)
      setup.refetch()
    }

    requestSave(persist, async () => true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setFormError('')
    setFieldErrors({})
    setModalSelectedIds([])
  }

  const openForm = () => {
    resetForm()
    setFormOpen(true)
  }

  const ledgerForm = (
    <form onSubmit={handleSubmit(submitValues)} className="flex w-full min-w-0 flex-col gap-4" noValidate>
      <SetupFormShell formError={formError || accountGroupLoadError}>
        <div className="flex w-full min-w-0 flex-col gap-5">
          <div className="flex min-w-0 flex-col gap-3">
            <p className="text-xs font-semibold text-slate-700">Extra ledger</p>
          {customLedgers.fields.map((row, index) => {
            const prefixError = errors.customLedgerEntries?.[index]?.prefix?.message
              || backendFieldError(fieldErrors, 'customLedgerEntries', index, 'prefix')
            const groupError = errors.customLedgerEntries?.[index]?.accountTypeId?.message
              || backendFieldError(fieldErrors, 'customLedgerEntries', index, 'accountTypeId')
            return (
              <div
                key={row.id}
                className={`space-y-3 ${index > 0 ? 'border-t border-slate-100 pt-4' : ''}`}
              >
                <FieldGrid cols={1} className="w-full">
                  <InputField
                    label="Prefix"
                    required
                    {...register(
                      `customLedgerEntries.${index}.prefix`,
                      mergeProbityFieldRules(
                        'prefix',
                        { required: true, label: 'Prefix' },
                        { required: 'Please enter prefix.' },
                      ),
                    )}
                    disabled={isSaving}
                    error={prefixError}
                  />
                  <div className={formFieldCellClass}>
                    <FormLabel label="Group" required />
                    <Controller
                      name={`customLedgerEntries.${index}.accountTypeId`}
                      control={control}
                      rules={{ required: 'Please select group.' }}
                      render={({ field }) => (
                        <>
                          <div className={orgProbityControlSlotClass}>
                            <FeaturedBasicSelect
                              name={field.name}
                              options={groupOptions}
                              value={field.value}
                              onChange={(value) => field.onChange(String(selectValue(value) || ''))}
                              size="md"
                              theme="primary"
                              border="sm"
                              disabled={isAccountGroupLoading || isSaving}
                              className={`w-full ${tailwreckSelectTriggerClass} ${groupError ? orgProbitySelectInvalidClass : ''}`.trim()}
                            />
                          </div>
                          <FieldError message={groupError} />
                        </>
                      )}
                    />
                  </div>
                </FieldGrid>
                <SetupFormRowActions
                  canRemove={customLedgers.fields.length > 1}
                  onRemove={() => customLedgers.remove(index)}
                  onAdd={index === customLedgers.fields.length - 1
                    ? () => customLedgers.append({ ...EMPTY_CUSTOM_LEDGER })
                    : null}
                  addLabel="Add Extra Ledger"
                  disabled={isSaving}
                />
              </div>
            )
          })}

          <FieldError
            message={errors.customLedgerEntries?.root?.message
              || errors.customLedgerEntries?.message
              || fieldErrors.customLedgerEntries
              || fieldErrors.partyIds}
          />
          </div>

          <div className="flex min-w-0 flex-col gap-2 border-t border-slate-100 pt-4">
            <FormLabel label="Apply to parties" required className="!text-xs" />
            <p className="text-xs text-slate-500">
              Search and select parties for these ledgers. Use pagination to reach more rows.
            </p>
            <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200">
              <SetupDataTable
                columns={partyPickerColumns}
                rows={setup.rows}
                rowKey={master.idField}
                search={setup.search}
                onSearchChange={setup.setSearch}
                page={setup.page}
                pageSize={setup.pageSize}
                total={setup.total}
                onPageChange={setup.setPage}
                onPageSizeChange={setup.setPageSize}
                sort={setup.sort}
                onSortChange={setup.setSort}
                selectable
                selectedIds={modalSelectedIds}
                onSelectionChange={setModalSelectedIds}
                loading={setup.isFetching}
                emptyMessage="No parties found"
              />
            </div>
            {modalSelectedIds.length > 0 ? (
              <p className="text-xs text-slate-600">
                {modalSelectedIds.length} part{modalSelectedIds.length === 1 ? 'y' : 'ies'} selected.
              </p>
            ) : null}
          </div>
        </div>
      </SetupFormShell>
      <SetupFormFooter
        onCancel={closeForm}
        submitLabel={isSaving ? 'Submitting...' : 'Submit'}
      />
    </form>
  )

  return (
    <>
      <SetupListPageHeaderActions onAdd={openForm} label="Add" />
      <SetupListScreen
        formOpen={formOpen}
        onCloseForm={closeForm}
        modalTitle="Add — Party Ledger"
        modalSize="4xl"
        form={formOpen ? ledgerForm : null}
        list={
          <>
            <SetupLoadErrorAlert error={setup.loadError} />
            <SetupDataTable
              columns={listColumns}
              rows={setup.rows}
              rowKey={master.idField}
              search={setup.search}
              onSearchChange={setup.setSearch}
              page={setup.page}
              pageSize={setup.pageSize}
              total={setup.total}
              onPageChange={setup.setPage}
              onPageSizeChange={setup.setPageSize}
              sort={setup.sort}
              onSortChange={setup.setSort}
              loading={setup.isFetching}
              emptyMessage="No data available in table"
            />
          </>
        }
      />
      <PartySetupDetailsModal
        partyId={detailsPartyId}
        kind={detailsKind}
        onClose={closeDetails}
        stack={formOpen ? 'nested' : 'base'}
      />
    </>
  )
}
