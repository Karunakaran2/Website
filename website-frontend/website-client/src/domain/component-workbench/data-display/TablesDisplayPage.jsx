import { useState, useMemo, useCallback } from 'react'
import DataTable from '@/shared/components/DataTable'
import StatusChip from '@/shared/components/status/StatusChip'
import ActionButton from '@/shared/components/buttons/ActionButton'
import { TableRowActionsGroup } from '@/shared/components/buttons'
import { TABLE_ACTION_COLUMN_CLASS } from '@/shared/components/listing/listingTableStyles'
import { SelectField } from '@/shared/components/forms'
import { buildAssetTableRowActions } from '@/domain/component-workbench/utils/buildAssetTableRowActions'

const MOCK_RECORDS = [
  { id: 'AST-2026-001', name: 'Server Infrastructure Cluster A', category: 'IT Assets', location: 'TVM Data Center', amount: '₹14,50,000', status: 'Approved', custodian: 'Director of IT' },
  { id: 'AST-2026-002', name: 'High-Speed Scanner Station', category: 'Office Equipment', location: 'Kochi Regional Desk', amount: '₹1,25,000', status: 'Active', custodian: 'Chief Registrar' },
  { id: 'AST-2026-003', name: 'Biometric Attendance Terminals', category: 'Security Hardware', location: 'Secretariat Gate 1-4', amount: '₹3,80,000', status: 'Pending', custodian: 'Administration Officer' },
  { id: 'AST-2026-004', name: 'Department Utility EV Vans', category: 'Vehicles', location: 'State Pool Transport', amount: '₹22,00,000', status: 'Approved', custodian: 'Fleet Supervisor' },
  { id: 'AST-2026-005', name: 'Core Firewall Appliance', category: 'IT Assets', location: 'TVM Data Center', amount: '₹6,40,000', status: 'Verified', custodian: 'Cybersecurity Cell' },
  { id: 'AST-2026-006', name: 'Modular Workstation Units (Batch 3)', category: 'Furniture', location: 'Accounts Branch 2nd Floor', amount: '₹8,90,000', status: 'In Progress', custodian: 'Estate Officer' },
  { id: 'AST-2026-007', name: 'Solar Rooftop Inverter Set', category: 'Electrical Equipment', location: 'Annex Building Roof', amount: '₹11,20,000', status: 'Approved', custodian: 'Executive Engineer' },
  { id: 'AST-2026-008', name: 'Heavy-Duty Paper Shredder', category: 'Office Equipment', location: 'Confidential Records Wing', amount: '₹85,000', status: 'Draft', custodian: 'Record Keeper' },
  { id: 'AST-2026-009', name: 'Enterprise SAN Storage Expansion', category: 'IT Assets', location: 'Kozhikode DR Site', amount: '₹18,60,000', status: 'Pending', custodian: 'Director of IT' },
  { id: 'AST-2026-010', name: 'HVAC Air Handling Unit 4', category: 'Plant & Machinery', location: 'Main Secretariat Block', amount: '₹9,40,000', status: 'Active', custodian: 'Estate Officer' },
]

export default function TablesDisplayPage() {
  const [records, setRecords] = useState(MOCK_RECORDS)
  const [lastAction, setLastAction] = useState(null)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [sort, setSort] = useState({ sortBy: 'id', sortDir: 'asc' })

  const handleAction = useCallback((actionName, record) => {
    setLastAction({
      actionName,
      id: record.id,
      name: record.name,
      timestamp: new Date().toLocaleTimeString(),
    })
    if (actionName === 'Delete') {
      setRecords((prev) => prev.filter((r) => r.id !== record.id))
    }
  }, [])

  const columns = useMemo(
    () => [
      {
        id: 'id',
        header: 'Asset Code',
        accessor: 'id',
        sortable: true,
        pinned: true,
        minWidth: 140,
        cell: (row) => (
          <span className="font-mono font-semibold text-[#01458e]">{row.id}</span>
        ),
      },
      {
        id: 'name',
        header: 'Asset Description',
        accessor: 'name',
        sortable: true,
        minWidth: 240,
        cell: (row) => (
          <div>
            <span className="font-semibold text-slate-900">{row.name}</span>
            <span className="block text-[11px] text-slate-500">{row.location}</span>
          </div>
        ),
      },
      {
        id: 'category',
        header: 'Category',
        accessor: 'category',
        sortable: true,
        minWidth: 150,
        cell: (row) => <span className="text-slate-700">{row.category}</span>,
      },
      {
        id: 'amount',
        header: 'Book Value',
        accessor: 'amount',
        sortable: true,
        align: 'right',
        minWidth: 130,
        cell: (row) => (
          <span className="font-mono font-medium text-slate-800">{row.amount}</span>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        accessor: 'status',
        sortable: true,
        align: 'center',
        minWidth: 120,
        cell: (row) => <StatusChip label={row.status} />,
      },
      {
        id: 'custodian',
        header: 'Custodian',
        accessor: 'custodian',
        sortable: true,
        minWidth: 160,
        cell: (row) => <span className="text-slate-600">{row.custodian}</span>,
      },
      {
        id: 'actions',
        header: 'Action',
        minWidth: 140,
        align: 'center',
        headerClassName: TABLE_ACTION_COLUMN_CLASS,
        cellClassName: TABLE_ACTION_COLUMN_CLASS,
        cell: (row) => {
          const items = buildAssetTableRowActions(row, handleAction)
          if (items.length === 0) {
            return <span className="text-xs text-slate-400">—</span>
          }
          return <TableRowActionsGroup items={items} />
        },
      },
    ],
    [handleAction],
  )

  const filteredRecords = useMemo(() => {
    let result = records.filter((r) => {
      const matchSearch =
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase()) ||
        r.custodian.toLowerCase().includes(search.toLowerCase()) ||
        r.location.toLowerCase().includes(search.toLowerCase())
      const matchCat = filterCategory === 'All' || r.category === filterCategory
      return matchSearch && matchCat
    })

    if (sort.sortBy) {
      result.sort((a, b) => {
        const valA = a[sort.sortBy] || ''
        const valB = b[sort.sortBy] || ''
        return sort.sortDir === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA))
      })
    }

    return result
  }, [records, search, filterCategory, sort])

  const paginatedRecords = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredRecords.slice(start, start + pageSize)
  }, [filteredRecords, page, pageSize])

  const toolbarExtra = (
    <div className="flex items-center gap-2">
      <SelectField
        label="Category"
        id="asset-category-filter"
        value={filterCategory}
        onChange={(event) => {
          setFilterCategory(event.target.value)
          setPage(1)
        }}
        wrapperClassName="mb-0 min-w-[10rem] [&_label]:sr-only"
        className="h-9 text-xs"
        options={[
          { value: 'All', label: 'All Categories' },
          { value: 'IT Assets', label: 'IT Assets' },
          { value: 'Office Equipment', label: 'Office Equipment' },
          { value: 'Vehicles', label: 'Vehicles' },
          { value: 'Furniture', label: 'Furniture' },
          { value: 'Electrical Equipment', label: 'Electrical Equipment' },
          { value: 'Plant & Machinery', label: 'Plant & Machinery' },
        ]}
      />

      <ActionButton
        type="button"
        variant="excel"
        className="text-xs"
        onClick={() => setLastAction({ actionName: 'Export XLS', id: 'ALL', name: 'Asset Register', timestamp: new Date().toLocaleTimeString() })}
      >
        Export
      </ActionButton>
    </div>
  )

  return (
    <div className="space-y-6 pb-12 w-full">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900">Standard DataTable Component</h2>
          <p className="mt-1 text-xs text-slate-500">
            Enterprise-grade DataTable with sorting, search, pagination, and status-based row actions (≤2 inline icons; additional actions in the ⋮ menu).
          </p>
        </div>

        {lastAction && (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50/70 px-4 py-2.5 text-xs text-[#01458e]">
            <span>
              Triggered <strong>{lastAction.actionName}</strong> on <strong>{lastAction.id}</strong> ({lastAction.name}) at {lastAction.timestamp}
            </span>
            <button
              type="button"
              onClick={() => setLastAction(null)}
              className="text-xs font-semibold underline hover:text-[#003366]"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="overflow-hidden">
          <DataTable
            columns={columns}
            rows={paginatedRecords}
            rowKey="id"
            search={search}
            onSearchChange={(v) => {
              setSearch(v)
              setPage(1)
            }}
            page={page}
            pageSize={pageSize}
            total={filteredRecords.length}
            onPageChange={setPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize)
              setPage(1)
            }}
            pageSizeOptions={[5, 10, 20]}
            sort={sort}
            onSortChange={setSort}
            toolbarExtra={toolbarExtra}
            emptyMessage="No asset records match the search filter."
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <span className="text-xs text-slate-500">
            Total active records: <strong>{records.length}</strong> (Filtered: {filteredRecords.length})
          </span>
          {records.length < MOCK_RECORDS.length && (
            <ActionButton
              type="button"
              variant="reset"
              onClick={() => {
                setRecords(MOCK_RECORDS)
                setPage(1)
              }}
            >
              Reset Mock Dataset
            </ActionButton>
          )}
        </div>
      </div>
    </div>
  )
}
