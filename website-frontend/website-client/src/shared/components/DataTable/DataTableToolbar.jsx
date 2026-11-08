import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  DATATABLE_TOOLBAR_PAGE_SIZE_SELECT_CLASS,
  DATATABLE_TOOLBAR_PAGE_SIZE_WRAPPER_CLASS,
  DATATABLE_TOOLBAR_SEARCH_INPUT_CLASS,
} from '@/shared/components/DataTable/dataTableToolbarStyles'
import { TABLE_CHROME_TEXT_CLASS } from '@/shared/components/listing/listingTableStyles'
import { FeaturedBasicSelect, Input } from '@/shared/lib/tailwreck'
import { resolveSelectValue, useDebouncedValue } from '@/shared/utils'

const PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10' },
  { value: '25', label: '25' },
  { value: '50', label: '50' },
  { value: '100', label: '100' },
]

const DEFAULT_PAGE_SIZE = 10

/**
 * Probity layout: rows-per-page (left); Search + Columns menu grouped on the right.
 */
export default function DataTableToolbar({
  pageSize,
  onPageSizeChange,
  search,
  onSearchChange,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  showPrefix = true,
  hideSearch = false,
  toolbarExtra = null,
  columnVisibilityMenu = null,
}) {
  const { t } = useTranslation()
  const [draftSearch, setDraftSearch] = useState(search ?? '')
  const debouncedSearch = useDebouncedValue(draftSearch, 300)

  const normalizedOptions = useMemo(() => {
    const raw = pageSizeOptions && pageSizeOptions.length > 0 ? pageSizeOptions : PAGE_SIZE_OPTIONS
    return raw.map((opt) => {
      if (typeof opt === 'object' && opt !== null) {
        const val = opt.value ?? opt.id
        return {
          value: String(val),
          label: String(opt.label ?? val),
        }
      }
      return { value: String(opt), label: String(opt) }
    })
  }, [pageSizeOptions])

  const resolvedPageSize = Number(pageSize) > 0 ? Number(pageSize) : DEFAULT_PAGE_SIZE
  const selectValue = String(resolvedPageSize)
  const selectValueInOptions = normalizedOptions.some((opt) => opt.value === selectValue)
    ? selectValue
    : normalizedOptions[0]?.value ?? '10'

  useEffect(() => {
    setDraftSearch(search ?? '')
  }, [search])

  useEffect(() => {
    if (!onSearchChange || debouncedSearch === (search ?? '')) {
      return
    }
    onSearchChange(debouncedSearch)
  }, [debouncedSearch, onSearchChange, search])

  const showSearch = !hideSearch && onSearchChange != null
  const showRightCluster = showSearch || columnVisibilityMenu != null

  return (
    <div className="mb-3 flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div
        className={`flex min-w-0 flex-nowrap items-center gap-2 overflow-x-auto ${TABLE_CHROME_TEXT_CLASS}`}
      >
        {showPrefix ? <span className="shrink-0">{t('common.show', { defaultValue: 'Show' })}</span> : null}
        <div className={DATATABLE_TOOLBAR_PAGE_SIZE_WRAPPER_CLASS}>
          <FeaturedBasicSelect
            name="pageSize"
            options={normalizedOptions}
            value={selectValueInOptions}
            onChange={(value) => {
              if (!onPageSizeChange) return
              const next = Number(resolveSelectValue(value))
              if (Number.isFinite(next) && next > 0) onPageSizeChange(next)
            }}
            size="sm"
            theme="primary"
            border="sm"
            className={DATATABLE_TOOLBAR_PAGE_SIZE_SELECT_CLASS}
          />
        </div>
        {showPrefix ? (
          <span className="shrink-0">{t('common.entriesPerPage', { defaultValue: 'entries per page' })}</span>
        ) : null}
        {toolbarExtra}
      </div>

      {showRightCluster ? (
        <div
          className={`flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap sm:justify-end ${TABLE_CHROME_TEXT_CLASS}`}
        >
          {showSearch ? (
            <>
              <label htmlFor="datatable-search" className="shrink-0 font-medium">
                {t('common.search', { defaultValue: 'Search' })}
              </label>
              <div className="w-full min-w-[180px] max-w-[240px] sm:w-[220px] [&_label]:hidden">
                <Input
                  id="datatable-search"
                  name="search"
                  type="text"
                  maxLength={100}
                  value={draftSearch}
                  onChange={(event) => setDraftSearch(event.target.value)}
                  size="sm"
                  theme="primary"
                  className={DATATABLE_TOOLBAR_SEARCH_INPUT_CLASS}
                />
              </div>
            </>
          ) : null}
          {columnVisibilityMenu}
        </div>
      ) : null}
    </div>
  )
}
