/** Read a sort/filter-friendly scalar from a row for a DataTable column def. */
export function getDataTableCellValue(row, column) {
  if (!column || row == null) return ''
  if (typeof column.accessor === 'function') {
    return column.accessor(row)
  }
  if (column.accessor) {
    return row[column.accessor]
  }
  if (column.id != null) {
    return row[column.id]
  }
  if (column.key != null) {
    return row[column.key]
  }
  return ''
}

export function cellValueToMeasureString(value) {
  if (value == null) return ''
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (typeof value === 'string') return value.trim()
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (Array.isArray(value)) {
    return value.map(cellValueToMeasureString).filter(Boolean).join(', ')
  }
  return ''
}
