import { useMemo, useState } from 'react'
import { DataTable } from '@/shared/components'

export default function AuditClosureDataTable({ columns, rows, searchText }) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return rows
    }
    return rows.filter((row) => searchText(row).toLowerCase().includes(query))
  }, [rows, search, searchText])

  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize)

  return (
    <DataTable
      columns={columns}
      rows={pageRows}
      rowKey="idMask"
      search={search}
      onSearchChange={(value) => {
        setSearch(value)
        setPage(1)
      }}
      page={page}
      pageSize={pageSize}
      total={filtered.length}
      onPageChange={setPage}
      onPageSizeChange={(size) => {
        setPageSize(size)
        setPage(1)
      }}
      emptyMessage="No data available in table"
    />
  )
}
