/** Setup lists: first column Sl. No. = page offset + row index + 1. */
export const SETUP_SERIAL_FIELD = '_serial'

export function withSetupSerialRows(rows, page, pageSize) {
  const safePage = Number(page) > 0 ? Number(page) : 1
  const safeSize = Number(pageSize) > 0 ? Number(pageSize) : 10
  const start = (safePage - 1) * safeSize
  return (rows || []).map((row, index) => ({
    ...row,
    [SETUP_SERIAL_FIELD]: start + index + 1,
  }))
}

export function setupSerialColumn() {
  return {
    id: SETUP_SERIAL_FIELD,
    header: 'Sl. No.',
    sortable: false,
    format: 'plain',
    headerClassName: '!min-w-[4.75rem] !w-[4.75rem] whitespace-nowrap !text-center',
    cellClassName: '!text-center tabular-nums text-slate-600',
    accessor: SETUP_SERIAL_FIELD,
  }
}

export function prependSetupSerialColumn(columns) {
  if (!Array.isArray(columns)) {
    return [setupSerialColumn()]
  }
  if (columns.some((column) => column?.id === SETUP_SERIAL_FIELD)) {
    return columns
  }
  return [setupSerialColumn(), ...columns]
}
