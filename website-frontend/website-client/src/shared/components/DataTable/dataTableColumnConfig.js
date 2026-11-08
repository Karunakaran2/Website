import { formatCurrencyColumnLabel } from '@/shared/components/display/resolveTableColumnHeader'
import { isSerialColumn, TABLE_SERIAL_WIDTH_PX } from '@/shared/components/listing/tableSerial'
import { isCurrencyColumn, isDateColumn } from '@/shared/utils/tableColumnFormat'
import { labelFromFieldKey, toUiLabelCase } from '@/shared/utils/uiLabelCase'

export const DATATABLE_EXPAND_COLUMN_ID = '__datatable_expand__'
export const DATATABLE_SELECT_COLUMN_ID = '__datatable_select__'
export const DATATABLE_SERIAL_COLUMN_ID = '__datatable_serial__'

const ACTION_IDS = new Set(['action', 'actions'])
const STATUS_IDS = new Set(['activestatus', 'isactive', 'status'])

/** High-priority data columns (lower number = kept visible longer when space is tight). */
const HIGH_PRIORITY_FIELD_IDS = {
  servicetype: 12,
  description: 14,
  category: 16,
  companyname: 12,
  partyname: 12,
}

function columnIdLower(column) {
  return getDataTableColumnId(column).toLowerCase()
}

function headerLower(column) {
  return typeof column?.header === 'string' ? column.header.trim().toLowerCase() : ''
}

function fieldMatches(column, patterns) {
  const id = columnIdLower(column)
  const header = headerLower(column)
  return patterns.some((pattern) => pattern.test(id) || pattern.test(header))
}

export function isDataTableDescriptionColumn(column) {
  if (column?.contentKind === 'description') return true
  return fieldMatches(column, [
    /description/,
    /remark/,
    /narration/,
    /comment/,
    /address/,
  ])
}

/** Primary title columns (visibility priority), not every *Name field (e.g. setupName). */
export function isDataTablePrimaryTitleColumn(column) {
  if (column?.contentKind === 'name') return true
  const id = columnIdLower(column)
  if (['companyname', 'partyname', 'servicetype'].includes(id)) return true
  const header = headerLower(column)
  return /^(company name|party name|item\/service code)$/.test(header)
}

/** @deprecated alias */
export function isDataTableNameColumn(column) {
  return isDataTablePrimaryTitleColumn(column)
}

export function getDataTableColumnId(column) {
  if (!column) return ''
  if (column.columnId) return String(column.columnId)
  if (column.isSerial) return DATATABLE_SERIAL_COLUMN_ID
  if (column.isSelect) return DATATABLE_SELECT_COLUMN_ID
  if (column.isExpandToggle) return DATATABLE_EXPAND_COLUMN_ID
  const id = column.id ?? column.key ?? column.accessor
  return id == null ? '' : String(id)
}

/** Plain-text column label for headers, visibility menu, and responsive detail rows. */
export function formatDataTableHeaderLabel(column) {
  if (!column) return ''

  if (column.headerTitleCase === false) {
    if (typeof column.label === 'string' && column.label.trim()) return column.label.trim()
    if (typeof column.header === 'string') return column.header.trim()
    const id = getDataTableColumnId(column)
    if (id && !id.startsWith('__datatable_')) return id
    return 'Column'
  }

  if (typeof column.label === 'string' && column.label.trim()) {
    return toUiLabelCase(column.label.trim())
  }
  if (typeof column.header === 'string' && column.header.trim()) {
    return toUiLabelCase(column.header.trim())
  }
  const id = getDataTableColumnId(column)
  if (id && !id.startsWith('__datatable_')) return labelFromFieldKey(id)
  return 'Column'
}

export function getDataTableColumnLabel(column) {
  const label = formatDataTableHeaderLabel(column)
  if (isCurrencyColumn(column)) {
    return formatCurrencyColumnLabel(label)
  }
  return label
}

export function isDataTableActionColumn(column) {
  const id = columnIdLower(column)
  if (ACTION_IDS.has(id)) return true
  const header = headerLower(column)
  return header === 'action' || header === 'actions'
}

export function isDataTableStatusColumn(column) {
  if (!column) return false
  if (column.pinned === 'status' || column.mandatory === 'status') return true
  const id = columnIdLower(column)
  if (STATUS_IDS.has(id)) return true
  const header = headerLower(column)
  if (header === 'status') return true
  return false
}

/** Columns that keep a fixed pixel width (icons, badges, serial); text columns wrap instead. */
export function isDataTableFixedWidthColumn(column) {
  if (!column) return false
  if (column.isExpandToggle || column.isSelect || column.isSerial || column.isExpandColumn) {
    return true
  }
  if (isSerialColumn(column)) return true
  if (isDataTableActionColumn(column)) return true
  if (isDataTableStatusColumn(column)) return true
  return false
}

export function isDataTableColumnPinned(column) {
  if (!column) return false
  if (column.pinned === true) return true
  if (column.isSerial || column.isSelect || column.isExpandToggle) return true
  if (isDataTableActionColumn(column)) return true
  if (isDataTableStatusColumn(column)) return true
  return isSerialColumn(column)
}

export function isDataTableColumnHideable(column) {
  if (!column || column.hideable === false) return false
  if (column.hideable === true) return true
  if (isDataTableColumnPinned(column)) return false
  if (column.isExpandToggle) return false
  const id = getDataTableColumnId(column)
  return id.length > 0 && !id.startsWith('__datatable_')
}

export function getDataTableColumnPriority(column, index = 0) {
  if (column?.priority != null && Number.isFinite(Number(column.priority))) {
    return Number(column.priority)
  }
  if (column?.isExpandToggle) return 2
  if (column?.isSelect) return 1
  if (column?.isSerial || isSerialColumn(column)) return 0
  if (isDataTableActionColumn(column)) return 9000
  if (isDataTableStatusColumn(column)) return 8500
  const id = columnIdLower(column)
  if (HIGH_PRIORITY_FIELD_IDS[id] != null) {
    return HIGH_PRIORITY_FIELD_IDS[id]
  }
  return 10 + index * 10
}

/** Higher score = preferred recipient of extra horizontal space (wrapping text columns). */
export function getDataTableColumnGrowScore(column) {
  if (!column || isDataTableFixedWidthColumn(column)) return -1
  if (column.fillColumn || column.wrapCells) return 90
  if (isDataTableDescriptionColumn(column)) return 85
  if (fieldMatches(column, [/ledger/, /registered/])) return 70
  if (isDataTablePrimaryTitleColumn(column)) return 65
  if (isCurrencyColumn(column) || isDateColumn(column)) return 20
  return 35
}

export function getDataTableColumnMinWidth(column) {
  const explicit = column?.responsiveMinWidth ?? column?.minWidth
  if (explicit != null && Number.isFinite(Number(explicit))) {
    return Math.max(48, Number(explicit))
  }
  if (column?.isExpandToggle) return 44
  if (column?.isSelect) return 44
  if (column?.isSerial || isSerialColumn(column)) return TABLE_SERIAL_WIDTH_PX
  if (isDataTableActionColumn(column)) return 132
  if (isDataTableStatusColumn(column)) return 92
  if (isDateColumn(column) || column?.format === 'date') return 92
  if (isCurrencyColumn(column) || column?.format === 'currency') return 88
  if (isDataTableDescriptionColumn(column)) return 88
  if (isDataTablePrimaryTitleColumn(column)) return 80
  if (fieldMatches(column, [/rate$/, /price$/, /amount/, /qty/, /quantity/])) return 72
  if (fieldMatches(column, [/prefix/, /suffix/, /code/, /setupname/])) return 68
  return 72
}

export function buildDefaultColumnVisibility(columns) {
  const map = {}
  columns.forEach((column) => {
    const id = getDataTableColumnId(column)
    if (!id || !isDataTableColumnHideable(column)) return
    map[id] = column.defaultVisible !== false
  })
  return map
}
