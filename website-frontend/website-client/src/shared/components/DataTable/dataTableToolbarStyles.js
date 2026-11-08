/**
 * DataTable toolbar controls — same height as org form fields (h-11), not a separate 36px size.
 */
import {
  ORG_FORM_CONTROL_HEIGHT_CLASS,
  ORG_FORM_CONTROL_HEIGHT_SELECT_CLASS,
} from '@/shared/components/forms/formControlDimensions'

export const DATATABLE_TOOLBAR_CONTROL_CLASS = `${ORG_FORM_CONTROL_HEIGHT_CLASS} shrink-0`

export const DATATABLE_TOOLBAR_SEARCH_INPUT_CLASS =
  `${ORG_FORM_CONTROL_HEIGHT_CLASS} !rounded-md !border-slate-300 !px-3`

export const DATATABLE_TOOLBAR_PAGE_SIZE_SELECT_CLASS =
  `${ORG_FORM_CONTROL_HEIGHT_SELECT_CLASS} !rounded-md !border-slate-300 !px-2.5 text-center tabular-nums`

/** Fits 3-digit page sizes (100) + chevron; prevents clipped select value text. */
export const DATATABLE_TOOLBAR_PAGE_SIZE_WRAPPER_CLASS =
  'w-[5.5rem] min-w-[5.5rem] max-w-[5.5rem] shrink-0 [&_label]:hidden [&_button]:!w-full [&_button]:!min-w-0 [&_span]:!overflow-visible [&_span]:!whitespace-nowrap [&_span]:tabular-nums [&_span]:!text-slate-900 dark:[&_span]:!text-slate-100'

export const DATATABLE_TOOLBAR_COLUMNS_BUTTON_CLASS =
  `${ORG_FORM_CONTROL_HEIGHT_CLASS} !inline-flex !w-auto !items-center !justify-center !gap-1.5 !rounded-md !px-3`
