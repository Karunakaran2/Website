import { useMemo, useState } from 'react'
import DashboardPageHeaderActions from '@/app/shell/components/DashboardPageHeaderActions'
import { GigwButton } from '@/shared/components/buttons/gigw'
import { confirmBeforeAction, confirmedActionFailure, useActionConfirm } from '@/shared/components/confirm'
import { FormLabel, inputControlClass } from '@/shared/components/forms'
import { formatDisplayDate, parseDisplayDate } from '@/shared/utils/probityFormat'
import AuditClosureDataTable from '../components/AuditClosureDataTable'
import {
  useFreezeFinancialYearMonthMutation,
  useGetFinancialYearMonthListQuery,
  useGetFinancialYearSetupListQuery,
} from '../services/setupApi'

const headerSelectClass = `${inputControlClass} !mt-0 !h-[36px] !min-h-[36px] !max-h-[36px] shrink-0 py-1 text-[13px]`

function yearRangeLabel(financialYear) {
  const fromDate = parseDisplayDate(financialYear.fromDate)
  const toDate = parseDisplayDate(financialYear.toDate)
  if (!(fromDate instanceof Date) || !(toDate instanceof Date)) {
    return ''
  }
  return `${fromDate.getFullYear()}-${toDate.getFullYear()}`
}

function isFrozen(freezeStatus) {
  return String(freezeStatus || '').trim() === 'Y'
}

function MonthFreezeCell({ row, onFreeze }) {
  const requestConfirm = useActionConfirm()
  if (row.frozen) {
    return <span>FREEZED</span>
  }
  return (
    <GigwButton
      type="button"
      variant="outlineSuccess"
      size="sm"
      onClick={() => confirmBeforeAction(requestConfirm, {
        action: 'submit',
        submitLabel: 'Freeze',
        recordLabel: row.label,
        message: 'Do you want to freeze this month?',
        successMessage: 'Frozen successfully.',
        stack: 'base',
        runAction: () => onFreeze(row),
      })}
    >
      Freeze
    </GigwButton>
  )
}

export default function MonthClosureScreen() {
  const yearQuery = useGetFinancialYearSetupListQuery()
  const [freezeFinancialYearMonth] = useFreezeFinancialYearMonthMutation()
  const [financialYearId, setFinancialYearId] = useState('')
  const years = useMemo(() => {
    const rows = Array.isArray(yearQuery.data) ? yearQuery.data : []
    return rows
      .filter((year) => year.isDeleted !== true)
      .map((year) => ({ value: year.idMask, label: yearRangeLabel(year) }))
      .filter((year) => year.value && year.label)
  }, [yearQuery.data])
  const monthQuery = useGetFinancialYearMonthListQuery(financialYearId, { skip: !financialYearId })
  const rows = useMemo(() => {
    const list = Array.isArray(monthQuery.data) ? monthQuery.data : []
    return list.map((month) => ({
      idMask: month.idMask,
      label: `${month.monthName} ${month.monthYear}`,
      fromDate: formatDisplayDate(month.fromDate),
      toDate: formatDisplayDate(month.toDate),
      frozen: isFrozen(month.freezeStatus),
      freezeStatusLabel: isFrozen(month.freezeStatus) ? 'FREEZED' : 'NOT FREEZED',
    }))
  }, [monthQuery.data])

  const columns = [
    { id: 'label', header: 'Month', accessor: 'label' },
    { id: 'fromDate', header: 'From Date', accessor: 'fromDate' },
    { id: 'toDate', header: 'To Date', accessor: 'toDate' },
    { id: 'freezeStatus', header: 'Freeze Status', accessor: 'freezeStatusLabel' },
    {
      id: 'action',
      header: 'Action',
      cell: (row) => (
        <MonthFreezeCell
          row={row}
          onFreeze={async (month) => {
            const result = await freezeFinancialYearMonth(month.idMask)
            if (result.error) {
              return confirmedActionFailure(
                result.error.payload?.message || result.error.data || 'Complete all checklist items for this month before freezing.',
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
          <div className="flex flex-nowrap items-center gap-2">
            <FormLabel
              label="Financial Year"
              htmlFor="month-closure-year"
              className="!mb-0 !inline-block !w-auto shrink-0 whitespace-nowrap"
            />
            <select
              id="month-closure-year"
              name="month-closure-year"
              aria-label="Financial Year"
              className={`${headerSelectClass} !w-[9.5rem] !max-w-[9.5rem]`}
              value={financialYearId}
              onChange={(event) => setFinancialYearId(event.target.value)}
            >
              <option value="">Select</option>
              {years.map((year) => (
                <option key={year.value} value={year.value}>
                  {year.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </DashboardPageHeaderActions>
      <AuditClosureDataTable
        columns={columns}
        rows={financialYearId ? rows : []}
        searchText={(row) => [row.label, row.fromDate, row.toDate, row.freezeStatusLabel].join(' ')}
      />
    </>
  )
}
