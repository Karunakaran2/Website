import { AMOUNT_FIELD_EXCLUDE_PATTERN, AMOUNT_FIELD_KEY_PATTERN } from './amountFieldKey'
import { formatDisplayDate, formatIndianAmount } from './probityFormat'

const DATE_KEY_PATTERN =
  /(date|fromDate|toDate|journalDate|documentDate|transactionDate|voucherDate|createdOn|verifiedOn|approvedOn|submittedOn|receivedOn|heldOn|allocationDate|capitalisationDate|retirementDate|maintenanceDate|depreciationDate|openingDate)/i

function columnKey(column) {
  const headerText = typeof column.header === 'string' ? column.header : ''
  const accessor =
    typeof column.accessor === 'string' ? column.accessor : column.accessor ? 'fn' : ''
  return `${column.id ?? ''} ${accessor} ${headerText}`.trim()
}

export function isCurrencyColumn(column) {
  if (column?.format === 'currency' || column?.valueFormat === 'currency') {
    return true
  }
  if (
    column?.format === 'text'
    || column?.format === 'plain'
    || column?.valueFormat === 'text'
    || column?.valueFormat === 'plain'
  ) {
    return false
  }
  if (column?.format === 'date' || column?.valueFormat === 'date') {
    return false
  }
  const key = columnKey(column)
  if (!key || AMOUNT_FIELD_EXCLUDE_PATTERN.test(key)) {
    return false
  }
  return AMOUNT_FIELD_KEY_PATTERN.test(key)
}

export function isDateColumn(column) {
  if (column?.format === 'date' || column?.valueFormat === 'date') {
    return true
  }
  if (column?.format === 'currency' || column?.valueFormat === 'currency') {
    return false
  }
  return DATE_KEY_PATTERN.test(columnKey(column))
}

export function formatTableCellValue(column, raw) {
  if (raw == null || raw === '') {
    return '—'
  }
  if (isDateColumn(column)) {
    return formatDisplayDate(raw) || '—'
  }
  if (isCurrencyColumn(column)) {
    const text = String(raw).trim()
    if (text === '--' || text === '—') {
      return '—'
    }
    return formatIndianAmount(raw)
  }
  return raw
}

export function currencyColumnClassName(existing = '') {
  if (existing.includes('text-right') || existing.includes('text-center')) {
    return `${existing} tabular-nums`.trim()
  }
  return `${existing} !text-right tabular-nums`.trim()
}
