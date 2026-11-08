/** Client-side CSV export for list pages (current row set). */
export function exportTableCsv(rows, columns, filename = 'export.csv') {
  if (!Array.isArray(rows) || rows.length === 0) {
    return false
  }

  const cols = columns.filter((c) => c.id && c.id !== 'action' && c.header)
  const headerLine = cols.map((c) => escapeCsv(String(c.header))).join(',')
  const lines = rows.map((row) =>
    cols
      .map((col) => {
        let val = ''
        if (typeof col.accessor === 'function') {
          val = col.accessor(row)
        } else if (col.accessor) {
          val = row[col.accessor]
        } else if (col.id) {
          val = row[col.id]
        }
        if (val == null) val = ''
        return escapeCsv(String(val))
      })
      .join(','),
  )

  const blob = new Blob([[headerLine, ...lines].join('\n')], {
    type: 'text/csv;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
  return true
}

function escapeCsv(value) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}
