import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronsUpDown, ChevronDown, ChevronRight } from 'lucide-react'
import { resolveTableColumnHeader } from '@/shared/components/display/resolveTableColumnHeader'
import ProbityDataTable from '@/shared/components/listing/ProbityDataTable'
import {
  PROBITY_TABLE_HEADER_TEXT_CLASS,
  PROBITY_TABLE_SHELL_CLASS,
} from '@/shared/components/listing/listingTableStyles'
import {
  isSerialColumn,
  TABLE_SERIAL_COLUMN_CLASS,
  TABLE_SERIAL_HEADER,
} from '@/shared/components/listing/tableSerial'
import {
  currencyColumnClassName,
  formatTableCellValue,
  isCurrencyColumn,
  isDateColumn,
} from '@/shared/utils/tableColumnFormat'
import { formCheckboxControlClass } from '@/shared/components/typography/typographyStyles'
import DataTableToolbar from './DataTableToolbar'
import TablePaginationBar from './TablePaginationBar'
import {
  resolveTableColumnAlign,
  stripTextAlignClasses,
  tableHeaderFlexJustifyClass,
} from '@/shared/components/listing/tableColumnAlign'
import { getDataTableCellValue } from './dataTableCellValue'
import { computeDataTableColumnLayout } from './computeDataTableColumnLayout'
import {
  buildDefaultColumnVisibility,
  DATATABLE_EXPAND_COLUMN_ID,
  DATATABLE_SERIAL_COLUMN_ID,
  getDataTableColumnId,
  getDataTableColumnLabel,
  getDataTableColumnGrowScore,
  getDataTableColumnPriority,
  isDataTableColumnHideable,
  isDataTableColumnPinned,
} from './dataTableColumnConfig'
import { measureDataTableColumnContent } from './measureDataTableColumnContent'
import {
  resolveDataTableColumnMaxWidth,
  resolveDataTableColumnMinWidth,
} from './resolveDataTableColumnSizing'
import DataTableColumnVisibilityMenu from './DataTableColumnVisibilityMenu'
import { useDataTableContainerWidth } from './useDataTableContainerWidth'

const rowSelectCheckboxClass = formCheckboxControlClass

function RowSelectCheckbox({ checked, indeterminate = false, onChange, name, 'aria-label': ariaLabel }) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate
    }
  }, [indeterminate])

  return (
    <input
      ref={inputRef}
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className={rowSelectCheckboxClass}
      aria-label={ariaLabel}
    />
  )
}

function getCellValue(row, column) {
  return getDataTableCellValue(row, column)
}

/**
 * Server-side listing table. Column API: `header`, `id`, `accessor`, `cell`, `sortable`,
 * `headerClassName`, `cellClassName`, `align` (`left` | `center` | `right`, preferred),
 * `format` (`currency` | `date`), `priority`, `minWidth` / `responsiveMinWidth`,
 * `hideable`, `defaultVisible`, `pinned`.
 */
export default function DataTable({
  columns,
  rows,
  rowKey = 'id',
  search = '',
  onSearchChange,
  page = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
  onPageSizeChange,
  sort = { sortBy: null, sortDir: 'asc' },
  onSortChange,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  emptyMessage,
  pageSizeOptions,
  showToolbarPrefix = true,
  toolbarExtra = null,
  loading = false,
  className = '',
  tableClassName = '',
  tableContainerClassName = '',
  horizontalScroll = false,
  responsiveColumns = true,
  enableColumnVisibility = true,
  wrapHeaders = false,
  wrapCells = false,
  fillWidth = true,
  showRowNumbers = false,
}) {
  const { t } = useTranslation()
  const resolvedEmptyMessage = emptyMessage ?? t('home.empty')
  const responsiveActive = responsiveColumns && !horizontalScroll
  const { containerRef, containerWidth } = useDataTableContainerWidth(responsiveActive)

  const defaultVisibility = useMemo(() => buildDefaultColumnVisibility(columns), [columns])
  const [columnVisibility, setColumnVisibility] = useState(defaultVisibility)
  const [expandedRowKeys, setExpandedRowKeys] = useState(() => new Set())

  useEffect(() => {
    setColumnVisibility((prev) => {
      const next = { ...defaultVisibility }
      Object.keys(prev).forEach((id) => {
        if (Object.prototype.hasOwnProperty.call(next, id)) {
          next[id] = prev[id]
        }
      })
      return next
    })
  }, [defaultVisibility])

  const hideableMenuColumns = useMemo(
    () =>
      columns
        .filter(isDataTableColumnHideable)
        .map((column) => ({
          id: getDataTableColumnId(column),
          label: getDataTableColumnLabel(column),
        })),
    [columns],
  )

  const showColumnMenu = enableColumnVisibility && hideableMenuColumns.length > 0
  const showToolbarSearch = onSearchChange != null
  const showToolbar =
    showToolbarSearch ||
    onPageSizeChange != null ||
    showColumnMenu ||
    toolbarExtra != null

  const handlePageChange = onPageChange ?? (() => {})
  const handlePageSizeChange = useCallback(
    (nextSize) => {
      if (!onPageSizeChange) return
      onPageSizeChange(nextSize)
      if (onPageChange && total > 0) {
        const maxPages = Math.ceil(total / nextSize)
        if (page > maxPages) {
          onPageChange(Math.max(1, maxPages))
        }
      }
    },
    [onPageChange, onPageSizeChange, page, total],
  )
  const rowIds = rows.map((row) => row[rowKey])
  const allSelected =
    rowIds.length > 0 && rowIds.every((id) => selectedIds.includes(id))
  const someSelected =
    rowIds.some((id) => selectedIds.includes(id)) && !allSelected

  const isLoading =
    loading || (rows.length === 0 && /loading/i.test(String(resolvedEmptyMessage)))

  const handleToggleAll = useCallback(
    (checked) => {
      if (!onSelectionChange) return
      if (checked) {
        onSelectionChange([...new Set([...selectedIds, ...rowIds])])
        return
      }
      onSelectionChange(selectedIds.filter((id) => !rowIds.includes(id)))
    },
    [onSelectionChange, rowIds, selectedIds],
  )

  const handleToggleRow = useCallback(
    (id, checked) => {
      if (!onSelectionChange) return
      if (checked) {
        onSelectionChange([...new Set([...selectedIds, id])])
        return
      }
      onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id))
    },
    [onSelectionChange, selectedIds],
  )

  const handleSort = useCallback(
    (column) => {
      if (!column.sortable || !onSortChange) return
      if (sort.sortBy === column.id) {
        onSortChange({
          sortBy: column.id,
          sortDir: sort.sortDir === 'asc' ? 'desc' : 'asc',
        })
        return
      }
      onSortChange({ sortBy: column.id, sortDir: 'asc' })
    },
    [onSortChange, sort.sortBy, sort.sortDir],
  )

  const toggleRowExpanded = useCallback((key) => {
    setExpandedRowKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const enrichedColumns = useMemo(() => {
    const mapOne = (column, sourceColumn) => {
      const currencyCol = isCurrencyColumn(column)
      const dateCol = isDateColumn(column)
      const resolvedCellClassName = stripTextAlignClasses(
        currencyCol
          ? currencyColumnClassName(column.cellClassName ?? '')
          : (column.cellClassName ?? ''),
      )
      const resolvedHeaderClassName = stripTextAlignClasses(
        currencyCol
          ? currencyColumnClassName(column.headerClassName ?? '')
          : (column.headerClassName ?? ''),
      )

      const headerLabel = resolveTableColumnHeader(column)

      const align = resolveTableColumnAlign(column)
      const headerJustify = tableHeaderFlexJustifyClass(align)

      const headerTextClass = PROBITY_TABLE_HEADER_TEXT_CLASS
      const header = column.sortable ? (
        <button
          type="button"
          onClick={() => handleSort(column)}
          className={`inline-flex w-full min-w-0 max-w-full items-center gap-1 ${headerJustify}`}
        >
          <span
            className={`min-w-0 flex-1 text-start ${headerTextClass} ${
              wrapHeaders ? '' : 'truncate'
            }`}
          >
            {headerLabel}
          </span>
          <ChevronsUpDown
            size={14}
            className={`shrink-0 ${sort.sortBy === column.id ? 'text-[#01458e]' : 'text-slate-700'}`}
            aria-hidden
          />
        </button>
      ) : wrapHeaders && typeof column.header === 'string' ? (
        <span
          className={`inline-block w-full min-w-0 max-w-full ${headerTextClass} ${
            align === 'center' ? 'mx-auto text-center' : align === 'right' ? 'ml-auto text-end' : 'text-start'
          }`}
        >
          {headerLabel}
        </span>
      ) : typeof column.header === 'string' ? (
        <span className={`inline-block w-full min-w-0 ${headerTextClass}`}>{headerLabel}</span>
      ) : (
        headerLabel
      )

      const columnId = getDataTableColumnId(column)

      return {
        columnId,
        detailLabel: getDataTableColumnLabel(column),
        header,
        align,
        className: resolvedCellClassName,
        headerClassName: resolvedHeaderClassName,
        fillColumn: column.fillColumn === true,
        _source: sourceColumn ?? column,
        render: (row, rowIndex, rowNumber) => {
          if (column.cell) {
            return column.cell(row)
          }
          const raw = getCellValue(row, column)
          if (currencyCol || dateCol) {
            return formatTableCellValue(column, raw)
          }
          return raw ?? ''
        },
      }
    }

    let mapped = columns.map((column) => mapOne(column, column))

    const withSerial = columns.some(isSerialColumn)
      ? mapped
      : [
          mapOne(
            {
              header: TABLE_SERIAL_HEADER,
              isSerial: true,
              ...TABLE_SERIAL_COLUMN_CLASS,
            },
            { isSerial: true },
          ),
          ...mapped,
        ]

    if (withSerial[0]?.columnId === DATATABLE_SERIAL_COLUMN_ID || withSerial[0]?.isSerial) {
      withSerial[0].columnId = DATATABLE_SERIAL_COLUMN_ID
    }

    withSerial[0].render = (_row, index) =>
      (Number(page) > 0 ? Number(page) - 1 : 0) * (Number(pageSize) > 0 ? Number(pageSize) : 10) +
      index +
      1

    if (!selectable) {
      return withSerial
    }

    const selectColumn = mapOne(
      {
        isSelect: true,
        header: (
          <RowSelectCheckbox
            name="select-all"
            checked={allSelected}
            indeterminate={someSelected}
            onChange={(event) => handleToggleAll(event.target.checked)}
            aria-label={t('table.selectAll', { defaultValue: 'Select all rows' })}
          />
        ),
        align: 'center',
      },
      { isSelect: true },
    )
    selectColumn.render = (row) => {
      const id = row[rowKey]
      return (
        <RowSelectCheckbox
          name={`select-${id}`}
          checked={selectedIds.includes(id)}
          onChange={(event) => handleToggleRow(id, event.target.checked)}
          aria-label={t('table.selectRow', { defaultValue: 'Select row' })}
        />
      )
    }

    return [withSerial[0], selectColumn, ...withSerial.slice(1)]
  }, [
    allSelected,
    columns,
    handleSort,
    handleToggleAll,
    handleToggleRow,
    page,
    pageSize,
    rowKey,
    selectable,
    selectedIds,
    someSelected,
    sort.sortBy,
    t,
    wrapHeaders,
  ])

  const columnContentHints = useMemo(
    () => (responsiveActive ? measureDataTableColumnContent(columns, rows) : {}),
    [columns, rows, responsiveActive],
  )

  const { mainTableColumns, overflowTableColumns, showExpandColumn } = useMemo(() => {
    if (!responsiveActive) {
      return {
        mainTableColumns: enrichedColumns,
        overflowTableColumns: [],
        showExpandColumn: false,
      }
    }

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

    const attachResponsiveWidths = (cols) =>
      cols.map((col) => {
        const width = layout.columnWidths?.[col.columnId]
        if (width == null || !Number.isFinite(width)) return col
        return { ...col, responsiveWidth: width }
      })

    let mainWithExpand = attachResponsiveWidths(main)
    const showExpandColumn = layout.showExpandColumn && rows.length > 0
    if (showExpandColumn) {
      const expandCol = {
        columnId: DATATABLE_EXPAND_COLUMN_ID,
        isExpandToggle: true,
        responsiveWidth: layout.columnWidths?.[DATATABLE_EXPAND_COLUMN_ID] ?? 44,
        header: (
          <span className="sr-only">
            {t('table.rowDetails', { defaultValue: 'Row details' })}
          </span>
        ),
        align: 'center',
        headerClassName: 'w-[44px] min-w-[44px] max-w-[44px]',
        className: 'w-[44px] min-w-[44px] max-w-[44px]',
        render: (row, index) => {
          const key = row?.[rowKey] ?? index
          const expanded = expandedRowKeys.has(key)
          return (
            <button
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#01458e]"
              aria-expanded={expanded}
              aria-label={
                expanded
                  ? t('table.hideRowDetails', { defaultValue: 'Hide row details' })
                  : t('table.showRowDetails', { defaultValue: 'Show row details' })
              }
              onClick={() => toggleRowExpanded(key)}
            >
              {expanded ? <ChevronDown size={18} aria-hidden /> : <ChevronRight size={18} aria-hidden />}
            </button>
          )
        },
      }
      const serialIdx = main.findIndex(
        (col) =>
          col.columnId === DATATABLE_SERIAL_COLUMN_ID
          || col.columnId === '__layout_serial__'
          || col._source?.isSerial,
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
  }, [
    columnContentHints,
    columnVisibility,
    containerWidth,
    enrichedColumns,
    expandedRowKeys,
    responsiveActive,
    rowKey,
    rows.length,
    t,
    toggleRowExpanded,
  ])

  const handleToggleColumnVisibility = useCallback((columnId, visible) => {
    setColumnVisibility((prev) => ({ ...prev, [columnId]: visible }))
  }, [])

  const handleSelectAllColumns = useCallback(() => {
    setColumnVisibility((prev) => {
      const next = { ...prev }
      hideableMenuColumns.forEach((col) => {
        next[col.id] = true
      })
      return next
    })
  }, [hideableMenuColumns])

  const handleResetColumns = useCallback(() => {
    setColumnVisibility({ ...defaultVisibility })
  }, [defaultVisibility])

  const columnVisibilityMenu = showColumnMenu ? (
    <DataTableColumnVisibilityMenu
      columns={hideableMenuColumns}
      visibility={columnVisibility}
      onToggleColumn={handleToggleColumnVisibility}
      onSelectAll={handleSelectAllColumns}
      onReset={handleResetColumns}
    />
  ) : null

  return (
    <div className={`min-w-0 w-full ${className}`.trim()}>
      {showToolbar ? (
        <DataTableToolbar
          pageSize={pageSize}
          onPageSizeChange={onPageSizeChange ? handlePageSizeChange : undefined}
          search={search}
          onSearchChange={showToolbarSearch ? onSearchChange : undefined}
          hideSearch={!onSearchChange}
          pageSizeOptions={pageSizeOptions}
          showPrefix={showToolbarPrefix}
          toolbarExtra={toolbarExtra}
          columnVisibilityMenu={columnVisibilityMenu}
        />
      ) : null}

      <div
        ref={responsiveActive ? containerRef : undefined}
        className={`${PROBITY_TABLE_SHELL_CLASS} overflow-hidden ${tableContainerClassName}`.trim()}
      >
        <ProbityDataTable
          columns={mainTableColumns}
          data={rows}
          keyExtractor={(row, index) => row?.[rowKey] ?? index}
          emptyMessage={isLoading ? 'Loading records…' : resolvedEmptyMessage}
          loading={isLoading}
          loadingMessage="Loading records…"
          shellClassName="!rounded-none !border-0"
          tableClassName={tableClassName}
          horizontalScroll={horizontalScroll && !responsiveActive}
          responsiveNoScroll={responsiveActive}
          overflowColumns={overflowTableColumns}
          expandedRowKeys={expandedRowKeys}
          wrapHeaders={wrapHeaders}
          wrapCells={wrapCells || responsiveActive}
          fillWidth={responsiveActive ? false : fillWidth}
          showRowNumbers={false}
          getRowClassName={(row) =>
            selectedIds.includes(row[rowKey]) ? 'bg-sky-50/80 dark:bg-slate-900/80' : ''
          }
          getOverflowColumnLabel={(col) => col.detailLabel}
        />
        <div className="border-t border-slate-100 bg-slate-50/90 px-2 py-3 sm:px-4 dark:border-slate-700 dark:bg-slate-900/30">
          <TablePaginationBar
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  )
}
