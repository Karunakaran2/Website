import { formatIndianAmountOrDash } from '@/shared/utils/probityFormat'
import { formatAssetDisplayDate } from './assetDateFormat'

export function formatOpeningFixedAssetDate(value) {
  return formatAssetDisplayDate(value)
}

export function formatOpeningFixedAssetAmount(value) {
  if (value == null || value === '') {
    return '—'
  }
  const number = Number(value)
  if (Number.isNaN(number)) {
    return String(value)
  }
  return formatIndianAmountOrDash(value)
}

export function openingFixedAssetImportStatusLabel(status) {
  if (status === 'S') {
    return 'Saved'
  }
  if (status === 'I') {
    return 'Pending save'
  }
  return status || '—'
}
