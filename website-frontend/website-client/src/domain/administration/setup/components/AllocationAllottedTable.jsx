import SetupDataTable from './SetupDataTable'
import { useClientDataTable } from '../hooks/useClientDataTable'

export default function AllocationAllottedTable({
  columns,
  allRows,
  rowKey,
  loading,
  searchFields,
}) {
  const table = useClientDataTable(allRows, { searchFields })

  return (
    <SetupDataTable
      columns={columns}
      rows={table.rows}
      rowKey={rowKey}
      search={table.search}
      onSearchChange={table.setSearch}
      page={table.page}
      pageSize={table.pageSize}
      total={table.total}
      onPageChange={table.setPage}
      onPageSizeChange={table.setPageSize}
      sort={table.sort}
      onSortChange={table.setSort}
      loading={loading}
      emptyMessage="No data available in table"
    />
  )
}
