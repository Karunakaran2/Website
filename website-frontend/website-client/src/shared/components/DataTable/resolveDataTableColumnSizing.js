import {
  getDataTableColumnMinWidth as getTypeFloorMinWidth,
  isDataTableDescriptionColumn,
  isDataTableFixedWidthColumn,
  isDataTableNameColumn,
} from './dataTableColumnConfig'

/** Approximate px per character at listing table body size (13px). */
const CHAR_PX = 7.25
/** Slightly wider estimate for semibold thead labels. */
const HEADER_CHAR_PX = 7.75
const CELL_HORIZONTAL_PAD_PX = 28
/** Sort chevron + gap beside header text. */
export const DATATABLE_SORT_HEADER_RESERVE_PX = 24

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function contentLengthToPx(length) {
  return Math.ceil(Math.max(1, length) * CHAR_PX) + CELL_HORIZONTAL_PAD_PX
}

function getContentBounds(column) {
  if (isDataTableFixedWidthColumn(column)) {
    const fixed = getTypeFloorMinWidth(column)
    return { minCeiling: fixed, maxDefault: fixed }
  }
  if (isDataTableDescriptionColumn(column)) {
    return { minCeiling: 160, maxDefault: 260 }
  }
  if (isDataTableNameColumn(column)) {
    return { minCeiling: 140, maxDefault: 220 }
  }
  if (column?.contentKind === 'code' || column?.contentKind === 'compact') {
    return { minCeiling: 100, maxDefault: 140 }
  }
  return { minCeiling: 120, maxDefault: 180 }
}

/**
 * Min width from tbody sample + header, bounded by column type (avoids wide empty columns).
 */
export function resolveDataTableColumnMinWidth(column, hint) {
  const typeFloor = getTypeFloorMinWidth(column)
  if (isDataTableFixedWidthColumn(column)) {
    return typeFloor
  }

  const contentLen = hint?.contentLength ?? hint?.headerLength ?? 10
  const headerLen = hint?.headerLength ?? 10
  const contentPx = contentLengthToPx(contentLen)
  const headerTextPx =
    Math.ceil(Math.max(1, headerLen) * HEADER_CHAR_PX) + CELL_HORIZONTAL_PAD_PX
  const headerPx =
    headerTextPx + (column?.sortable ? DATATABLE_SORT_HEADER_RESERVE_PX : 0)
  const { minCeiling } = getContentBounds(column)

  const fromContent = Math.max(contentPx, headerPx)
  return clamp(fromContent, typeFloor, minCeiling)
}

/**
 * Max width caps growth so one column cannot consume the entire table.
 */
export function resolveDataTableColumnMaxWidth(column, hint, resolvedMinWidth) {
  const min = resolvedMinWidth ?? resolveDataTableColumnMinWidth(column, hint)
  if (isDataTableFixedWidthColumn(column)) {
    return min
  }

  const contentLen = hint?.contentLength ?? hint?.headerLength ?? min
  const contentPx = contentLengthToPx(contentLen)
  const { maxDefault } = getContentBounds(column)
  const fromContent = Math.max(min, contentPx + 12)

  return clamp(fromContent, min, maxDefault)
}
