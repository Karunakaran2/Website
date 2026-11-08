import { useMemo, useState } from 'react'
import DashboardPageHeaderActions from '@/app/shell/components/DashboardPageHeaderActions'
import { GigwButton } from '@/shared/components/buttons/gigw'
import { confirmBeforeAction, confirmedActionFailure, useActionConfirm } from '@/shared/components/confirm'
import { FormLabel, inputControlClass } from '@/shared/components/forms'
import { parseDisplayDate } from '@/shared/utils/probityFormat'
import AuditClosureDataTable from '../components/AuditClosureDataTable'
import SaveChecklistFormModal from '../components/SaveChecklistFormModal'
import {
  useCompleteFinancialYearClosureMutation,
  useGetFinancialYearClosureListQuery,
  useGetFinancialYearMonthListQuery,
  useGetFinancialYearSetupListQuery,
  useSaveFinancialYearClosureMutation,
} from '../services/setupApi'

const headerSelectClass = `${inputControlClass} !mt-0 !h-[36px] !min-h-[36px] !max-h-[36px] shrink-0 py-1 text-[13px]`

const FREQUENCY_OPTIONS = [
  { value: '', label: 'Select' },
  { value: 'Y', label: 'Yearly' },
  { value: 'M', label: 'Monthly' },
]

function HeaderSelect({ id, label, value, options, onChange, widthClass }) {
  return (
    <div className="flex flex-nowrap items-center gap-2">
      <FormLabel
        label={label}
        htmlFor={id}
        className="!mb-0 !inline-block !w-auto shrink-0 whitespace-nowrap"
      />
      <select
        id={id}
        name={id}
        aria-label={label}
        className={`${headerSelectClass} ${widthClass}`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value || 'blank'} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

function yearRangeLabel(financialYear) {
  const fromDate = parseDisplayDate(financialYear.fromDate)
  const toDate = parseDisplayDate(financialYear.toDate)
  if (!(fromDate instanceof Date) || !(toDate instanceof Date)) {
    return ''
  }
  return `${fromDate.getFullYear()}-${toDate.getFullYear()}`
}

function isCompleted(completedStatus) {
  return String(completedStatus || '').trim() === 'Y'
}

function YearlyChecklistStatusCell({ row, onComplete, frozen }) {
  const requestConfirm = useActionConfirm()
  if (row.completed) {
    return <span>Completed</span>
  }
  if (frozen) {
    return <span>Not complete</span>
  }
  return (
    <GigwButton
      type="button"
      variant="outlineSuccess"
      size="sm"
      onClick={() => confirmBeforeAction(requestConfirm, {
        action: 'submit',
        submitLabel: 'Complete',
        recordLabel: row.title,
        message: 'Do you want to mark this checklist as complete?',
        successMessage: 'Checklist marked as completed.',
        stack: 'base',
        runAction: () => onComplete(row),
      })}
    >
      Complete
    </GigwButton>
  )
}

export default function YearlyChecklistScreen() {
  const yearQuery = useGetFinancialYearSetupListQuery()
  const [saveFinancialYearClosure] = useSaveFinancialYearClosureMutation()
  const [completeFinancialYearClosure] = useCompleteFinancialYearClosureMutation()
  const [open, setOpen] = useState(false)
  const [financialYearId, setFinancialYearId] = useState('')
  const [frequency, setFrequency] = useState('')
  const [financialYearMonthId, setFinancialYearMonthId] = useState('')
  const years = useMemo(() => {
    const rows = Array.isArray(yearQuery.data) ? yearQuery.data : []
    return rows
      .filter((year) => year.isDeleted !== true)
      .map((year) => ({
        value: year.idMask,
        label: yearRangeLabel(year),
      }))
      .filter((year) => year.value && year.label)
  }, [yearQuery.data])
  const selectedYear = years.find((year) => year.value === financialYearId)
  const monthQuery = useGetFinancialYearMonthListQuery(financialYearId, { skip: !financialYearId })
  const monthOptions = useMemo(() => {
    const list = Array.isArray(monthQuery.data) ? monthQuery.data : []
    return list.map((month) => ({
      value: month.idMask,
      label: `${month.monthName} ${month.monthYear}`,
      frozen: String(month.freezeStatus || '').trim() === 'Y',
    }))
  }, [monthQuery.data])
  const selectedMonth = monthOptions.find((month) => month.value === financialYearMonthId)
  const monthFrozen = frequency === 'M' && Boolean(selectedMonth?.frozen)
  const filtersReady = Boolean(financialYearId) && Boolean(frequency)
    && (frequency !== 'M' || Boolean(financialYearMonthId))
  const closureQuery = useGetFinancialYearClosureListQuery(
    { financialYearId, frequency, financialYearMonthId },
    { skip: !filtersReady },
  )
  const rows = useMemo(() => {
    const list = Array.isArray(closureQuery.data) ? closureQuery.data : []
    return list.map((row) => ({
      idMask: row.idMask,
      title: row.toDoList,
      financialYearLabel: selectedYear?.label || '',
      month: frequency === 'M' ? (selectedMonth?.label || row.month) : row.month,
      completed: isCompleted(row.completedStatus),
      status: isCompleted(row.completedStatus) ? 'Completed' : 'Complete',
    }))
  }, [closureQuery.data, selectedYear, frequency, selectedMonth])

  const columns = [
    { id: 'title', header: 'Todo', accessor: 'title' },
    { id: 'financialYearLabel', header: 'Financial Year', accessor: 'financialYearLabel' },
    ...(frequency === 'M'
      ? [{ id: 'month', header: 'Month', accessor: (row) => row.month || '—' }]
      : []),
    {
      id: 'status',
      header: 'Status',
      cell: (row) => (
        <YearlyChecklistStatusCell
          row={row}
          frozen={monthFrozen}
          onComplete={async (checklist) => {
            const result = await completeFinancialYearClosure(checklist.idMask)
            if (result.error) {
              return confirmedActionFailure(
                result.error.payload?.message || result.error.data || 'Unable to complete the checklist.',
              )
            }
            return true
          }}
        />
      ),
    },
  ]

  return (
    <>
      <DashboardPageHeaderActions>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <HeaderSelect
            id="yearly-checklist-year"
            label="Financial Year"
            value={financialYearId}
            options={[{ value: '', label: 'Select' }, ...years]}
            widthClass="!w-[9.5rem] !max-w-[9.5rem]"
            onChange={(value) => {
              setFinancialYearId(value)
              setFinancialYearMonthId('')
            }}
          />
          <HeaderSelect
            id="yearly-checklist-frequency"
            label="Frequency"
            value={frequency}
            options={FREQUENCY_OPTIONS}
            widthClass="!w-[8.5rem] !max-w-[8.5rem]"
            onChange={setFrequency}
          />
          {frequency === 'M' ? (
            <HeaderSelect
              id="yearly-checklist-month"
              label="Month"
              value={financialYearMonthId}
              options={[{ value: '', label: 'Select' }, ...monthOptions]}
              widthClass="!w-[11.5rem] !max-w-[11.5rem]"
              onChange={setFinancialYearMonthId}
            />
          ) : null}
          <GigwButton
            type="button"
            variant="primary"
            disabled={!filtersReady}
            onClick={() => {
              if (filtersReady) {
                closureQuery.refetch()
              }
            }}
          >
            Generate
          </GigwButton>
          {monthFrozen ? null : (
            <GigwButton
              type="button"
              variant="primary"
              onClick={() => setOpen(true)}
            >
              Save Checklist
            </GigwButton>
          )}
        </div>
      </DashboardPageHeaderActions>
      <AuditClosureDataTable
        columns={columns}
        rows={filtersReady ? rows : []}
        searchText={(row) => [row.title, row.financialYearLabel, row.month, row.status].filter(Boolean).join(' ')}
      />
      <SaveChecklistFormModal
        open={open}
        yearOptions={years}
        financialYearId={financialYearId}
        frequency={frequency}
        month={financialYearMonthId}
        onClose={() => setOpen(false)}
        onSave={async (values) => {
          const result = await saveFinancialYearClosure(values)
          if (result.error) {
            const fieldErrors = result.error.payload?.data
            return {
              fieldErrors: fieldErrors && typeof fieldErrors === 'object' && !Array.isArray(fieldErrors)
                ? fieldErrors
                : {},
              message: result.error.payload?.message || result.error.data,
            }
          }
          setFinancialYearId(values.financialYearId)
          setFrequency(values.frequency)
          if (values.frequency === 'M' && values.financialYearMonthId) {
            setFinancialYearMonthId(values.financialYearMonthId)
          }
          return null
        }}
      />
    </>
  )
}
