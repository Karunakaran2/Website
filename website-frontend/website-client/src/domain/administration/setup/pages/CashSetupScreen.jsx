import { useEffect, useMemo, useState } from 'react'
import { formCheckboxControlClass } from '@/shared/components/forms'
import SetupDataTable from '../components/SetupDataTable'
import { useAuthUser } from '@/domain/auth/hooks/useAuthUser'
import SetupActionCell from '../components/SetupActionCell'
import SetupEditFormSkeleton from '../components/SetupEditFormSkeleton'
import SetupForm from '../components/SetupForm'
import SetupListPageHeaderActions from '../components/SetupListPageHeaderActions'
import SetupListScreen from '../components/SetupListScreen'
import SetupLoadErrorAlert from '../components/SetupLoadErrorAlert'
import { useActionConfirm } from '@/shared/components/confirm'
import { useSetupMaster } from '../hooks/useSetupMaster'
import { setupRowDeleteDescription } from '../utils/setupRowDeleteDescription'
import { useSetupRecordById } from '../hooks/useSetupRecordById'
import { isSetupEditFormLoading } from '../utils/setupEditFormLoading'
import { setupFormModalTitle, setupFormSubmitLabel } from '../utils/setupFormModalTitle'
import { resolveSetupPublicId, setupMutationIdFields } from '../utils/setupRowId'
import { useGetUserAllocationListQuery } from '../services/setupApi'

function toAllocationList(response) {
  if (Array.isArray(response)) {
    return response
  }
  if (Array.isArray(response?.data)) {
    return response.data
  }
  return []
}

function currentUserName(currentUser) {
  return currentUser?.name || currentUser?.username || ''
}

function namesMatch(left, right) {
  return Boolean(left) && Boolean(right) && String(left).trim().toLowerCase() === String(right).trim().toLowerCase()
}

function toNumericId(value) {
  if (value == null || value === '') {
    return null
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function buildCashLedgerName(cashCode, description) {
  const source = String(cashCode || '').trim() || String(description || '').trim()
  return source ? `${source}- Account` : ''
}

export default function CashSetupScreen({ master }) {
  const setup = useSetupMaster(master)
  const requestConfirm = useActionConfirm()
  const currentUser = useAuthUser()
  const { data: userAllocationResponse } = useGetUserAllocationListQuery()
  const [externalValues, setExternalValues] = useState(null)

  const allocations = useMemo(
    () => toAllocationList(userAllocationResponse),
    [userAllocationResponse],
  )
  const {
    data: editingRecord,
    isFetching: isEditingRecordLoading,
    error: editingRecordError,
  } = useSetupRecordById(master, setup.editingId)
  const editingRow = editingRecord
    || setup.rows.find((row) => resolveSetupPublicId(row, master) === setup.editingId)
    || null
  const loggedInName = currentUserName(currentUser)
  const loggedInAllocation = allocations.find((allocation) => (
    namesMatch(allocation?.userName, loggedInName)
    || namesMatch(allocation?.userName, currentUser?.username)
    || namesMatch(allocation?.userName, currentUser?.email)
    || namesMatch(allocation?.allocatedFor, loggedInName)
    || namesMatch(allocation?.allocatedFor, currentUser?.username)
  ))

  useEffect(() => {
    if (!setup.formOpen) {
      setExternalValues(null)
      return
    }
    if (editingRow) {
      return
    }
    setExternalValues((current) => ({
      ...(current || {}),
      custodianName: loggedInAllocation?.userName || loggedInName,
    }))
  }, [editingRow, loggedInAllocation, loggedInName, setup.formOpen])

  const formValues = useMemo(() => {
    if (!editingRow) {
      return null
    }
    return {
      id: editingRow.id,
      idMask: editingRow.idMask,
      cashType: editingRow.cashType,
      pettyCashCodeOrCashCode: editingRow.pettyCashCodeOrCashCode,
      description: editingRow.description,
      accountLedgerId: editingRow.accountLedgerId,
      custodianName: editingRow.custodianName || loggedInAllocation?.userName || loggedInName,
      accountLedgerName: editingRow.accountLedgerName || '',
      defaultStatus: editingRow.defaultStatus === 'Y',
    }
  }, [
    setup.editingId,
    editingRow?.id,
    editingRow?.idMask,
    editingRow?.cashType,
    editingRow?.pettyCashCodeOrCashCode,
    editingRow?.description,
    editingRow?.accountLedgerId,
    editingRow?.custodianName,
    editingRow?.accountLedgerName,
    editingRow?.defaultStatus,
    loggedInAllocation?.userName,
    loggedInName,
  ])

  const columns = useMemo(
    () => [
      ...master.columns.map((column) => {
        if (column.id !== 'defaultStatus') {
          return column
        }
        return {
          ...column,
          sortable: false,
          headerClassName: '!text-center',
          cellClassName: '!text-center',
          cell: (row) => (
            <input
              type="checkbox"
              className={formCheckboxControlClass}
              checked={row.defaultStatus === 'Y'}
              onChange={() => {
                const action = row.defaultStatus === 'Y' ? 'unsetDefault' : 'setDefault'
                const runToggle = () => setup.handleToggleDefault(row)
                if (!requestConfirm) {
                  runToggle()
                  return
                }
                requestConfirm(runToggle, {
                  action,
                  recordLabel: setupRowDeleteDescription(row, master),
                })
              }}
              aria-label="Set as Default"
            />
          ),
        }
      }),
      {
        id: 'action',
        header: 'Action',
        sortable: false,
        cell: (row) => (
          <SetupActionCell
            row={row}
            master={master}
            onEdit={setup.openEdit}
            onRemove={setup.handleRemove}
            onToggleActive={setup.handleToggleActive}
            onSubmit={setup.handleSubmit}
          />
        ),
      },
    ],
    [master, requestConfirm, setup.openEdit, setup.handleRemove, setup.handleToggleActive, setup.handleSubmit, setup.handleToggleDefault],
  )

  const handleFieldChange = (name, value, values) => {
    // Ledger preview is derived from cash code. Do not bump parent state on description blur —
    // that re-render used to reset the form and discard the edited description.
    if (name !== 'pettyCashCodeOrCashCode') {
      return
    }
    setExternalValues((current) => ({
      ...current,
      accountLedgerName: buildCashLedgerName(value, values.description),
    }))
  }

  const handleSave = (values) => {
    const cashCode = String(values.pettyCashCodeOrCashCode || '').trim()
    return setup.handleSave({
      ...values,
      ...setupMutationIdFields(editingRow, setup.editingId),
      cashType: values.cashType || 'CASH',
      description: values.description != null ? String(values.description).trim() : null,
      pettyCashCodeOrCashCode: cashCode || null,
      custodianId: null,
      seatUserAllotId: null,
      userBean: null,
      custodianName: loggedInAllocation?.userName || loggedInName || values.custodianName || null,
      accountLedgerId: toNumericId(editingRow?.accountLedgerId) || toNumericId(values.accountLedgerId),
      accountLedgerName: values.accountLedgerName || buildCashLedgerName(cashCode, values.description),
      defaultStatus: values.defaultStatus === true || values.defaultStatus === 'Y' ? 'Y' : 'N',
    })
  }

  return (
    <>
      <SetupListPageHeaderActions onAdd={setup.openCreate} />
      <SetupListScreen
        formOpen={setup.formOpen}
        onCloseForm={setup.closeForm}
        modalTitle={setupFormModalTitle(master, setup.editingId)}
        modalSize="4xl"
        form={
          isSetupEditFormLoading({
            editingId: setup.editingId,
            isFetching: isEditingRecordLoading,
            data: editingRecord,
            error: editingRecordError,
          }) ? (
            <SetupEditFormSkeleton sections={[{ fields: 6, cols: 2 }]} />
          ) : (
            <SetupForm
              key={setup.editingId || 'cash-setup-new'}
              master={master}
              initialValues={formValues}
              fieldErrors={setup.fieldErrors}
              formError={setup.formError}
              externalValues={externalValues}
              onFieldChange={handleFieldChange}
              onSubmit={handleSave}
              onCancel={setup.closeForm}
              submitLabel={setupFormSubmitLabel(master, setup.editingId)}
            />
          )
        }
        list={
          <>
            <SetupLoadErrorAlert error={setup.loadError} />

            <SetupDataTable
              columns={columns}
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
    </>
  )
}
