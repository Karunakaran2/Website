import { FileSpreadsheet } from 'lucide-react'
import { PageToolbarGigwButton, PageToolbarSelect } from '@/shared/components/page/PageToolbarFields'

/** Page header filter and export only — list search lives on {@link DataTable} toolbar (Probity). */
export default function ListPageHeaderActions({
  filterLabel = 'Filter',
  filterValue,
  filterOptions,
  onFilterChange,
  onExport,
  exportLabel = 'Export',
}) {
  const showFilter = filterOptions && filterOptions.length > 0 && onFilterChange
  const showExport = typeof onExport === 'function'

  if (!showFilter && !showExport) {
    return null
  }

  return (
    <div className="flex w-full min-w-0 max-w-full flex-wrap items-center justify-start gap-2 sm:flex-nowrap sm:justify-end">
      {showFilter ? (
        <PageToolbarSelect
          label={filterLabel}
          name="pageHeaderFilter"
          value={filterValue}
          options={filterOptions}
          onChange={onFilterChange}
          minWidth="!w-[11.5rem] shrink-0"
          wrapperClassName="max-w-[calc(100vw-2.5rem)]"
        />
      ) : null}

      {showExport ? (
        <PageToolbarGigwButton
          type="button"
          variant="excel"
          icon={FileSpreadsheet}
          onClick={onExport}
          aria-label={exportLabel}
        >
          {exportLabel}
        </PageToolbarGigwButton>
      ) : null}
    </div>
  )
}
