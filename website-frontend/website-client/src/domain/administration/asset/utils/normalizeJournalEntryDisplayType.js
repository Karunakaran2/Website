import { parseAmount } from '@/shared/utils/probityFormat'

function isPositiveAmount(value) {
  const parsed = parseAmount(value)
  return parsed != null && Number.isFinite(parsed) && parsed > 0
}

function isDebitToken(token) {
  if (token == null || token === '') {
    return false
  }
  const normalized = String(token).trim()
  if (normalized === '0') {
    return true
  }
  const upper = normalized.toUpperCase()
  return upper === 'D' || upper === 'DR' || upper === 'DEBIT'
}

function isCreditToken(token) {
  if (token == null || token === '') {
    return false
  }
  const normalized = String(token).trim()
  if (normalized === '1') {
    return true
  }
  const upper = normalized.toUpperCase()
  return upper === 'C' || upper === 'CR' || upper === 'CREDIT'
}

/** Display DR/CR for journal lines from API entryType and amounts. */
export function normalizeJournalEntryDisplayType(entryType, debitAmount, creditAmount) {
  if (isDebitToken(entryType)) {
    return 'DR'
  }
  if (isCreditToken(entryType)) {
    return 'CR'
  }
  if (isPositiveAmount(debitAmount)) {
    return 'DR'
  }
  if (isPositiveAmount(creditAmount)) {
    return 'CR'
  }
  return 'CR'
}

export function journalLineDisplayAmount(entryType, debitAmount, creditAmount) {
  const displayType = normalizeJournalEntryDisplayType(entryType, debitAmount, creditAmount)
  if (displayType === 'DR') {
    return debitAmount ?? creditAmount
  }
  return creditAmount ?? debitAmount
}
