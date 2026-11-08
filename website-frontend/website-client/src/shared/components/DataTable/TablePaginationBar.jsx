import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import {
  TABLE_CHROME_TEXT_CLASS,
  TABLE_PAGINATION_BTN_ACTIVE_CLASS,
  TABLE_PAGINATION_BTN_CLASS,
  TABLE_PAGINATION_BTN_IDLE_CLASS,
} from '@/shared/components/listing/listingTableStyles'

function buildPageList(totalPages, currentPage, siblingCount = 1) {
  if (totalPages <= 1) {
    return [1]
  }

  const pages = []
  const start = Math.max(2, currentPage - siblingCount)
  const end = Math.min(totalPages - 1, currentPage + siblingCount)

  pages.push(1)
  if (start > 2) {
    pages.push('…')
  }
  for (let page = start; page <= end; page += 1) {
    pages.push(page)
  }
  if (end < totalPages - 1) {
    pages.push('…')
  }
  if (totalPages > 1) {
    pages.push(totalPages)
  }

  return pages
}

function NavIconButton({ disabled, onClick, label, children }) {
  return (
    <button
      type="button"
      className={`${TABLE_PAGINATION_BTN_CLASS} ${TABLE_PAGINATION_BTN_IDLE_CLASS}`}
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
    >
      {children}
    </button>
  )
}

/**
 * Listing footer pagination — “Showing X to Y of Z entries” + numbered page controls.
 */
export default function TablePaginationBar({
  page = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
  className = '',
}) {
  const totalPages = total > 0 ? Math.ceil(total / pageSize) : 1
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const rangeEnd = total === 0 ? 0 : Math.min(currentPage * pageSize, total)
  const atFirst = currentPage <= 1
  const atLast = currentPage >= totalPages
  const pageItems = buildPageList(totalPages, currentPage)

  const go = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === currentPage) {
      return
    }
    onPageChange?.(nextPage)
  }

  return (
    <div
      className={`flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className}`.trim()}
    >
      <p className={TABLE_CHROME_TEXT_CLASS}>
        {total === 0 ? (
          'Showing 0 entries'
        ) : (
          <>
            Showing <span>{rangeStart}</span>
            {' to '}
            <span>{rangeEnd}</span>
            {' of '}
            <span>{total}</span>
            {' entries'}
          </>
        )}
      </p>

      <div className="flex flex-wrap items-center justify-end gap-1.5">
        <NavIconButton disabled={atFirst} onClick={() => go(1)} label="First page">
          <ChevronsLeft size={18} strokeWidth={2} aria-hidden />
        </NavIconButton>
        <NavIconButton disabled={atFirst} onClick={() => go(currentPage - 1)} label="Previous page">
          <ChevronLeft size={18} strokeWidth={2} aria-hidden />
        </NavIconButton>

        {pageItems.map((item, index) =>
          item === '…' ? (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex size-8 items-center justify-center text-sm text-slate-300 dark:text-slate-600"
              aria-hidden
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={`${TABLE_PAGINATION_BTN_CLASS} ${item === currentPage ? TABLE_PAGINATION_BTN_ACTIVE_CLASS : TABLE_PAGINATION_BTN_IDLE_CLASS}`}
              onClick={() => go(item)}
              aria-label={`Page ${item}`}
              aria-current={item === currentPage ? 'page' : undefined}
            >
              {item}
            </button>
          ),
        )}

        <NavIconButton disabled={atLast} onClick={() => go(currentPage + 1)} label="Next page">
          <ChevronRight size={18} strokeWidth={2} aria-hidden />
        </NavIconButton>
        <NavIconButton disabled={atLast} onClick={() => go(totalPages)} label="Last page">
          <ChevronsRight size={18} strokeWidth={2} aria-hidden />
        </NavIconButton>
      </div>
    </div>
  )
}
