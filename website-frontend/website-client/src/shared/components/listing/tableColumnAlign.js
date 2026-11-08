import { isCurrencyColumn } from '@/shared/utils/tableColumnFormat'
import { isSerialColumn } from './tableSerial'
import { TABLE_ACTION_COLUMN_CLASS } from './listingTableStyles'

/** @typedef {'left' | 'center' | 'right'} TableColumnAlign */

const ALIGN_CLASS_PATTERN =
  /\b!?text-(?:left|right|center|start|end)\b/

/**
 * Parse horizontal alignment from Tailwind classes on column defs.
 * @returns {TableColumnAlign | undefined}
 */
export function parseAlignFromClassName(className = '') {
  const text = String(className)
  if (/\b!?text-(?:center)\b/.test(text)) return 'center'
  if (/\b!?text-(?:right|end)\b/.test(text)) return 'right'
  if (/\b!?text-(?:left|start)\b/.test(text)) return 'left'
  return undefined
}

function normalizeAlign(value) {
  if (value === 'right' || value === 'end') return 'right'
  if (value === 'left' || value === 'start') return 'left'
  if (value === 'center') return 'center'
  return undefined
}

function isActionColumn(column) {
  if (!column) return false
  const id = String(column.id ?? column.key ?? '').toLowerCase()
  if (id === 'action' || id === 'actions') return true
  const header = typeof column.header === 'string' ? column.header.trim().toLowerCase() : ''
  if (header === 'action' || header === 'actions') return true
  const classBlob = `${column.headerClassName ?? ''} ${column.cellClassName ?? ''} ${column.className ?? ''}`
  return (
    classBlob.includes(TABLE_ACTION_COLUMN_CLASS)
    || (classBlob.includes('min-w-[6.75rem]') && classBlob.includes('whitespace-nowrap'))
  )
}

/**
 * Resolve thead/body alignment for DataTable and ProbityDataTable columns.
 * @returns {TableColumnAlign}
 */
export function resolveTableColumnAlign(column) {
  const explicit = normalizeAlign(column?.align)
  if (explicit) return explicit

  const fromClass = parseAlignFromClassName(
    `${column?.headerClassName ?? ''} ${column?.cellClassName ?? ''} ${column?.className ?? ''}`,
  )
  if (fromClass) return fromClass

  if (isSerialColumn(column)) return 'center'
  if (isCurrencyColumn(column)) return 'right'
  if (isActionColumn(column)) return 'center'

  return 'left'
}

/**
 * Tailwind classes for th/td horizontal alignment (MeitY: start/end logical props).
 * @param {TableColumnAlign} align
 * @param {{ important?: boolean }} [options]
 */
export function tableAlignClassName(align, { important = true } = {}) {
  const prefix = important ? '!' : ''
  if (align === 'right') return `${prefix}text-end`
  if (align === 'center') return 'text-center'
  return `${prefix}text-start`
}

/** Flex justification for sortable header buttons inside a column. */
export function tableHeaderFlexJustifyClass(align) {
  if (align === 'right') return 'justify-end'
  if (align === 'left') return 'justify-start'
  return 'justify-center'
}

/** Remove conflicting text-align utilities before applying tableAlignClassName. */
export function stripTextAlignClasses(className = '') {
  return String(className)
    .replace(ALIGN_CLASS_PATTERN, '')
    .replace(/\s+/g, ' ')
    .trim()
}
