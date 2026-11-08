import { useMemo, useState } from 'react'
import DashboardPageHeaderActions from '@/app/shell/components/DashboardPageHeaderActions'
import { FormLabel, inputControlClass } from '@/shared/components/forms'
import AuditClosureDataTable from '../components/AuditClosureDataTable'
import AuditClosureStatusBadge from '../components/AuditClosureStatusBadge'
import {
  AUDIT_CLOSURE_MONTHS,
  checklistPeriodLabel,
  currentFinancialYear,
  useAuditClosureData,
} from '../constants/auditClosureStore'

const ALL_OPTION = { value: 'all', label: 'All' }

const headerSelectClass = `${inputControlClass} !mt-0 !h-[36px] !min-h-[36px] !max-h-[36px] shrink-0 py-1 text-[13px]`

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
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function AuditClosureListScreen() {
  const { years, todos } = useAuditClosureData()
  const currentYear = currentFinancialYear()
  const [selectedYear, setSelectedYear] = useState(currentYear?.label || 'all')
  const [selectedMonth, setSelectedMonth] = useState('all')
  const yearOptions = useMemo(
    () => [
      ALL_OPTION,
      ...[...years]
        .sort((left, right) => {
          if (left.current !== right.current) {
            return left.current ? -1 : 1
          }
          const leftTime = left.fromDate instanceof Date ? left.fromDate.getTime() : 0
          const rightTime = right.fromDate instanceof Date ? right.fromDate.getTime() : 0
          return rightTime - leftTime
        })
        .map((year) => ({ value: year.label, label: year.label })),
    ],
    [years],
  )
  const monthOptions = useMemo(
    () => [ALL_OPTION, ...AUDIT_CLOSURE_MONTHS],
    [],
  )
  const closedTodos = todos.filter((todo) => {
    if (!todo.finalized) {
      return false
    }
    if (selectedYear !== 'all' && todo.financialYearLabel !== selectedYear) {
      return false
    }
    if (selectedMonth !== 'all' && todo.month !== selectedMonth) {
      return false
    }
    return true
  })

  const columns = [
    { id: 'title', header: 'Todo', accessor: 'title' },
    { id: 'financialYearLabel', header: 'Financial Year', accessor: 'financialYearLabel' },
    { id: 'period', header: 'Checklist', accessor: checklistPeriodLabel },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => (
        <AuditClosureStatusBadge status={row.complete ? 'Complete' : 'Not complete'} />
      ),
    },
    {
      id: 'active',
      header: 'Active Status',
      cell: (row) => (
        <AuditClosureStatusBadge status={row.active ? 'Active' : 'Inactive'} />
      ),
    },
  ]

  return (
    <>
      <DashboardPageHeaderActions>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <HeaderSelect
            id="audit-closure-list-year"
            label="Financial Year"
            value={selectedYear}
            options={yearOptions}
            widthClass="!w-[7.5rem] !max-w-[7.5rem]"
            onChange={setSelectedYear}
          />
          <HeaderSelect
            id="audit-closure-list-month"
            label="Month"
            value={selectedMonth}
            options={monthOptions}
            widthClass="!w-[9.5rem] !max-w-[9.5rem]"
            onChange={setSelectedMonth}
          />
        </div>
      </DashboardPageHeaderActions>
      <AuditClosureDataTable
        columns={columns}
        rows={closedTodos}
        searchText={(row) => [
          row.title,
          row.financialYearLabel,
          checklistPeriodLabel(row),
          row.complete ? 'Complete' : 'Not complete',
          row.active ? 'Active' : 'Inactive',
        ].join(' ')}
      />
    </>
  )
}
