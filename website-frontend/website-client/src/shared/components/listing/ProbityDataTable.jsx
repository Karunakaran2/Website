import React, { useMemo, useState } from 'react'
import TablePaginationBar from '../DataTable/TablePaginationBar'
import ProbityTableSkeletonBody from '../skeleton/ProbityTableSkeletonBody'
import {
  isSerialColumn,
  TABLE_SERIAL_COLUMN_CLASS,
  TABLE_SERIAL_HEADER,
  TABLE_SERIAL_WIDTH_PX,
  TABLE_SERIAL_WIDTH_CLASS,
} from './tableSerial'
import {
  PROBITY_TABLE_BODY_CLIP_CLASS,
  PROBITY_TABLE_BODY_SCROLL_CLASS,
  PROBITY_TABLE_RESPONSIVE_CLASS,
  PROBITY_TABLE_CLASS,
  PROBITY_TABLE_DEFAULT_EMPTY_MESSAGE,
  PROBITY_TABLE_EMPTY_CLASS,
  PROBITY_TABLE_WIDE_CLASS,
  PROBITY_TABLE_HEAD_CLASS,
  PROBITY_TABLE_HEAD_ROW_CLASS,
  PROBITY_TABLE_ROW_CLASS,
  PROBITY_TABLE_SHELL_CLASS,
  PROBITY_TABLE_TD_CLASS,
  PROBITY_TABLE_TD_WRAP_CLASS,
  PROBITY_TABLE_TH_CLASS,
  PROBITY_TABLE_TH_INNER_CLASS,
  PROBITY_TABLE_TH_WRAP_CLASS,
  TABLE_DATA_COLUMN_CLASS,
  TABLE_LAST_COLUMN_SHRINK_CLASS,
} from './listingTableStyles'
import {
  resolveTableColumnAlign,
  stripTextAlignClasses,
  tableAlignClassName,
} from './tableColumnAlign'
import { formLabelClass } from '@/shared/components/typography/typographyStyles'
import { renderProbityTableHeaderCell } from '@/shared/components/display/resolveTableColumnHeader'
import { DATATABLE_EXPAND_COLUMN_ID } from '@/shared/components/DataTable/dataTableColumnConfig'
import {
  probityTableCellInnerClass,
  probityTableCellsShouldWrap,
  probityTableColumnIsFixedWidth,
  probityTableOverflowDetailLabelNode,
  PROBITY_TABLE_OVERFLOW_DETAIL_VALUE_CLASS,
} from './probityTableCellPresentation'

function columnSkipsLastColumnShrink(col) {
  return probityTableColumnIsFixedWidth(col)
}

function columnShouldGrow(col) {
  if (col.fillColumn) return true
  const classNames = `${col.className ?? ''} ${col.headerClassName ?? ''}`
  return /\btable-col-grow\b/.test(classNames) || /\b!w-full\b/.test(classNames)
}

/**
 * Shared Probity listing table.
 * columns: { header, key?, align?, className?, render?(row, index, rowNumber) }
 */
export default function ProbityDataTable({
  columns,
  data = [],
  keyExtractor,
  caption,
  emptyMessage = PROBITY_TABLE_DEFAULT_EMPTY_MESSAGE,
  loading = false,
  loadingMessage = 'Loading records…',
  loadingRows,
  error = null,
  showRowNumbers = true,
  withPagination = false,
  defaultRowsPerPage = 10,
  rowsPerPageOptions = [5, 10, 25, 50],
  currentPage: controlledPage,
  rowsPerPage: controlledRowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  className = '',
  tableClassName = '',
  shellClassName = '',
  getRowClassName,
  /** When true, table keeps natural column widths and scrolls if wider than the card. */
  horizontalScroll = false,
  wrapHeaders = false,
  /** When true, long cell text wraps (default). Set false for legacy content-width cells. */
  wrapCells = true,
  /** When true, last column shrinks to content so the table uses full card width. */
  fillWidth = true,
  /** When true, disable horizontal scroll and clip to container (responsive DataTable). */
  responsiveNoScroll = false,
  /** Columns shown in expandable row details when they do not fit the main row. */
  overflowColumns = [],
  expandedRowKeys = null,
  onToggleRowExpanded = null,
  getOverflowColumnLabel = null,
}) {
  const [internalPage, setInternalPage] = useState(1)
  const [internalRowsPerPage, setInternalRowsPerPage] = useState(defaultRowsPerPage)

  const currentPage = controlledPage ?? internalPage
  const rowsPerPage = controlledRowsPerPage ?? internalRowsPerPage

  const paginatedData = useMemo(() => {
    if (!withPagination) return data
    const start = (currentPage - 1) * rowsPerPage
    return data.slice(start, start + rowsPerPage)
  }, [data, currentPage, rowsPerPage, withPagination])

  const displayColumns = useMemo(() => {
    if (!showRowNumbers || columns.some(isSerialColumn)) return columns
    const serialColumn = {
      header: TABLE_SERIAL_HEADER,
      isSerial: true,
      columnId: '__layout_serial__',
      ...TABLE_SERIAL_COLUMN_CLASS,
      render: (_row, index) =>
        withPagination ? (currentPage - 1) * rowsPerPage + index + 1 : index + 1,
    }
    serialColumn.responsiveMinWidth = TABLE_SERIAL_WIDTH_PX
    serialColumn.minWidth = TABLE_SERIAL_WIDTH_PX
    if (responsiveNoScroll) {
      serialColumn.responsiveWidth = serialColumn.responsiveWidth ?? TABLE_SERIAL_WIDTH_PX
    }
    return [serialColumn, ...columns]
  }, [columns, responsiveNoScroll, showRowNumbers, withPagination, currentPage, rowsPerPage])

  const handlePageChange = (page) => {
    if (onPageChange) onPageChange(page)
    else setInternalPage(page)
  }

  const handleRowsChange = (value) => {
    if (onRowsPerPageChange) onRowsPerPageChange(value)
    else setInternalRowsPerPage(value)
    handlePageChange(1)
  }

  const hasOverflowDetails = overflowColumns.length > 0
  const colSpan = displayColumns.length
  const lastColumnIndex = displayColumns.length - 1
  const cellsShouldWrap = probityTableCellsShouldWrap({ wrapCells, responsiveNoScroll })
  const responsiveCellClamp = cellsShouldWrap ? 'min-w-0' : ''

  const isSerialDisplayColumn = (col) => col?.isSerial || isSerialColumn(col)

  const lastColumnShrinkClass = (col, colIdx) => {
    if (!fillWidth || colIdx !== lastColumnIndex || columnShouldGrow(col)) {
      return ''
    }
    if (columnSkipsLastColumnShrink(col)) {
      return ''
    }
    return TABLE_LAST_COLUMN_SHRINK_CLASS
  }

  const dataColumnWidthClass = (col, colIdx) => {
    if (responsiveNoScroll && col.responsiveWidth != null) {
      return ''
    }
    if (colIdx === lastColumnIndex || columnShouldGrow(col)) {
      return ''
    }
    return TABLE_DATA_COLUMN_CLASS
  }

  const responsiveCellStyle = (col) => {
    if (!responsiveNoScroll || col.responsiveWidth == null) return undefined
    const px = Math.round(col.responsiveWidth)
    if (probityTableColumnIsFixedWidth(col)) {
      return { width: px, minWidth: px, maxWidth: px }
    }
    return { width: px, minWidth: px }
  }

  const resolveColWidthPx = (col) => {
    if (col.responsiveWidth != null && Number.isFinite(col.responsiveWidth)) {
      return Math.round(col.responsiveWidth)
    }
    if (col.isSerial || isSerialColumn(col)) return TABLE_SERIAL_WIDTH_PX
    if (col.isExpandToggle || col.columnId === DATATABLE_EXPAND_COLUMN_ID) return 44
    return null
  }

  const responsiveWidthsReady =
    responsiveNoScroll &&
    displayColumns.length > 0 &&
    displayColumns.every((col) => resolveColWidthPx(col) != null)

  const colGroup =
    responsiveWidthsReady ? (
      <colgroup>
        {displayColumns.map((col, idx) => {
          const px = resolveColWidthPx(col)
          return (
            <col
              key={`col-${col.columnId ?? col.key ?? idx}`}
              style={px != null ? { width: px, minWidth: px } : undefined}
            />
          )
        })}
      </colgroup>
    ) : null

  const bodyRows = () => {
    if (loading) {
      return (
        <>
          <ProbityTableSkeletonBody
            rows={loadingRows ?? Math.min(rowsPerPage, 8)}
            columns={colSpan}
          />
          <tr className="sr-only">
            <td colSpan={colSpan}>{loadingMessage}</td>
          </tr>
        </>
      )
    }
    if (error) {
      return (
        <tr>
          <td colSpan={colSpan} className={`${PROBITY_TABLE_EMPTY_CLASS} text-rose-600`}>
            {error}
          </td>
        </tr>
      )
    }
    if (data.length === 0) {
      return (
        <tr>
          <td colSpan={colSpan} className={PROBITY_TABLE_EMPTY_CLASS}>
            {emptyMessage}
          </td>
        </tr>
      )
    }

    return paginatedData.map((row, index) => {
      const rowNumber = withPagination ? (currentPage - 1) * rowsPerPage + index + 1 : index + 1
      const rowKey = keyExtractor ? keyExtractor(row, index) : row.id ?? index

      const extraRowClass = getRowClassName ? getRowClassName(row, index) : ''
      const tdBaseClass = cellsShouldWrap ? PROBITY_TABLE_TD_WRAP_CLASS : PROBITY_TABLE_TD_CLASS
      const isExpanded =
        expandedRowKeys instanceof Set
          ? expandedRowKeys.has(rowKey)
          : Boolean(expandedRowKeys?.[rowKey])

      return (
        <React.Fragment key={rowKey}>
          <tr className={`${PROBITY_TABLE_ROW_CLASS} ${extraRowClass}`.trim()}>
            {displayColumns.map((col, colIdx) => {
              const align = resolveTableColumnAlign(col)
              const cellExtra = stripTextAlignClasses(col.className || '')
              return (
                <td
                  key={`${rowKey}-${colIdx}`}
                  style={responsiveCellStyle(col)}
                  className={`${tdBaseClass} ${tableAlignClassName(align)} ${isSerialDisplayColumn(col) ? TABLE_SERIAL_WIDTH_CLASS : responsiveCellClamp} ${dataColumnWidthClass(col, colIdx)} ${lastColumnShrinkClass(col, colIdx)} ${cellExtra}`.trim()}
                >
                  <div className={cellsShouldWrap ? probityTableCellInnerClass(col) : undefined}>
                    {col.render ? col.render(row, index, rowNumber) : col.key ? row[col.key] : null}
                  </div>
                </td>
              )
            })}
          </tr>
          {hasOverflowDetails && isExpanded ? (
            <tr className="border-b border-slate-100 bg-slate-50/90 dark:border-slate-800 dark:bg-slate-900/40">
              <td colSpan={colSpan} className="px-3 py-3 sm:px-4">
                <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {overflowColumns.map((col, colIdx) => {
                    const labelNode = probityTableOverflowDetailLabelNode(col, getOverflowColumnLabel)
                    const align = resolveTableColumnAlign(col)
                    return (
                      <div key={`${rowKey}-overflow-${col.columnId ?? colIdx}`} className="min-w-0">
                        <dt className={`${formLabelClass} mb-0.5 text-slate-600`}>{labelNode}</dt>
                        <dd
                          className={`${PROBITY_TABLE_OVERFLOW_DETAIL_VALUE_CLASS} ${tableAlignClassName(align, { important: false })}`.trim()}
                        >
                          {col.render ? col.render(row, index, rowNumber) : col.key ? row[col.key] : null}
                        </dd>
                      </div>
                    )
                  })}
                </dl>
              </td>
            </tr>
          ) : null}
        </React.Fragment>
      )
    })
  }

  const thBaseClass =
    wrapHeaders || responsiveNoScroll || cellsShouldWrap
      ? PROBITY_TABLE_TH_WRAP_CLASS
      : PROBITY_TABLE_TH_CLASS
  const resolvedTableClass = [
    PROBITY_TABLE_CLASS,
    responsiveWidthsReady ? PROBITY_TABLE_RESPONSIVE_CLASS : '',
    horizontalScroll && !responsiveNoScroll ? PROBITY_TABLE_WIDE_CLASS : '',
    tableClassName,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={`min-w-0 w-full ${className}`.trim()}>
      <div className={`${PROBITY_TABLE_SHELL_CLASS} ${shellClassName}`.trim()}>
        <div className={responsiveNoScroll ? PROBITY_TABLE_BODY_CLIP_CLASS : PROBITY_TABLE_BODY_SCROLL_CLASS}>
          <table className={resolvedTableClass.trim()}>
            {caption ? <caption className="sr-only">{caption}</caption> : null}
            {colGroup}
            <thead className={PROBITY_TABLE_HEAD_CLASS}>
              <tr className={PROBITY_TABLE_HEAD_ROW_CLASS}>
                {displayColumns.map((col, idx) => {
                  const align = resolveTableColumnAlign(col)
                  const headerExtra = stripTextAlignClasses(col.headerClassName ?? '')
                  return (
                  <th
                    key={`th-${idx}`}
                    style={responsiveCellStyle(col)}
                    className={`${thBaseClass} ${tableAlignClassName(align)} ${isSerialDisplayColumn(col) ? TABLE_SERIAL_WIDTH_CLASS : responsiveCellClamp} ${dataColumnWidthClass(col, idx)} ${lastColumnShrinkClass(col, idx)} ${headerExtra} ${responsiveNoScroll && !isSerialDisplayColumn(col) ? 'overflow-hidden' : ''}`.trim()}
                  >
                    <div
                      className={`${PROBITY_TABLE_TH_INNER_CLASS} ${
                        align === 'center'
                          ? 'justify-center'
                          : align === 'right'
                            ? 'justify-end'
                            : 'justify-start'
                      } ${responsiveNoScroll && !isSerialDisplayColumn(col) ? 'max-w-full overflow-hidden' : ''}`.trim()}
                    >
                      {renderProbityTableHeaderCell(col)}
                    </div>
                  </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>{bodyRows()}</tbody>
          </table>
        </div>
        {withPagination && data.length > 0 && !loading && !error ? (
          <div className="border-t border-slate-100 bg-slate-50/90 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/30">
            <TablePaginationBar
              page={currentPage}
              pageSize={rowsPerPage}
              total={data.length}
              onPageChange={handlePageChange}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
