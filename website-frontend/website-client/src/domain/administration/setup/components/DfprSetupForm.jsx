import { useMemo, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { FeaturedBasicSelect } from '@/shared/lib/tailwreck'
import { GigwButton } from '@/shared/components/buttons/gigw'
import {
  FieldError,
  FieldGrid,
  FormLabel,
  IndianAmountField,
  ReadOnlyField,
  formCheckboxControlClass,
  formOptionLabelClass,
} from '@/shared/components/forms'
import {
  orgProbityControlSlotClass,
  orgProbitySelectInvalidClass,
  orgProbitySelectTriggerClass,
} from '@/shared/components/forms/tailwreckFormShell'
import { formatIndianAmountForInput, toApiAmount } from '@/shared/utils/probityFormat'
import { resolveSelectValue } from '@/shared/utils/resolveSelectValue'
import { extractSetupFieldErrors, formatSetupMutationError } from '../utils/setupApiError'
import SetupFormFooter from './SetupFormFooter'
import SetupFormShell from './SetupFormShell'

let rowKey = 0

function nextRowKey() {
  rowKey += 1
  return `dfpr-row-${rowKey}`
}

function emptyRow() {
  return {
    key: nextRowKey(),
    allotId: '',
    dsHierarchy: '',
    designationName: '',
    approval: false,
  }
}

function rowsFromGroup(group) {
  const lines = Array.isArray(group?.lines) ? group.lines : []
  if (!lines.length) {
    return [emptyRow()]
  }
  return numberRows(lines.map((line) => ({
    key: nextRowKey(),
    allotId: line?.allotId == null ? '' : String(line.allotId),
    dsHierarchy: '',
    designationName: line?.designationName || '',
    approval: line?.approvalStatus === true,
  })))
}

function numberRows(sourceRows) {
  let order = 0
  return sourceRows.map((row) => {
    if (!row.allotId) {
      return { ...row, dsHierarchy: '' }
    }
    order += 1
    return { ...row, dsHierarchy: String(order) }
  })
}

function rowComplete(row) {
  return Boolean(row.allotId)
    && String(row.dsHierarchy ?? '').trim() !== ''
    && String(row.designationName ?? '').trim() !== ''
}

export default function DfprSetupForm({
  group,
  seats,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
}) {
  const [fromAmount, setFromAmount] = useState(() => (
    group?.fromAmount == null ? '' : formatIndianAmountForInput(group.fromAmount)
  ))
  const [toAmount, setToAmount] = useState(() => (
    group?.toAmount == null ? '' : formatIndianAmountForInput(group.toAmount)
  ))
  const [rows, setRows] = useState(() => rowsFromGroup(group))
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const seatById = useMemo(() => {
    const lookup = new Map()
    for (const seat of Array.isArray(seats) ? seats : []) {
      if (seat?.id != null) {
        lookup.set(String(seat.id), seat)
      }
    }
    return lookup
  }, [seats])

  const lastRow = rows[rows.length - 1]
  const canAddRow = rowComplete(lastRow)

  const updateRow = (key, patch) => {
    setRows((current) => current.map((row) => (row.key === key ? { ...row, ...patch } : row)))
  }

  const selectUser = (key, allotId) => {
    const seat = seatById.get(String(allotId))
    setRows((current) => numberRows(current.map((row) => (
      row.key === key
        ? {
            ...row,
            allotId: allotId || '',
            designationName: allotId ? (seat?.designationName || '') : '',
          }
        : row
    ))))
  }

  const addRow = () => {
    if (!canAddRow) {
      return
    }
    setRows((current) => [...current, emptyRow()])
  }

  const removeRow = (key) => {
    setRows((current) => {
      const next = current.filter((row) => row.key !== key)
      return numberRows(next.length ? next : [emptyRow()])
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = {}
    const fromText = String(fromAmount ?? '').trim()
    const toText = String(toAmount ?? '').trim()
    const fromValue = fromText === '' ? null : toApiAmount(fromText)
    const toValue = toText === '' ? null : toApiAmount(toText)
    if (fromValue == null) {
      nextErrors.fromAmount = 'Please enter From Amount.'
    }
    if (toValue == null) {
      nextErrors.toAmount = 'Please enter To Amount.'
    } else if (fromValue != null && fromValue > toValue) {
      nextErrors.toAmount = 'From Amount must be less than or equal to To Amount.'
    }

    const filledRows = rows.filter((row) => row.allotId)
    if (!filledRows.length) {
      nextErrors.lines = 'Please select at least one allotted user.'
    } else if (filledRows.some((row) => !rowComplete(row))) {
      nextErrors.lines = 'Hierarchy and designation must be filled before saving.'
    }

    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors)
      setFormError(nextErrors.lines || 'Please complete the required fields.')
      return
    }

    setSaving(true)
    setFieldErrors({})
    setFormError('')
    const result = await onSubmit({
      fromAmount: fromValue,
      toAmount: toValue,
      replaceIds: Array.isArray(group?.replaceIds) ? group.replaceIds : [],
      lines: filledRows.map((row) => ({
        allotId: Number(row.allotId),
        approvalStatus: row.approval === true,
      })),
    })
    setSaving(false)
    if (result?.error) {
      const apiFieldErrors = extractSetupFieldErrors(result.error)
      setFieldErrors(apiFieldErrors)
      setFormError(formatSetupMutationError(result.error, 'Unable to save DFPR setup.'))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full min-w-0 flex-col gap-4" noValidate>
      <SetupFormShell formError={formError}>
        <FieldGrid cols={2}>
          <IndianAmountField
            label="From Amount"
            name="fromAmount"
            required
            emptyAsZero={false}
            value={fromAmount}
            error={fieldErrors.fromAmount}
            onChange={(event) => setFromAmount(event.target.value)}
          />
          <IndianAmountField
            label="To Amount"
            name="toAmount"
            required
            emptyAsZero={false}
            value={toAmount}
            error={fieldErrors.toAmount}
            onChange={(event) => setToAmount(event.target.value)}
          />
        </FieldGrid>

        <div className="mt-4 flex flex-col gap-4">
          {rows.map((row, index) => {
            const taken = new Set(
              rows.filter((other) => other.key !== row.key && other.allotId).map((other) => other.allotId),
            )
            const options = [
              { value: '', label: 'Select Allotted User' },
              ...(Array.isArray(seats) ? seats : [])
                .filter((seat) => seat?.id != null && !taken.has(String(seat.id)))
                .map((seat) => ({
                  value: String(seat.id),
                  label: seat.userName || seat.hierarchyName || String(seat.id),
                })),
            ]
            const isLast = index === rows.length - 1
            return (
              <div key={row.key} className="grid grid-cols-1 items-end gap-3 md:grid-cols-12">
                <div className="min-w-0 md:col-span-4">
                  <FormLabel label="Allotted User" required htmlFor={`dfpr-allot-${row.key}`} />
                  <div className={orgProbityControlSlotClass}>
                    <FeaturedBasicSelect
                      name={`allotId-${row.key}`}
                      options={options}
                      value={row.allotId}
                      onChange={(value) => selectUser(row.key, resolveSelectValue(value))}
                      size="md"
                      theme="primary"
                      border="sm"
                      className={`${orgProbitySelectTriggerClass} ${fieldErrors.allotId ? orgProbitySelectInvalidClass : ''}`.trim()}
                    />
                  </div>
                  <FieldError message={index === 0 ? fieldErrors.allotId || fieldErrors.lines : ''} />
                </div>
                <div className="min-w-0 md:col-span-3">
                  <ReadOnlyField label="Hierarchy" value={row.dsHierarchy} />
                  <FieldError message={index === 0 ? fieldErrors.dsHierarchy : ''} />
                </div>
                <div className="min-w-0 md:col-span-3">
                  <ReadOnlyField label="Designation" value={row.designationName} />
                  <FieldError message={index === 0 ? fieldErrors.designationName : ''} />
                </div>
                <div className="flex min-w-0 items-center gap-3 md:col-span-2 md:pb-1">
                  <label className={`${formOptionLabelClass} flex h-11 items-center gap-2`}>
                    <input
                      type="checkbox"
                      className={formCheckboxControlClass}
                    checked={row.approval}
                    onChange={(event) => updateRow(row.key, { approval: event.target.checked })}
                  />
                    Approval
                  </label>
                  {rows.length > 1 ? (
                    <button
                      type="button"
                      className="inline-flex h-11 w-11 items-center justify-center rounded border border-slate-300 text-slate-600 hover:bg-slate-50"
                      aria-label="Remove allotted user"
                      onClick={() => removeRow(row.key)}
                    >
                      <X size={16} aria-hidden />
                    </button>
                  ) : null}
                  {isLast ? (
                    <GigwButton
                      type="button"
                      variant="outlineUtility"
                      size="md"
                      icon={Plus}
                      className="h-11 shrink-0 px-3"
                      disabled={!canAddRow}
                      aria-label="Add allotted user"
                      onClick={addRow}
                    >
                      <span className="sr-only">Add allotted user</span>
                    </GigwButton>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </SetupFormShell>
      <SetupFormFooter
        onCancel={onCancel}
        submitLabel={submitLabel}
        submitLoading={saving}
      />
    </form>
  )
}
