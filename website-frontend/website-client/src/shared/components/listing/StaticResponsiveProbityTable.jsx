import ProbityDataTable from './ProbityDataTable'
import { PROBITY_TABLE_DEFAULT_EMPTY_MESSAGE, PROBITY_TABLE_SHELL_CLASS } from './listingTableStyles'
import { useResponsiveProbityTableLayout } from './useResponsiveProbityTableLayout'

/**
 * Read-only / form-embedded tables with responsive packing and row accordion (no DataTable toolbar).
 */
export default function StaticResponsiveProbityTable({
  columns,
  data = [],
  keyExtractor,
  caption,
  emptyMessage = PROBITY_TABLE_DEFAULT_EMPTY_MESSAGE,
  loading = false,
  loadingMessage,
  loadingRows,
  error = null,
  className = '',
  tableClassName = '',
  getRowClassName,
  showRowNumbers = true,
  responsive = true,
  wrapHeaders = true,
  wrapCells = true,
  getOverflowColumnLabel,
  columnVisibility,
  getRowKey,
}) {
  const resolveRowKey =
    getRowKey ??
    ((row, index) => (keyExtractor ? keyExtractor(row, index) : row?.id ?? row?.idMask ?? index))

  const layout = useResponsiveProbityTableLayout({
    columns,
    rows: data,
    responsive,
    showRowNumbers,
    columnVisibility,
    getRowKey: resolveRowKey,
  })

  return (
    <div
      ref={layout.containerRef}
      className={`min-w-0 w-full overflow-hidden ${PROBITY_TABLE_SHELL_CLASS} ${className}`.trim()}
    >
      <ProbityDataTable
        columns={layout.mainTableColumns}
        data={data}
        keyExtractor={keyExtractor}
        caption={caption}
        emptyMessage={emptyMessage}
        loading={loading}
        loadingMessage={loadingMessage}
        loadingRows={loadingRows}
        error={error}
        showRowNumbers={showRowNumbers}
        shellClassName="!rounded-none !border-0"
        tableClassName={tableClassName}
        getRowClassName={getRowClassName}
        responsiveNoScroll={layout.responsiveActive}
        overflowColumns={layout.overflowTableColumns}
        expandedRowKeys={layout.expandedRowKeys}
        wrapHeaders={wrapHeaders}
        wrapCells={wrapCells || layout.responsiveActive}
        fillWidth={!layout.responsiveActive}
        getOverflowColumnLabel={
          getOverflowColumnLabel ?? ((col) => col.detailLabel ?? col.label)
        }
      />
    </div>
  )
}
