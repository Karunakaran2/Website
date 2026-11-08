/**
 * App-wide display formats — dates (dd-mm-yyyy) and Indian rupee grouping (en-IN).
 */

export function parseAmount(value) {
  const amount = Number.parseFloat(
    String(value ?? '')
      .trim()
      .replace(/\u20B9/g, '')
      .replace(/,/g, ''),
  )
  return Number.isFinite(amount) ? amount : 0
}

/** Positive decimal string after removing grouping — matches master-setup price validation. */
export const POSITIVE_DECIMAL_AMOUNT_PATTERN = /^\d+(\.\d+)?$/

/** Restrict live typing to digits and a single decimal point (commas stripped). */
export function sanitizeDecimalAmountInput(value) {
  let text = String(value ?? '').replace(/,/g, '').replace(/[^\d.]/g, '')
  const firstDot = text.indexOf('.')
  if (firstDot >= 0) {
    text = `${text.slice(0, firstDot + 1)}${text.slice(firstDot + 1).replace(/\./g, '')}`
  }
  return text
}

/** Letters, digits, and spaces only (bank name in setup). */
export function sanitizeBankNameInput(value) {
  return String(value ?? '').replace(/[^a-zA-Z0-9\s]/g, '')
}

/** Strip non-digits while typing (e.g. bank account number). */
export function sanitizeDigitsInput(value, { maxLength } = {}) {
  let text = String(value ?? '').replace(/\D/g, '')
  if (maxLength != null && maxLength > 0) {
    text = text.slice(0, maxLength)
  }
  return text
}

export function isValidPositiveDecimalAmount(value) {
  const text = String(value ?? '').trim().replace(/,/g, '')
  if (!text) {
    return false
  }
  return POSITIVE_DECIMAL_AMOUNT_PATTERN.test(text)
}

/**
 * Quantity must be a positive number. Letters and symbols are invalid.
 * Returns true, or the message to show.
 */
export function validateQuantityInput(value, emptyMessage, invalidMessage) {
  const text = String(value ?? '').trim().replace(/,/g, '')
  if (!text || parseAmount(text) <= 0) {
    return emptyMessage
  }
  if (!POSITIVE_DECIMAL_AMOUNT_PATTERN.test(text)) {
    return invalidMessage
  }
  return true
}

export function validatePositiveDecimalAmount(
  value,
  { required = false, fieldLabel = 'Amount' } = {},
) {
  const text = String(value ?? '').trim().replace(/,/g, '')
  if (!text) {
    return required ? `Please enter ${fieldLabel.toLowerCase()}.` : ''
  }
  if (!POSITIVE_DECIMAL_AMOUNT_PATTERN.test(text)) {
    return `${fieldLabel} must contain only positive numbers.`
  }
  return ''
}

/** Numeric value for API / JSON — strips commas and grouping (never send formatted strings). */
export function toApiAmount(value) {
  return parseAmount(value)
}

export function toIsoDate(value) {
  if (value == null || value === '') return ''
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value.trim())) {
    return value.trim().slice(0, 10)
  }
  const parsed = value instanceof Date ? value : parseDisplayDate(value)
  if (!parsed || Number.isNaN(parsed.getTime())) {
    if (value instanceof Date) return ''
    const fallback = new Date(value)
    if (Number.isNaN(fallback.getTime())) return ''
    const year = fallback.getFullYear()
    const month = String(fallback.getMonth() + 1).padStart(2, '0')
    const day = String(fallback.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  const year = parsed.getFullYear()
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const day = String(parsed.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function todayIsoDate() {
  return toIsoDate(new Date())
}

const DISPLAY_DATE_PATTERN = /^(\d{1,2})-(\d{1,2})-(\d{4})$/
const SLASH_DATE_PATTERN = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/

function normalizeDisplayDateParts(day, month, year) {
  return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`
}

/** Display date — dd-mm-yyyy (idempotent if already dd-mm-yyyy or dd/mm/yyyy). */
export function formatDisplayDate(value) {
  if (value == null || value === '') return ''
  const text = String(value).trim()
  const displayMatch = DISPLAY_DATE_PATTERN.exec(text)
  if (displayMatch) {
    return normalizeDisplayDateParts(displayMatch[1], displayMatch[2], displayMatch[3])
  }
  const slashMatch = SLASH_DATE_PATTERN.exec(text)
  if (slashMatch) {
    return normalizeDisplayDateParts(slashMatch[1], slashMatch[2], slashMatch[3])
  }
  const isoDate = toIsoDate(value)
  if (isoDate && /^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
    const [year, month, day] = isoDate.split('-')
    return normalizeDisplayDateParts(day, month, year)
  }
  return text
}

/** Parse dd-mm-yyyy / dd/mm/yyyy / yyyy-MM-dd into a local Date (or null). */
export function parseDisplayDate(value) {
  if (value == null || value === '') return null
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }
  const text = String(value).trim()
  const displayMatch = DISPLAY_DATE_PATTERN.exec(text) || SLASH_DATE_PATTERN.exec(text)
  if (displayMatch) {
    const day = Number(displayMatch[1])
    const month = Number(displayMatch[2])
    const year = Number(displayMatch[3])
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return null
    }
    const date = new Date(year, month - 1, day)
    if (
      date.getFullYear() !== year
      || date.getMonth() !== month - 1
      || date.getDate() !== day
    ) {
      return null
    }
    return date
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    const [year, month, day] = text.slice(0, 10).split('-').map(Number)
    if (!year || !month || !day) return null
    return new Date(year, month - 1, day)
  }
  return null
}

/** Display date for tables, read-only fields, and labels — empty → em dash. */
export function formatDisplayDateOrDash(value) {
  if (value == null || value === '') return '—'
  return formatDisplayDate(value) || '—'
}

/** Display date-time — dd-mm-yyyy HH:mm */
export function formatDisplayDateTime(value) {
  if (value == null || value === '') return ''
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return formatDisplayDate(value)
  }
  const datePart = formatDisplayDate(date)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${datePart} ${hours}:${minutes}`
}

/** Indian grouping without symbol — e.g. 1,00,000.00 (for tables with ₹ in thead). */
export function formatIndianAmount(value, { empty = '0.00' } = {}) {
  if (value == null || value === '') {
    return empty === null ? '' : empty
  }
  const amount = parseAmount(value)
  return amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/** Indian grouping for read-only display — empty/null → em dash. */
export function formatIndianAmountOrDash(value) {
  if (value == null || value === '') {
    return '—'
  }
  return formatIndianAmount(value)
}

/** Indian grouping with ₹ prefix — labels, summaries, reports. */
export function formatRupee(value) {
  const amount = parseAmount(value)
  const formatted = Math.abs(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return `${amount < 0 ? '-' : ''}₹${formatted}`
}

/** @deprecated alias — use formatIndianAmount */
export const formatAmount = formatIndianAmount

/** Form / voucher helpers — same Indian grouping as display. */
export function formatMoney(value) {
  return formatIndianAmount(value)
}

/** Default placeholder / zero display for money inputs (en-IN, two decimals). */
export const INDIAN_AMOUNT_INPUT_ZERO = '0.00'

/**
 * Money inputs — Indian grouping on blur (e.g. 1000 → 1,000.00).
 * @param {{ emptyAsZero?: boolean }} options — when true (default), blank blur becomes 0.00
 */
export function formatIndianAmountForInput(value, { emptyAsZero = true } = {}) {
  const text = value == null ? '' : String(value).trim()
  if (text === '') {
    return emptyAsZero ? formatIndianAmount(0) : ''
  }
  return formatIndianAmount(parseAmount(value))
}

/** Alias for blur handlers in forms and RHF fields. */
export function formatIndianAmountInputValue(value, options) {
  return formatIndianAmountForInput(value, options)
}
