/**
 * Legacy ActionButton variants — composed from GIGW Tailwind tokens (no custom CSS).
 * Prefer GigwButton / GigwIconButton for new domain UI.
 */

import {
  GIGW_BTN_BASE,
  GIGW_BTN_SIZE_CLASS,
  GIGW_BTN_VARIANT_CLASS,
  GIGW_ICON_BTN_BASE,
  GIGW_ICON_TONE_CLASS,
} from './gigw/gigwButtonStyles'

const md = GIGW_BTN_SIZE_CLASS.md
const sm = GIGW_BTN_SIZE_CLASS.sm

export const BTN_PRIMARY_CLASS = `${GIGW_BTN_BASE} ${md} ${GIGW_BTN_VARIANT_CLASS.primary}`

export const BTN_SUBMIT_CLASS = BTN_PRIMARY_CLASS

export const BTN_SAVE_CLASS = `${GIGW_BTN_BASE} ${md} ${GIGW_BTN_VARIANT_CLASS.secondary}`

export const BTN_CANCEL_CLASS = `${GIGW_BTN_BASE} ${md} ${GIGW_BTN_VARIANT_CLASS.secondary}`

export const BTN_RESET_CLASS = `${GIGW_BTN_BASE} ${md} ${GIGW_BTN_VARIANT_CLASS.outlineUtility}`

export const BTN_VIEW_CLASS = `${GIGW_BTN_BASE} ${md} ${GIGW_BTN_VARIANT_CLASS.outlinePrimary}`

export const BTN_DELETE_CLASS = `${GIGW_BTN_BASE} ${md} ${GIGW_BTN_VARIANT_CLASS.danger}`

export const BTN_REMOVE_CLASS = `${GIGW_BTN_BASE} ${md} ${GIGW_BTN_VARIANT_CLASS.outlineDanger}`

export const BTN_BACK_CLASS = `${GIGW_BTN_BASE} ${md} ${GIGW_BTN_VARIANT_CLASS.outlineUtility}`

export const BTN_PDF_CLASS = `${GIGW_BTN_BASE} ${md} ${GIGW_BTN_VARIANT_CLASS.outlineDanger}`

export const BTN_EXCEL_CLASS = `${GIGW_BTN_BASE} ${md} ${GIGW_BTN_VARIANT_CLASS.outlineSuccess}`

export const BTN_DRAFT_CLASS = `${GIGW_BTN_BASE} ${md} ${GIGW_BTN_VARIANT_CLASS.outlineUtility}`

export const BTN_VERIFY_CLASS = `${GIGW_BTN_BASE} ${md} ${GIGW_BTN_VARIANT_CLASS.primary}`

export const BTN_COST_UNIT_CLASS = `${GIGW_BTN_BASE} ${md} border-transparent bg-[#f5c518] text-slate-900 hover:bg-[#e0b016] dark:text-slate-900`

export const BTN_APPROVE_CLASS = `${GIGW_BTN_BASE} ${md} ${GIGW_BTN_VARIANT_CLASS.success}`

export const BTN_ACTIVATE_CLASS = BTN_APPROVE_CLASS

export const BTN_DEACTIVATE_CLASS = `${GIGW_BTN_BASE} ${md} ${GIGW_BTN_VARIANT_CLASS.outlineUtility}`

export const BTN_LINK_CLASS = `${GIGW_BTN_VARIANT_CLASS.tertiary} inline-flex h-auto min-h-0 items-center gap-1 rounded-none border-0 bg-transparent px-0 py-0 text-sm font-medium underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-[0.45] focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005a9c]`

/** @deprecated Use BTN_SUBMIT_CLASS */
export const nomineePrimaryButtonClass = BTN_SUBMIT_CLASS

/** @deprecated Use BTN_SAVE_CLASS */
export const nomineeSecondaryButtonClass = BTN_SAVE_CLASS

/** Probity form footers / modals — min width only (padding from GIGW size). */
export const FORM_FOOTER_PRIMARY_CLASS = 'min-w-[5.5rem]'

export const FORM_FOOTER_CANCEL_CLASS = 'min-w-[5.5rem]'

/** Optional extra class for page header actions — same metrics as GIGW md (use when needed). */
export const PAGE_HEADER_ACTION_CLASS = ''

/** In-form add/remove — same stack as Save/Cancel (no compact override) */
export const FORM_INLINE_ACTION_CLASS = ''

/** @deprecated Use PAGE_HEADER_ACTION_CLASS */
export const TOOLBAR_COMPACT_PRIMARY_CLASS = PAGE_HEADER_ACTION_CLASS

/** Listing row text actions — compact GIGW sm */
export const TABLE_COMPACT_ACTION_CLASS = `${sm} px-2 py-1`

/** Icon-only +/- in voucher line grids */
export const TABLE_ICON_NEUTRAL_CLASS = `${GIGW_ICON_BTN_BASE} ${GIGW_ICON_TONE_CLASS.info} !size-8 !min-h-0 !min-w-0 max-md:!size-9`

export const TABLE_ICON_DANGER_CLASS = `${GIGW_ICON_BTN_BASE} ${GIGW_ICON_TONE_CLASS.destructive} !size-8 !min-h-0 !min-w-0 max-md:!size-9`

export const FORM_ROW_ICON_ACTION_CLASS = `${GIGW_ICON_BTN_BASE} ${GIGW_ICON_TONE_CLASS.info} !size-8 !min-h-0 !min-w-0`

/** @deprecated Use TABLE_COMPACT_ACTION_CLASS */
export const compactTableActionClass = TABLE_COMPACT_ACTION_CLASS

/** @deprecated Use TABLE_ICON_NEUTRAL_CLASS */
export const tableIconEditButtonClass = TABLE_ICON_NEUTRAL_CLASS

/** @deprecated Use TABLE_ICON_DANGER_CLASS */
export const tableIconDeleteButtonClass = TABLE_ICON_DANGER_CLASS

/** @deprecated No longer used — ActionButton uses Tailwind from this file */
export const SPFO_ACTION_BTN_HOOK = ''
