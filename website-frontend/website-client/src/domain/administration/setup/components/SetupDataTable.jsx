import { useMemo } from 'react'
import { DataTable } from '@/shared/components'
import { prependSetupSerialColumn, withSetupSerialRows } from '../utils/setupListSerial'

/**
 * Setup / master-setup listing table — prepends Probity 2.0-style `#` serial column.
 */
export default function SetupDataTable({
  columns,
  rows,
  page = 1,
  pageSize = 10,
  showSerial = true,
  ...rest
}) {
  const resolvedColumns = useMemo(
    () => (showSerial ? prependSetupSerialColumn(columns) : columns),
    [columns, showSerial],
  )
  const resolvedRows = useMemo(
    () => (showSerial ? withSetupSerialRows(rows, page, pageSize) : rows),
    [rows, page, pageSize, showSerial],
  )

  return (
    <DataTable
      columns={resolvedColumns}
      rows={resolvedRows}
      page={page}
      pageSize={pageSize}
      {...rest}
    />
  )
}
