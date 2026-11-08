/** Org UI module page + inner listing card layout (design tokens only). */

export { PAGE_SECTION_SHELL_CLASS as MODULE_PAGE_CARD_CLASS } from '@/shared/components/page/pageHeaderStyles'

export { PAGE_SECTION_BODY_CLASS as MODULE_PAGE_BODY_PADDING_CLASS } from '@/shared/components/page/pageHeaderStyles'

export const MODULE_INNER_CARD_CLASS =
  'flex flex-col overflow-visible rounded-lg border border-slate-200 bg-white shadow-none w-full'

/** Home landing Inbox / Modules — fill main column height, scroll inside body. */
export const MODULE_LANDING_PANEL_CLASS =
  'flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-none w-full'

export const MODULE_INNER_CARD_BODY_CLASS = 'overflow-visible p-4 sm:p-5'

/** Page card body — SPFO spacing; scroll stays on <main> (single card shell, not SPFO’s nested page card). */
export const MODULE_PAGE_BODY_CLASS =
  'probity-module-content custom-scrollbar flex flex-col gap-5 p-4 sm:p-5'

/** Inner stack for every page under ModuleContentShell (matches voucher section rhythm). */
export const MODULE_PAGE_CONTENT_CLASS = 'probity-complex-form flex min-w-0 flex-col gap-5'

/** Form actions row at bottom of card body (padding from page shell). */
export const MODULE_FORM_FOOTER_CLASS =
  'flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4'

/** Button row only — border comes from `PORTAL_MODAL_FOOTER_CLASS` on `FormModal` footer slot. */
export const MODAL_FORM_FOOTER_CLASS = 'flex flex-wrap justify-end gap-2'

/** Client validation / form-level errors (setup + voucher parity). */
export const MODULE_FORM_ERROR_BANNER_CLASS =
  'rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800'
