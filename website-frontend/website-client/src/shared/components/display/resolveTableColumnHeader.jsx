import RupeeColumnHeader from './RupeeColumnHeader'
import { formatDataTableHeaderLabel } from '@/shared/components/DataTable/dataTableColumnConfig'
import { isCurrencyColumn } from '@/shared/utils/tableColumnFormat'

export function headerAlreadyHasRupee(value) {
  if (value == null) return false
  if (typeof value === 'string') return /₹/.test(value)
  return false
}

/** Plain-text label with rupee prefix (column visibility menu, accordion field names). */
export function formatCurrencyColumnLabel(label) {
  if (typeof label !== 'string' || !label.trim()) return label
  const trimmed = label.trim()
  if (headerAlreadyHasRupee(trimmed)) return trimmed
  return `₹ ${trimmed}`
}

export function resolveMonetaryHeaderNode(header) {
  if (header == null || header === '') return header
  if (typeof header !== 'string') return header
  if (headerAlreadyHasRupee(header)) return header
  return <RupeeColumnHeader label={header.trim()} />
}

/**
 * Thead content for listing columns (DataTable, ProbityDataTable).
 * Uses {@link isCurrencyColumn} — no duplicate ₹ when already present.
 */
export function resolveTableColumnHeader(column) {
  if (!column) return null
  if (column.header != null && typeof column.header !== 'string') {
    return column.header
  }
  const label = formatDataTableHeaderLabel(column)
  if (!isCurrencyColumn(column)) {
    return label
  }
  return resolveMonetaryHeaderNode(label)
}

/** Avoid re-resolving pre-built header nodes (static responsive tables). */
export function renderProbityTableHeaderCell(column) {
  if (!column) return null
  const header = column.header
  if (header != null && typeof header !== 'string') {
    return header
  }
  return resolveTableColumnHeader(column) ?? header
}

/** String thead labels in custom HTML tables (same rules as {@link resolveTableColumnHeader}). */
export function resolveMonetaryTableHeaderContent(children, { monetary = true } = {}) {
  if (monetary === false || typeof children !== 'string') {
    return children
  }
  if (!isCurrencyColumn({ header: children })) {
    return children
  }
  return resolveMonetaryHeaderNode(children)
}
