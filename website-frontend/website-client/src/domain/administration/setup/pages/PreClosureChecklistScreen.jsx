import { useMemo, useState } from 'react'
import DashboardPageHeaderActions from '@/app/shell/components/DashboardPageHeaderActions'
import { GIGW_ADD_ICON, GigwButton } from '@/shared/components/buttons/gigw'
import { FormLabel, inputControlClass } from '@/shared/components/forms'
import { TABLE_ACTION_COLUMN_CLASS } from '@/shared/components/listing/listingTableStyles'
import AuditClosureDataTable from '../components/AuditClosureDataTable'
import AuditClosureStatusBadge from '../components/AuditClosureStatusBadge'
import PreClosureTodoActionCell from '../components/PreClosureTodoActionCell'
import PreClosureTodoFormModal from '../components/PreClosureTodoFormModal'
import {
  AUDIT_CLOSURE_MONTHS,
  checklistPeriodLabel,
  currentFinancialYear,
  savePreClosureTodo,
  useAuditClosureData,
} from '../constants/auditClosureStore'

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

function todoStatus(todo) {
  return todo.complete ? 'Complete' : 'Not complete'
}

function activeStatus(todo) {
  return todo.active ? 'Active' : 'Inactive'
}

export default function PreClosureChecklistScreen({ period = 'yearly' }) {
  const { years, todos } = useAuditClosureData()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const currentYear = currentFinancialYear()
  const [selectedYear, setSelectedYear] = useState(currentYear?.label ?? '')
  const [selectedMonth, setSelectedMonth] = useState('April')
  const yearOptions = useMemo(
    () => [...years]
      .sort((left, right) => {
        if (left.current !== right.current) {
          return left.current ? -1 : 1
        }
        const leftTime = left.fromDate instanceof Date ? left.fromDate.getTime() : 0
        const rightTime = right.fromDate instanceof Date ? right.fromDate.getTime() : 0
        return rightTime - leftTime
      })
      .map((year) => ({ value: year.label, label: year.label })),
    [years],
  )
  const rows = todos.filter((todo) => {
    if ((todo.period || 'yearly') !== period) {
      return false
    }
    if (selectedYear && todo.financialYearLabel !== selectedYear) {
      return false
    }
    if (period === 'monthly' && selectedMonth && todo.month !== selectedMonth) {
      return false
    }
    return true
  })

  const columns = [
    { id: 'title', header: 'Todo', accessor: 'title' },
    { id: 'financialYearLabel', header: 'Financial Year', accessor: 'financialYearLabel' },
    ...(period === 'monthly'
      ? [{ id: 'month', header: 'Month', accessor: (row) => row.month || '—' }]
      : []),
    {
      id: 'status',
      header: 'Status',
      cell: (row) => <AuditClosureStatusBadge status={todoStatus(row)} />,
    },
    {
      id: 'active',
      header: 'Active Status',
      cell: (row) => <AuditClosureStatusBadge status={activeStatus(row)} />,
    },
    {
      id: 'action',
      header: 'Action',
      headerClassName: TABLE_ACTION_COLUMN_CLASS,
      cellClassName: TABLE_ACTION_COLUMN_CLASS,
      cell: (row) => (
        <PreClosureTodoActionCell
          row={row}
          onEdit={(todo) => {
            setEditing(todo)
            setOpen(true)
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
            id={`${period}-checklist-year`}
            label="Financial Year"
            value={selectedYear}
            options={yearOptions}
            widthClass="!w-[7.5rem] !max-w-[7.5rem]"
            onChange={setSelectedYear}
          />
          {period === 'monthly' ? (
            <HeaderSelect
              id="monthly-checklist-month"
              label="Month"
              value={selectedMonth}
              options={AUDIT_CLOSURE_MONTHS}
              widthClass="!w-[9.5rem] !max-w-[9.5rem]"
              onChange={setSelectedMonth}
            />
          ) : null}
          <GigwButton
            type="button"
            variant="primary"
            icon={GIGW_ADD_ICON}
            onClick={() => {
              setEditing(null)
              setOpen(true)
            }}
          >
            {period === 'monthly' ? 'Add Monthly Todo' : 'Add Yearly Todo'}
          </GigwButton>
        </div>
      </DashboardPageHeaderActions>
      <AuditClosureDataTable
        columns={columns}
        rows={rows}
        searchText={(row) => [
          row.title,
          row.financialYearLabel,
          checklistPeriodLabel(row),
          todoStatus(row),
          activeStatus(row),
        ].join(' ')}
      />
      <PreClosureTodoFormModal
        open={open}
        editing={editing}
        period={period}
        yearOptions={yearOptions}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onClose={() => {
          setOpen(false)
          setEditing(null)
        }}
        onSave={savePreClosureTodo}
      />
    </>
  )
}
