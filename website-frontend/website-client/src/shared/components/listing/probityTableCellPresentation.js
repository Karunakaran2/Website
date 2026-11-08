import {
  isDataTableActionColumn,
  isDataTableFixedWidthColumn,
} from '@/shared/components/DataTable/dataTableColumnConfig'
import {
  resolveMonetaryHeaderNode,
  resolveTableColumnHeader,
} from '@/shared/components/display/resolveTableColumnHeader'
import { isCurrencyColumn } from '@/shared/utils/tableColumnFormat'
import { isSerialColumn } from './tableSerial'

function columnSource(col) {
  return col?._source ?? col
}

export function probityTableColumnIsFixedWidth(col) {
  if (!col) return false
  if (col.isExpandToggle || col.isSelect || col.isSerial || isSerialColumn(col)) {
    return true
  }
  return isDataTableFixedWidthColumn(columnSource(col))
}

/** Long text / descriptions — full visibility, no ellipsis. */
export const PROBITY_TABLE_CELL_INNER_TEXT_CLASS =
  'min-w-0 break-words whitespace-normal [overflow-wrap:anywhere]'

export const PROBITY_TABLE_CELL_INNER_FIXED_CLASS = 'min-w-0 overflow-visible'

export const PROBITY_TABLE_CELL_INNER_ACTION_CLASS =
  'min-w-0 overflow-visible whitespace-nowrap'

/** Expandable row detail values (DataTable responsive accordion). */
export const PROBITY_TABLE_OVERFLOW_DETAIL_VALUE_CLASS =
  'min-w-0 whitespace-normal break-words text-sm [overflow-wrap:anywhere] text-slate-900 dark:text-slate-100'

export function probityTableCellInnerClass(col) {
  if (!col) return PROBITY_TABLE_CELL_INNER_TEXT_CLASS
  if (probityTableColumnIsFixedWidth(col)) {
    if (isDataTableActionColumn(columnSource(col))) {
      return PROBITY_TABLE_CELL_INNER_ACTION_CLASS
    }
    return PROBITY_TABLE_CELL_INNER_FIXED_CLASS
  }
  return PROBITY_TABLE_CELL_INNER_TEXT_CLASS
}

/**
 * Whether body cells use wrap tokens + inner wrapper (shared with DataTable responsive mode).
 * Does not enable DataTable toolbar, sorting, or column packing.
 */
export function probityTableCellsShouldWrap({ wrapCells = true, responsiveNoScroll = false } = {}) {
  if (responsiveNoScroll) return true
  return wrapCells !== false
}

export function probityTableOverflowDetailLabel(col, getOverflowColumnLabel) {
  if (getOverflowColumnLabel) {
    const custom = getOverflowColumnLabel(col)
    if (custom != null && custom !== '') return custom
  }
  if (typeof col.detailLabel === 'string' && col.detailLabel.trim()) {
    return col.detailLabel.trim()
  }
  if (typeof col.header === 'string' && col.header.trim()) {
    return col.header.trim()
  }
  return 'Field'
}

/** dt content — ₹ prefix when column is monetary (string labels only). */
export function probityTableOverflowDetailLabelNode(col, getOverflowColumnLabel) {
  const custom = getOverflowColumnLabel?.(col)
  if (custom != null && custom !== '' && typeof custom !== 'string') {
    return custom
  }
  const text =
    typeof custom === 'string' && custom.trim()
      ? custom.trim()
      : probityTableOverflowDetailLabel(col, undefined)
  if (typeof text !== 'string') return text
  if (isCurrencyColumn(col)) {
    return resolveMonetaryHeaderNode(text)
  }
  return resolveTableColumnHeader({ ...col, header: text }) ?? text
}
