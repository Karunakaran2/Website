/** First-column label for every listing and data table. */
export const TABLE_SERIAL_HEADER = 'Sl. No.'

/** Fixed width for serial column (header "Sl. No." + 3-digit indices). */
export const TABLE_SERIAL_WIDTH_PX = 60

export const TABLE_SERIAL_WIDTH_CLASS =
  'w-[3.75rem] min-w-[3.75rem] max-w-[3.75rem] whitespace-nowrap tabular-nums'

const SERIAL_IDS = new Set(['serial', 'serialno', 'slno', '_serial'])

function headerText(header) {
  if (typeof header !== 'string') return ''
  return header.trim().toLowerCase().replace(/[\s.]/g, '')
}

export function isSerialColumn(column) {
  if (!column) return false
  if (column.isSerial) return true
  const id = String(column.id ?? column.key ?? column.columnId ?? '')
    .replace(/[_\s.-]/g, '')
    .toLowerCase()
  if (SERIAL_IDS.has(id)) return true
  if (id === 'layoutserial') return true
  const header = headerText(column.header)
  return header === 'slno' || header === 'sno' || header === '#' || header === 'serial' || header === 'serialno'
}

export const TABLE_SERIAL_COLUMN_CLASS = {
  align: 'center',
  responsiveMinWidth: TABLE_SERIAL_WIDTH_PX,
  minWidth: TABLE_SERIAL_WIDTH_PX,
  headerClassName: `${TABLE_SERIAL_WIDTH_CLASS} text-center`,
  className: `${TABLE_SERIAL_WIDTH_CLASS} text-center text-slate-800`,
}
