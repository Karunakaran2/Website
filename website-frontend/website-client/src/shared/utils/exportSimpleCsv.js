/** Export rows of plain objects as CSV (dashboard summaries, activity logs, etc.). */
export function exportSimpleCsv(rows, columns, filename = 'export.csv') {
  if (!Array.isArray(rows) || rows.length === 0 || !columns?.length) {
    return false
  }

  const headerLine = columns.map((c) => escapeCsv(String(c.header))).join(',')
  const lines = rows.map((row) =>
    columns
      .map((col) => {
        const val = row[col.key]
        return escapeCsv(val == null ? '' : String(val))
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
