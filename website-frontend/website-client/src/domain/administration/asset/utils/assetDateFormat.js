import { formatDisplayDate, formatDisplayDateOrDash } from '@/shared/utils/probityFormat'

/** Display dates as dd-mm-yyyy across asset module lists and view modals. */
export function formatAssetDisplayDate(value) {
  if (value == null || value === '') {
    return '—'
  }
  const text = String(value).trim()
  const slashMatch = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(text)
  if (slashMatch) {
    const day = slashMatch[1].padStart(2, '0')
    const month = slashMatch[2].padStart(2, '0')
    return `${day}-${month}-${slashMatch[3]}`
  }
  return formatDisplayDateOrDash(value)
}

/** Date and time for list columns (e.g. updated on). */
export function formatAssetDisplayDateTime(value) {
  if (value == null || value === '') {
    return '—'
  }
  const text = String(value).trim()
  const slashDateTime = /^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})/.exec(text)
  if (slashDateTime) {
    const day = slashDateTime[1].padStart(2, '0')
    const month = slashDateTime[2].padStart(2, '0')
    return `${day}-${month}-${slashDateTime[3]} ${slashDateTime[4].padStart(2, '0')}:${slashDateTime[5]}`
  }
  const parsed = new Date(text)
  if (Number.isNaN(parsed.getTime())) {
    return formatAssetDisplayDate(value)
  }
  const day = String(parsed.getDate()).padStart(2, '0')
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const year = parsed.getFullYear()
  const hours = String(parsed.getHours()).padStart(2, '0')
  const minutes = String(parsed.getMinutes()).padStart(2, '0')
  return `${day}-${month}-${year} ${hours}:${minutes}`
}
