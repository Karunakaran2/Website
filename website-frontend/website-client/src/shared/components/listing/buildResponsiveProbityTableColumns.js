import { ChevronDown, ChevronRight } from 'lucide-react'
import { createElement } from 'react'
import { computeDataTableColumnLayout } from '@/shared/components/DataTable/computeDataTableColumnLayout'
import {
  DATATABLE_EXPAND_COLUMN_ID,
  DATATABLE_SERIAL_COLUMN_ID,
  getDataTableColumnGrowScore,
  getDataTableColumnId,
  getDataTableColumnLabel,
  getDataTableColumnPriority,
  isDataTableColumnPinned,
} from '@/shared/components/DataTable/dataTableColumnConfig'
import { measureDataTableColumnContent } from '@/shared/components/DataTable/measureDataTableColumnContent'
import {
  resolveDataTableColumnMaxWidth,
  resolveDataTableColumnMinWidth,
} from '@/shared/components/DataTable/resolveDataTableColumnSizing'
import { resolveTableColumnHeader } from '@/shared/components/display/resolveTableColumnHeader'
import { resolveTableColumnAlign } from './tableColumnAlign'

export function mapStaticProbityTableColumn(column) {
  const columnId = getDataTableColumnId(column)
  const headerText =
    typeof column.header === 'string'
      ? column.header
      : typeof column.label === 'string'
        ? column.label
        : columnId

  return {
    columnId,
    detailLabel: getDataTableColumnLabel(column),
    header: resolveTableColumnHeader({ ...column, header: headerText }) ?? headerText,
    align: resolveTableColumnAlign(column),
    className: column.className,
    headerClassName: column.headerClassName,
    fillColumn: column.fillColumn === true,
    _source: column,
    render:
      column.render ??
      ((row) => {
        if (column.key != null && row[column.key] != null && row[column.key] !== '') {
          return row[column.key]
        }
        return '—'
      }),
  }
}

function attachResponsiveWidths(cols, columnWidths) {
  return cols.map((col) => {
    const width = columnWidths?.[col.columnId]
    if (width == null || !Number.isFinite(width)) return col
    return { ...col, responsiveWidth: width }
  })
}

function buildExpandColumn({ expandedRowKeys, toggleRowExpanded, resolveRowKey, t }) {
  return {
    columnId: DATATABLE_EXPAND_COLUMN_ID,
    isExpandToggle: true,
    header: createElement(
      'span',
      { className: 'sr-only' },
      t('table.rowDetails', { defaultValue: 'Row details' }),
    ),
    align: 'center',
    headerClassName: 'w-[44px] min-w-[44px] max-w-[44px]',
    className: 'w-[44px] min-w-[44px] max-w-[44px]',
    render: (row, index) => {
      const key = resolveRowKey(row, index)
      const expanded = expandedRowKeys.has(key)
      return createElement(
        'button',
        {
          type: 'button',
          className:
            'inline-flex size-8 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#01458e]',
          'aria-expanded': expanded,
          'aria-label': expanded
            ? t('table.hideRowDetails', { defaultValue: 'Hide row details' })
            : t('table.showRowDetails', { defaultValue: 'Show row details' }),
          onClick: () => toggleRowExpanded(key),
        },
        expanded
          ? createElement(ChevronDown, { size: 18, 'aria-hidden': true })
          : createElement(ChevronRight, { size: 18, 'aria-hidden': true }),
      )
    },
  }
}

/**
 * Pack columns for static Probity tables (same algorithm as DataTable, no toolbar/pagination).
 */
export function buildResponsiveProbityTableColumns({
  sourceColumns = [],
  rows = [],
  containerWidth = 0,
  columnVisibility = {},
  expandedRowKeys = new Set(),
  toggleRowExpanded = () => {},
  resolveRowKey = (_row, index) => index,
  t = (key, opts) => opts?.defaultValue ?? key,
}) {
  const enrichedColumns = sourceColumns.map(mapStaticProbityTableColumn)
  const columnContentHints = measureDataTableColumnContent(sourceColumns, rows)

  const layoutInput = enrichedColumns.map((column, index) => {
    const source = column._source ?? column
    const hint = columnContentHints[column.columnId]
    const minWidth = resolveDataTableColumnMinWidth(source, hint)
    return {
      columnId: column.columnId,
      minWidth,
      maxWidth: resolveDataTableColumnMaxWidth(source, hint, minWidth),
      priority: getDataTableColumnPriority(source, index),
      pinned: isDataTableColumnPinned(source),
      growScore: getDataTableColumnGrowScore(source),
      manuallyVisible: columnVisibility[column.columnId] !== false,
    }
  })

  const layout = computeDataTableColumnLayout({
    columns: layoutInput,
    containerWidth,
  })

  const byId = new Map(enrichedColumns.map((col) => [col.columnId, col]))
  const main = layout.mainColumnIds.map((id) => byId.get(id)).filter(Boolean)
  const overflow = layout.overflowColumnIds.map((id) => byId.get(id)).filter(Boolean)

  const rowCount = Array.isArray(rows) ? rows.length : 0
  const showExpandColumn = layout.showExpandColumn && rowCount > 0

  let mainWithExpand = attachResponsiveWidths(main, layout.columnWidths)
  if (showExpandColumn) {
    const expandCol = buildExpandColumn({
      expandedRowKeys,
      toggleRowExpanded,
      resolveRowKey,
      t,
    })
    expandCol.responsiveWidth = layout.columnWidths?.[DATATABLE_EXPAND_COLUMN_ID] ?? 44
    const serialIdx = main.findIndex(
      (col) =>
        col._source?.isSerial
        || col.columnId === DATATABLE_SERIAL_COLUMN_ID
        || col.columnId === '__layout_serial__',
    )
    const insertAt = serialIdx >= 0 ? serialIdx + 1 : 0
    mainWithExpand = [
      ...mainWithExpand.slice(0, insertAt),
      expandCol,
      ...mainWithExpand.slice(insertAt),
    ]
  }

  return {
    mainTableColumns: mainWithExpand,
    overflowTableColumns: overflow,
    showExpandColumn,
  }
}
