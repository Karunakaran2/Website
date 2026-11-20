import { useMemo, useState } from 'react'
import DataTable from '@/shared/components/DataTable'
import { dataTableColumn } from '@/shared/utils/buildDataTableColumn'

/**
 * Read-only CMS list using shared DataTable (search + pagination).
 */
export default function WebsiteCmsReadOnlyTable({
  rows = [],
  loading = false,
  isError = false,
  errorMessage = 'Could not load records.',
  emptyMessage = 'No records found.',
  columnKeys,
}) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const columns = useMemo(() => {
    const keys = columnKeys ?? (rows.length ? Object.keys(rows[0]).slice(0, 8) : ['id', 'title'])
    return keys.map((key) => {
      if (typeof key === 'string') {
        return dataTableColumn({ id: key, sortable: true, minWidth: 100 })
      }
      return dataTableColumn(key)
    })
  }, [columnKeys, rows])

  const total = rows.length
  const pageRows = useMemo(() => {
    const start = (page - 1) * pageSize
    return rows.slice(start, start + pageSize)
  }, [rows, page, pageSize])

  return (
    <div className="space-y-4">
      {isError ? (
        <p className="text-sm text-rose-700" role="alert">
          {errorMessage}
        </p>
      ) : null}
      <DataTable
        rowKey="id"
        columns={columns}
        rows={pageRows}
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
        pageSizeOptions={[5, 10, 20, 50]}
        loading={loading}
        emptyMessage={emptyMessage}
        enableColumnVisibility={false}
      />
    </div>
  )
}