/** Probity listing table chrome (Tailwind + GIGW typography tokens). */

import { tableBodyCellClass, tableColumnLabelClass } from '@/shared/components/typography/typographyStyles'

export const PROBITY_TABLE_SHELL_CLASS =
  'w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-none dark:border-slate-700 dark:bg-slate-800'

/** Content-sized columns (table-auto); table still spans the card when data is narrow. */
export const PROBITY_TABLE_CLASS =
  'w-full max-w-full table-auto border-collapse text-left text-sm'

/** Data cells — width follows cell content unless wrapCells is enabled on the table. */
export const TABLE_DATA_COLUMN_CLASS = 'w-auto'

/** In-cell text link — same size/weight as {@link tableBodyCellClass}, navy underline only. */
export const TABLE_CELL_TEXT_LINK_CLASS =
  `${tableBodyCellClass} inline max-w-full cursor-pointer border-0 bg-transparent p-0 m-0 text-left normal-case !text-[#01458e] underline underline-offset-2 hover:!text-[#01336a] dark:hover:!text-[#8bb8ea] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#01458e]`

/** Scroll container — bar appears only when table is wider than the card. */
export const PROBITY_TABLE_BODY_SCROLL_CLASS = 'min-w-0 w-full overflow-x-auto'

/** Responsive DataTable — clip overflow; columns move to row accordion instead of horizontal scroll. */
export const PROBITY_TABLE_BODY_CLIP_CLASS = 'min-w-0 w-full overflow-hidden'

/** Fixed layout for responsive packing within container width. */
export const PROBITY_TABLE_RESPONSIVE_CLASS = 'table-fixed'

/** Wide grids (many columns) — preserve readable column width; pair with scroll wrap. */
export const PROBITY_TABLE_WIDE_CLASS = 'min-w-max w-max max-w-none'

export const PROBITY_TABLE_HEAD_CLASS = 'w-full bg-[#F4FAFF] dark:bg-slate-900'

export const PROBITY_TABLE_HEAD_ROW_CLASS =
  `${tableColumnLabelClass} border-b border-slate-200 capitalize tracking-wide dark:border-slate-700`

/** @deprecated Use PROBITY_TABLE_HEAD_ROW_CLASS (capitalize is default). */
export const PROBITY_TABLE_HEAD_ROW_CAPITALIZE_CLASS = PROBITY_TABLE_HEAD_ROW_CLASS

/** Header label text — wrap at word boundaries; avoid mid-word splits (e.g. descriptio/n). */
export const PROBITY_TABLE_HEADER_TEXT_CLASS =
  'whitespace-normal break-normal [overflow-wrap:normal] [word-break:normal] leading-snug'

export const PROBITY_TABLE_TH_CLASS =
  `${tableColumnLabelClass} min-w-0 whitespace-normal bg-[#F4FAFF] px-2 py-2.5 capitalize align-middle leading-snug dark:bg-slate-900 sm:px-3 sm:py-3.5 sm:min-h-[3rem] ${PROBITY_TABLE_HEADER_TEXT_CLASS}`

/** @deprecated Use PROBITY_TABLE_TH_CLASS (capitalize is default). */
export const PROBITY_TABLE_TH_CAPITALIZE_CLASS = PROBITY_TABLE_TH_CLASS

/** Multi-line thead when wrapHeaders or responsive layout is enabled. */
export const PROBITY_TABLE_TH_WRAP_CLASS =
  `${tableColumnLabelClass} whitespace-normal bg-[#F4FAFF] px-3 py-3.5 capitalize align-middle min-h-[3rem] tracking-wide dark:bg-slate-900 ${PROBITY_TABLE_HEADER_TEXT_CLASS}`

/** Inner wrapper so sort buttons and labels align with body columns. */
export const PROBITY_TABLE_TH_INNER_CLASS = 'flex w-full min-w-0 items-center'

export const PROBITY_TABLE_TD_WRAP_CLASS =
  `${tableBodyCellClass} min-w-0 whitespace-normal break-words [overflow-wrap:anywhere] px-2 py-2 align-middle sm:px-3 sm:py-2.5`

export const PROBITY_TABLE_ROW_CLASS =
  'border-b border-slate-100 bg-white hover:bg-slate-50/80 dark:border-slate-800 dark:bg-slate-800 dark:hover:bg-slate-900/50'

export const PROBITY_TABLE_TD_CLASS =
  `${tableBodyCellClass} align-middle px-2 py-2 sm:px-3 sm:py-2.5`

/** Toolbar and “Showing … entries” — slate-900 stays above 4.5:1 on white and #F4FAFF. */
export const TABLE_CHROME_TEXT_CLASS = 'text-sm font-medium text-slate-900 dark:text-slate-100'

export const PROBITY_TABLE_DEFAULT_EMPTY_MESSAGE = 'No records available.'

export const PROBITY_TABLE_EMPTY_CLASS = 'px-3 py-8 text-center text-sm text-slate-800 dark:text-slate-200'

/**
 * Last column shrink — table stays w-full; remaining width goes to earlier columns (not blank gutter).
 * @see TABLE_ACTION_COLUMN_CLASS
 */
export const TABLE_LAST_COLUMN_SHRINK_CLASS = 'w-[1%] whitespace-nowrap'

/** Action column — as narrow as icons allow; earlier columns absorb free width. */
export const TABLE_ACTION_COLUMN_CLASS =
  `${TABLE_LAST_COLUMN_SHRINK_CLASS} min-w-[6.75rem] align-middle sm:min-w-[7.5rem]`

export { gigwStatusBadgeClass as probityStatusChipClass } from '@/shared/components/status/gigwStatusBadgeStyles'

/** Listing footer pagination — light slate chrome, gray active page. */
export const TABLE_PAGINATION_BTN_CLASS =
  'inline-flex size-8 shrink-0 items-center justify-center rounded-md border text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-35'

export const TABLE_PAGINATION_BTN_IDLE_CLASS =
  'border-slate-100 bg-white text-slate-800 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-slate-100'

export const TABLE_PAGINATION_BTN_ACTIVE_CLASS =
  'border-slate-200 bg-slate-100 font-semibold text-slate-800 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100'
