import { useState, useMemo } from 'react'
import DataTable from '@/shared/components/DataTable'
import StatusChip from '@/shared/components/status/StatusChip'
import ActionButton from '@/shared/components/buttons/ActionButton'

const EXPLORER_RECORDS = [
  { id: 'DS-101', title: 'PrimaryButton Component', category: 'Actions', author: 'Design System Team', date: '2026-10-12', status: 'Approved' },
  { id: 'DS-102', title: 'Indian Currency Formatter', category: 'Forms', author: 'Finance Systems Lead', date: '2026-10-11', status: 'Approved' },
  { id: 'DS-103', title: 'DataTable Server Pagination', category: 'Data Display', author: 'Core Frontend', date: '2026-10-10', status: 'Pending' },
  { id: 'DS-104', title: 'PortalModal Focus Entrapment', category: 'Feedback', author: 'Accessibility Guild', date: '2026-10-09', status: 'Approved' },
  { id: 'DS-105', title: 'GIGW Text Scaling Verification', category: 'Accessibility', author: 'Compliance Lead', date: '2026-10-08', status: 'Forwarded' },
  { id: 'DS-106', title: 'Voucher Approval Workflow Shell', category: 'Workflow', author: 'Enterprise Architect', date: '2026-10-07', status: 'Approved' },
  { id: 'DS-107', title: 'Header Brand Title Stack', category: 'Navigation', author: 'Design System Team', date: '2026-10-06', status: 'Draft' },
]

export default function DataDisplayExplorerPage() {
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sort, setSort] = useState({ sortBy: 'id', sortDir: 'asc' })

  const columns = useMemo(
    () => [
      {
        id: 'id',
        header: 'Pattern ID',
        accessor: 'id',
        sortable: true,
        pinned: true,
        minWidth: 120,
        cell: (row) => (
          <span className="font-mono font-semibold text-[#01458e]">{row.id}</span>
        ),
      },
      {
        id: 'title',
        header: 'Pattern Title',
        accessor: 'title',
        sortable: true,
        minWidth: 220,
        cell: (row) => (
          <span className="font-medium text-slate-900">{row.title}</span>
        ),
      },
      {
        id: 'category',
        header: 'Category',
        accessor: 'category',
        sortable: true,
        minWidth: 140,
        cell: (row) => <span className="text-slate-600">{row.category}</span>,
      },
      {
        id: 'author',
        header: 'Author',
        accessor: 'author',
        sortable: true,
        minWidth: 160,
        cell: (row) => <span className="text-slate-500">{row.author}</span>,
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
    ],
    []
  )

  const filteredRecords = useMemo(() => {
    let result = EXPLORER_RECORDS.filter((r) => {
      const matchSearch =
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase()) ||
        r.author.toLowerCase().includes(search.toLowerCase())
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
  }, [search, filterCategory, sort])

  const paginatedRecords = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredRecords.slice(start, start + pageSize)
  }, [filteredRecords, page, pageSize])

  const toolbarExtra = (
    <div className="flex items-center gap-2">
      <select
        value={filterCategory}
        onChange={(e) => {
          setFilterCategory(e.target.value)
          setPage(1)
        }}
        className="h-9 rounded-md border border-slate-300 bg-white px-2.5 text-xs text-slate-700 focus:border-[#01458e] focus:outline-none"
        aria-label="Filter by Category"
      >
        <option value="All">All Categories</option>
        <option value="Actions">Actions</option>
        <option value="Forms">Forms</option>
        <option value="Data Display">Data Display</option>
        <option value="Feedback">Feedback</option>
        <option value="Accessibility">Accessibility</option>
      </select>

      <ActionButton
        type="button"
        variant="excel"
        className="text-xs"
        onClick={() => {}}
      >
        Export
      </ActionButton>
    </div>
  )

  return (
    <div className="space-y-6 pb-12">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Total Registered Patterns</span>
          <div className="mt-1 text-2xl font-bold text-slate-900">38 Items</div>
          <span className="mt-1 block text-[11px] text-emerald-600 font-semibold">100% WCAG 2.2 AA</span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Approved Production Ready</span>
          <div className="mt-1 text-2xl font-bold text-[#01458e]">32 Items</div>
          <span className="mt-1 block text-[11px] text-slate-400">Deployed company-wide</span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Pending RFCs</span>
          <div className="mt-1 text-2xl font-bold text-amber-600">6 Items</div>
          <span className="mt-1 block text-[11px] text-slate-400">Under engineering review</span>
        </div>
      </div>

      {/* Shared DataTable */}
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
        emptyMessage="No pattern records match the selected criteria."
      />
    </div>
  )
}
