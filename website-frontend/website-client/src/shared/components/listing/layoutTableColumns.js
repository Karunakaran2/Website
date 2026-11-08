import { isSerialColumn, TABLE_SERIAL_COLUMN_CLASS, TABLE_SERIAL_HEADER } from './tableSerial'

/** Include Sl. No. in responsive width packing (must match ProbityDataTable row numbers). */
export function withLayoutSerialColumn(columns = [], showRowNumbers = false) {
  if (!showRowNumbers || columns.some(isSerialColumn)) {
    return columns
  }
  return [
    {
      key: '__layout_serial__',
      isSerial: true,
      header: TABLE_SERIAL_HEADER,
      ...TABLE_SERIAL_COLUMN_CLASS,
    },
    ...columns,
  ]
}
