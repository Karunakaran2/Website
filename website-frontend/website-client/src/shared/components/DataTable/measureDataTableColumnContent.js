import { getDataTableCellValue, cellValueToMeasureString } from './dataTableCellValue'
import { getDataTableColumnId, getDataTableColumnLabel } from './dataTableColumnConfig'

const DEFAULT_SAMPLE_SIZE = 30

/**
 * Estimate visible character count from current page rows (server-side sample).
 */
export function measureDataTableColumnContent(columns = [], rows = [], options = {}) {
  const sampleSize = options.sampleSize ?? DEFAULT_SAMPLE_SIZE
  const sample = Array.isArray(rows) ? rows.slice(0, sampleSize) : []
  const hints = {}

  columns.forEach((column) => {
    const id = getDataTableColumnId(column)
    if (!id || id.startsWith('__datatable_')) return

    const header = getDataTableColumnLabel(column)
    const headerLength = header.length
    let maxSampleLength = 0
    let totalLength = 0
    let measuredRows = 0

    sample.forEach((row) => {
      const raw = getDataTableCellValue(row, column)
      const text = cellValueToMeasureString(raw)
      if (!text) return
      const len = text.length
      maxSampleLength = Math.max(maxSampleLength, len)
      totalLength += len
      measuredRows += 1
    })

    const avgLength = measuredRows > 0 ? totalLength / measuredRows : 0
    const contentLength = Math.ceil(
      Math.min(
        Math.max(maxSampleLength, headerLength),
        Math.max(avgLength * 1.1, headerLength),
      ),
    )

    hints[id] = {
      headerLength,
      maxSampleLength,
      avgLength,
      contentLength,
      measuredRows,
    }
  })

  return hints
}
