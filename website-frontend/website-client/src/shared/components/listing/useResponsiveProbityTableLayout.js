import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDataTableContainerWidth } from '@/shared/components/DataTable/useDataTableContainerWidth'
import {
  buildResponsiveProbityTableColumns,
  mapStaticProbityTableColumn,
} from './buildResponsiveProbityTableColumns'
import { withLayoutSerialColumn } from './layoutTableColumns'

/**
 * Responsive column packing + row accordion for static Probity tables (not full DataTable).
 */
export function useResponsiveProbityTableLayout({
  columns = [],
  rows = [],
  responsive = true,
  showRowNumbers = false,
  columnVisibility = {},
  getRowKey = (row, index) => row?.id ?? row?.idMask ?? index,
}) {
  const { t } = useTranslation()
  const responsiveActive = responsive
  const { containerRef, containerWidth } = useDataTableContainerWidth(responsiveActive)
  const [expandedRowKeys, setExpandedRowKeys] = useState(() => new Set())

  const toggleRowExpanded = useCallback((key) => {
    setExpandedRowKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const layoutSourceColumns = useMemo(
    () => withLayoutSerialColumn(columns, showRowNumbers),
    [columns, showRowNumbers],
  )

  const mappedColumns = useMemo(
    () => layoutSourceColumns.map(mapStaticProbityTableColumn),
    [layoutSourceColumns],
  )

  const { mainTableColumns, overflowTableColumns, showExpandColumn } = useMemo(() => {
    if (!responsiveActive) {
      return {
        mainTableColumns: mappedColumns,
        overflowTableColumns: [],
        showExpandColumn: false,
      }
    }

    if (containerWidth <= 0) {
      return {
        mainTableColumns: mappedColumns,
        overflowTableColumns: [],
        showExpandColumn: false,
      }
    }

    return buildResponsiveProbityTableColumns({
      sourceColumns: layoutSourceColumns,
      rows,
      containerWidth,
      columnVisibility,
      expandedRowKeys,
      toggleRowExpanded,
      resolveRowKey: getRowKey,
      t,
    })
  }, [
    columnVisibility,
    containerWidth,
    expandedRowKeys,
    getRowKey,
    mappedColumns,
    responsiveActive,
    rows,
    t,
    toggleRowExpanded,
    layoutSourceColumns,
  ])

  return {
    containerRef,
    responsiveActive,
    mainTableColumns,
    overflowTableColumns,
    expandedRowKeys,
    toggleRowExpanded,
    showExpandColumn,
  }
}
