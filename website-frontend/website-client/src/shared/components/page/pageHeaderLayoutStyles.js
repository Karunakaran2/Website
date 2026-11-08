/**
 * PageSectionHeader responsive layout — title first; actions on their own row until 2xl.
 * Avoids clipping filter/search/export beside long or wide title blocks (common laptop widths).
 */

/** Stack title + actions until 2xl; then title | actions (actions column = max-content). */
export const PAGE_SECTION_HEADER_GRID_CLASS =
  'grid w-full min-w-0 grid-cols-1 items-start gap-x-4 gap-y-3 2xl:grid-cols-[minmax(0,1fr)_max-content] 2xl:items-center'

export const PAGE_SECTION_HEADER_TITLE_COLUMN_CLASS =
  'flex min-w-0 max-w-full items-start gap-2 2xl:max-w-[min(100%,40rem)]'

export const PAGE_SECTION_HEADER_TITLE_TEXT_CLASS =
  'min-w-0 max-w-full break-words [overflow-wrap:anywhere]'

export const PAGE_SECTION_HEADER_SUBTITLE_CLASS =
  'mt-1.5 max-w-full text-pretty'

/** Full-width action band below title; on 2xl+ aligns to the end of the actions grid column. */
export const PAGE_SECTION_HEADER_ACTIONS_CLASS =
  'flex w-full min-w-0 max-w-full flex-wrap items-center justify-start gap-2 sm:flex-nowrap sm:justify-end 2xl:justify-end 2xl:gap-x-2'

export const PAGE_SECTION_HEADER_ACTIONS_INNER_CLASS =
  'flex min-w-0 flex-wrap items-center justify-start gap-2 sm:flex-nowrap sm:justify-end'

