import { useMemo, useState } from 'react'
import { DomainListPageHeaderActions } from '@/shared/components/domain'
import { TABLE_ACTION_COLUMN_CLASS } from '@/shared/components/listing/listingTableStyles'
import { toNativeDateInputValue } from '@/shared/components/forms/OrgDateField'
import { formatDisplayDate, parseDisplayDate } from '@/shared/utils/probityFormat'
import AuditClosureDataTable from '../components/AuditClosureDataTable'
import AuditClosureStatusBadge from '../components/AuditClosureStatusBadge'
import FinancialYearActionCell from '../components/FinancialYearActionCell'
import FinancialYearFormModal from '../components/FinancialYearFormModal'
import SetupLoadErrorAlert from '../components/SetupLoadErrorAlert'
import { financialYearLabel } from '../constants/auditClosureStore'
import { confirmedActionFailure } from '@/shared/components/confirm'
import {
  useActivateFinancialYearSetupMutation,
  useDeactivateFinancialYearSetupMutation,
  useFreezeFinancialYearSetupMutation,
  useGetFinancialYearSetupListQuery,
  useSaveFinancialYearSetupMutation,
  useUpdateFinancialYearSetupMutation,
} from '../services/setupApi'

function freezeStatusLabel(freezeStatus) {
  return String(freezeStatus || '').trim() === 'Y' ? 'FREEZED' : 'NOT FREEZED'
}

function toYearRow(financialYear) {
  const fromDate = parseDisplayDate(financialYear.fromDate)
  const toDate = parseDisplayDate(financialYear.toDate)
  return {
    idMask: financialYear.idMask,
    fromDate,
    toDate,
    label: financialYearLabel(fromDate, toDate),
    isDeleted: financialYear.isDeleted === true,
    active: financialYear.isDeleted !== true,
    frozen: String(financialYear.freezeStatus || '').trim() === 'Y',
    freezeStatusLabel: freezeStatusLabel(financialYear.freezeStatus),
  }
}

export default function AuditClosureFinancialYearScreen() {
  const query = useGetFinancialYearSetupListQuery()
  const [saveFinancialYearSetup] = useSaveFinancialYearSetupMutation()
  const [updateFinancialYearSetup] = useUpdateFinancialYearSetupMutation()
  const [activateFinancialYearSetup] = useActivateFinancialYearSetupMutation()
  const [deactivateFinancialYearSetup] = useDeactivateFinancialYearSetupMutation()
  const [freezeFinancialYearSetup] = useFreezeFinancialYearSetupMutation()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const rows = useMemo(() => {
    const years = Array.isArray(query.data) ? query.data.map(toYearRow) : []
    return years.sort((left, right) => {
      if (left.active !== right.active) {
        return left.active ? -1 : 1
      }
      const leftTime = left.fromDate instanceof Date ? left.fromDate.getTime() : 0
      const rightTime = right.fromDate instanceof Date ? right.fromDate.getTime() : 0
      return rightTime - leftTime
    })
  }, [query.data])

  const columns = [
    { id: 'label', header: 'Financial Year', accessor: 'label' },
    {
      id: 'fromDate',
      header: 'From Date',
      accessor: (row) => formatDisplayDate(row.fromDate),
    },
    {
      id: 'toDate',
      header: 'To Date',
      accessor: (row) => formatDisplayDate(row.toDate),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => (
        <span className="inline-flex flex-wrap items-center justify-center gap-1">
          <AuditClosureStatusBadge status={row.active ? 'Active' : 'Inactive'} />
          {row.frozen ? <AuditClosureStatusBadge status="Frozen" /> : null}
        </span>
      ),
    },
    {
      id: 'freezeStatus',
      header: 'Freeze Status',
      accessor: 'freezeStatusLabel',
    },
    {
      id: 'action',
      header: 'Action',
      headerClassName: TABLE_ACTION_COLUMN_CLASS,
      cellClassName: TABLE_ACTION_COLUMN_CLASS,
      cell: (row) => (
        <FinancialYearActionCell
          row={row}
          years={rows}
          onActivate={async (year) => {
            const result = await activateFinancialYearSetup(year.idMask)
            return !result.error
          }}
          onDeactivate={async (year) => {
            const result = await deactivateFinancialYearSetup(year.idMask)
            return !result.error
          }}
          onFreeze={async (year) => {
            const result = await freezeFinancialYearSetup(year.idMask)
            if (result.error) {
              return confirmedActionFailure(
                result.error.payload?.message || result.error.data || 'Complete all checklist items and freeze all months before freezing the financial year.',
              )
            }
            return true
          }}
          onEdit={(year) => {
            setEditing(year)
            setOpen(true)
          }}
        />
      ),
    },
  ]

  const persistFinancialYear = async (values) => {
    const body = {
      fromDate: toNativeDateInputValue(values.fromDate),
      toDate: toNativeDateInputValue(values.toDate),
    }
    const result = values.idMask
      ? await updateFinancialYearSetup({ idMask: values.idMask, ...body })
      : await saveFinancialYearSetup(body)
    if (!result.error) {
      return null
    }
    const fieldErrors = result.error.payload?.data
    return {
      fieldErrors: fieldErrors && typeof fieldErrors === 'object' && !Array.isArray(fieldErrors)
        ? fieldErrors
        : {},
      message: result.error.payload?.message || result.error.data,
    }
  }

  return (
    <>
      <DomainListPageHeaderActions
        label="Financial Year"
        onAdd={() => {
          setEditing(null)
          setOpen(true)
        }}
      />
      <SetupLoadErrorAlert error={query.isError ? 'Unable to load financial years.' : null} />
      <AuditClosureDataTable
        columns={columns}
        rows={rows}
        searchText={(row) => [
          row.label,
          formatDisplayDate(row.fromDate),
          formatDisplayDate(row.toDate),
          row.active ? 'Active' : 'Inactive',
          row.freezeStatusLabel,
          row.frozen ? 'Frozen' : '',
        ].join(' ')}
      />
      <FinancialYearFormModal
        open={open}
        editing={editing}
        onClose={() => {
          setOpen(false)
          setEditing(null)
        }}
        onSave={persistFinancialYear}
      />
    </>
  )
}
