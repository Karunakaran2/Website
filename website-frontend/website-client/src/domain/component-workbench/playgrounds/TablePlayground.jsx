import { useState, useMemo } from 'react'
import DataTable from '@/shared/components/DataTable'
import StatusChip from '@/shared/components/status/StatusChip'
import {
  TableApproveAction,
  TableDeleteAction,
  TableEditAction,
  TableRowActionsGroup,
  TableViewAction,
} from '@/shared/components/buttons'
import {
  GIGW_EDIT_ICON,
  GIGW_FINALIZE_ICON,
} from '@/shared/components/buttons/gigw/gigwLucideIcons'
import { Eye, Trash2 } from 'lucide-react'
import { TABLE_ACTION_COLUMN_CLASS } from '@/shared/components/listing/listingTableStyles'

const SAMPLE_COMPONENTS = [
  { id: 'c1', name: 'PrimaryButton', category: 'Actions', version: '2.4.0', status: 'Stable', downloads: 1420 },
  { id: 'c2', name: 'OrgTextField', category: 'Forms', version: '2.3.1', status: 'Stable', downloads: 2890 },
  { id: 'c3', name: 'PortalModal', category: 'Feedback', version: '2.1.0', status: 'Stable', downloads: 980 },
  { id: 'c4', name: 'DataTable', category: 'Data Display', version: '2.4.2', status: 'Updated', downloads: 3410 },
  { id: 'c5', name: 'AccessibilityBar', category: 'Layout', version: '1.9.0', status: 'Stable', downloads: 1650 },
  { id: 'c6', name: 'StatusChip', category: 'Data Display', version: '1.5.0', status: 'Stable', downloads: 820 },
  { id: 'c7', name: 'OrgSelectField', category: 'Forms', version: '2.2.0', status: 'Stable', downloads: 2130 },
  { id: 'c8', name: 'ConfirmDialog', category: 'Feedback', version: '2.0.4', status: 'Deprecated', downloads: 410 },
  { id: 'c9', name: 'BreadcrumbNav', category: 'Navigation', version: '1.2.0', status: 'Beta', downloads: 350 },
  { id: 'c10', name: 'DateRangePicker', category: 'Forms', version: '0.9.1', status: 'Beta', downloads: 180 },
  { id: 'c11', name: 'AccordionGroup', category: 'Data Display', version: '2.0.1', status: 'Stable', downloads: 640 },
  { id: 'c12', name: 'ToastContainer', category: 'Feedback', version: '1.8.0', status: 'Stable', downloads: 1120 },
]

export default function TablePlayground() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState({ sortBy: 'name', sortDir: 'asc' })
  const [pageSize, setPageSize] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [forceEmpty, setForceEmpty] = useState(false)

  const columns = useMemo(
    () => [
      {
        id: 'name',
        header: 'Component Name',
        accessor: 'name',
        sortable: true,
        pinned: true,
        minWidth: 160,
        cell: (row) => (
          <span className="font-semibold text-[#01458e]">{row.name}</span>
        ),
      },
      {
        id: 'category',
        header: 'Category',
        accessor: 'category',
        sortable: true,
        minWidth: 140,
      },
      {
        id: 'version',
        header: 'Version',
        accessor: 'version',
        sortable: true,
        minWidth: 100,
        cell: (row) => (
          <span className="font-mono text-xs text-slate-600">v{row.version}</span>
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
        id: 'downloads',
        header: 'Weekly Uses',
        accessor: 'downloads',
        sortable: true,
        align: 'right',
        minWidth: 130,
        cell: (row) => (
          <span className="font-medium text-slate-700">{row.downloads.toLocaleString()}</span>
        ),
      },
      {
        id: 'actions',
        header: 'Action',
        align: 'center',
        headerClassName: TABLE_ACTION_COLUMN_CLASS,
        cellClassName: TABLE_ACTION_COLUMN_CLASS,
        minWidth: 140,
        cell: (row) => (
          <TableRowActionsGroup
            items={[
              {
                key: 'view',
                label: 'View',
                icon: Eye,
                render: () => <TableViewAction aria-label={`View ${row.name}`} onClick={() => {}} />,
              },
              {
                key: 'edit',
                label: 'Edit',
                icon: GIGW_EDIT_ICON,
                render: () => <TableEditAction aria-label={`Edit ${row.name}`} onClick={() => {}} />,
              },
              {
                key: 'approve',
                label: 'Approve',
                icon: GIGW_FINALIZE_ICON,
                render: () => <TableApproveAction aria-label={`Approve ${row.name}`} onClick={() => {}} />,
              },
              {
                key: 'delete',
                label: 'Delete',
                icon: Trash2,
                render: () => <TableDeleteAction aria-label={`Delete ${row.name}`} onClick={() => {}} />,
              },
            ]}
          />
        ),
      },
    ],
    []
  )

  const filteredData = useMemo(() => {
    if (forceEmpty) return []
    let result = [...SAMPLE_COMPONENTS]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.status.toLowerCase().includes(q)
      )
    }
    if (sort.sortBy) {
      result.sort((a, b) => {
        const valA = a[sort.sortBy]
        const valB = b[sort.sortBy]
        if (typeof valA === 'number') {
          return sort.sortDir === 'asc' ? valA - valB : valB - valA
        }
        return sort.sortDir === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA))
      })
    }
    return result
  }, [search, sort, forceEmpty])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, currentPage, pageSize])

  const toolbarExtra = (
    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
      <span className="text-slate-500">Use the column visibility control in the toolbar to hide non-pinned columns.</span>
      <label className="flex items-center gap-1.5 cursor-pointer">
        <input
          type="checkbox"
          checked={isLoading}
          onChange={(e) => setIsLoading(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-[#01458e] focus:ring-[#01458e]"
        />
        <span>Loading Skeleton</span>
      </label>

      <label className="flex items-center gap-1.5 cursor-pointer">
        <input
          type="checkbox"
          checked={forceEmpty}
          onChange={(e) => setForceEmpty(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-[#01458e] focus:ring-[#01458e]"
        />
        <span>Simulate Empty State</span>
      </label>
    </div>
  )

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        rows={paginatedData}
        rowKey="id"
        search={search}
        onSearchChange={(v) => {
          setSearch(v)
          setCurrentPage(1)
        }}
        page={currentPage}
        pageSize={pageSize}
        total={filteredData.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={(sz) => {
          setPageSize(sz)
          setCurrentPage(1)
        }}
        pageSizeOptions={[5, 10, 20]}
        sort={sort}
        onSortChange={setSort}
        loading={isLoading}
        toolbarExtra={toolbarExtra}
        emptyMessage="No components found. Try clearing the filter or search query."
      />
    </div>
  )
}
