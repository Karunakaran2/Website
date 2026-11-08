/**
 * GIGW / Org UI typography — Tailwind class tokens only (no global CSS classes).
 * Map: page H1, modal H2, card H3, form label, body, table label, caption.
 */

export const pageTitleClass =
  'm-0 text-[20px] font-bold leading-7 text-gray-900 dark:text-slate-100'

export const modalTitleClass =
  'm-0 text-lg font-semibold leading-[26px] text-gray-900 dark:text-slate-100'

export const modalBodyTextClass =
  'text-[13px] font-normal leading-5 text-[#344054] dark:text-slate-200'

export const modalSubtitleClass =
  'm-0 text-[15px] font-medium leading-snug text-[#475467]'

export const moduleSectionTitleClass =
  'm-0 text-[20px] font-bold leading-7 text-[#01458e] dark:text-blue-300'

export const moduleSectionSubtitleClass =
  'm-0 mt-1.5 text-[13px] font-normal leading-5 text-slate-700 dark:text-slate-300'

export const sectionTitleClass =
  'm-0 text-[16px] font-semibold leading-6 text-gray-900 dark:text-slate-100'

export const subsectionTitleClass =
  'm-0 text-[16px] font-semibold leading-6 text-gray-900 dark:text-slate-100'

export const navTabPrimaryClass = 'text-sm font-semibold leading-5 text-gray-900 dark:text-slate-100'

export const navTabSecondaryClass = 'text-sm font-medium leading-5 text-gray-700 dark:text-slate-300'

export const bodyTextClass = 'text-[13px] font-normal leading-5 text-gray-900 dark:text-slate-100'

export const bodyTextMediumClass = 'text-[13px] font-medium leading-5 text-gray-900 dark:text-slate-100'

/** Form labels, filter labels, modal field labels */
export const formLabelClass =
  'field-label mb-1 block w-full min-w-0 text-[13px] font-medium leading-5 text-gray-700 dark:text-slate-300 [html[data-color-scheme=high]_&]:!text-white [html[data-login-contrast=high]_&]:!text-white [html.contrast-high_&]:!text-white [html[data-color-scheme=yellow]_&]:!text-[#ff0] [html[data-login-contrast=yellow]_&]:!text-[#ff0] [html.contrast-yellow_&]:!text-[#ff0]'

export const formLegendClass =
  'field-label mb-1 block w-full p-0 text-[13px] font-medium leading-5 text-gray-700 dark:text-slate-300 [html[data-color-scheme=high]_&]:!text-white [html[data-login-contrast=high]_&]:!text-white [html.contrast-high_&]:!text-white [html[data-color-scheme=yellow]_&]:!text-[#ff0] [html[data-login-contrast=yellow]_&]:!text-[#ff0] [html.contrast-yellow_&]:!text-[#ff0]'

export const formOptionLabelClass =
  'form-option-label mb-0 inline-flex items-center gap-2 text-[13px] font-medium leading-5 text-gray-700 dark:text-slate-300 [html[data-color-scheme=high]_&]:!text-white [html[data-login-contrast=high]_&]:!text-white [html.contrast-high_&]:!text-white [html[data-color-scheme=yellow]_&]:!text-[#ff0] [html[data-login-contrast=yellow]_&]:!text-[#ff0] [html.contrast-yellow_&]:!text-[#ff0]'

/** GIGW radio / checkbox — minimum 20×20 */
export const formChoiceControlClass =
  'h-[20px] w-[20px] min-h-[20px] min-w-[20px] shrink-0 accent-[#01458e]'

/** Checkbox — 20×20 navy accent; browser draws the white tick when checked. */
export const formCheckboxControlClass =
  'h-[20px] w-[20px] min-h-[20px] min-w-[20px] shrink-0 cursor-pointer accent-[#01458e]'

/** Required field asterisk — label text stays gray; shell keeps this red inside setup forms. */
export const formRequiredMarkClass =
  'form-required-mark font-semibold !text-rose-600 dark:!text-rose-400'

export const formFieldWrapperClass = 'block w-full min-w-0'

/** In-form divider titles (uppercase band) */
export const formSectionOverlineClass =
  'm-0 text-[12px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400'

/** Data table / listing */
export const tableColumnLabelClass =
  'text-sm font-semibold leading-5 text-slate-900 dark:text-slate-100'

export const tableBodyCellClass = 'text-sm font-normal leading-5 text-slate-700 dark:text-slate-200'

/** Helper, validation, breadcrumbs, metadata */
export const captionClass = 'text-[12px] font-normal leading-[18px] text-gray-500 dark:text-slate-400'

export const captionDangerClass =
  'text-[12px] font-normal leading-[18px] text-[#B42318] dark:text-rose-400'

/** Read-only / view panels — same 16px sub-heading as form section cards. */
export const dataPanelBandTitleClass =
  'm-0 flex items-center gap-2 border-b border-slate-200 bg-[#F4FAFF] px-4 py-2.5 text-[16px] font-semibold leading-6 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'

export const dataSummaryLabelClass =
  'text-[13px] font-semibold leading-5 text-slate-600 dark:text-slate-400'

export const dataSummaryValueClass =
  'mt-1 text-[13px] font-medium leading-5 text-slate-800 dark:text-slate-200'

/** @deprecated alias */
export const formFieldLabelClass = formLabelClass

export const PAGE_FILTER_LABEL_CLASS = formLabelClass

export const PORTAL_MODAL_LABEL_CLASS = formLabelClass

export const PORTAL_MODAL_TITLE_CLASS = modalTitleClass

export const PORTAL_MODAL_BODY_CLASS =
  `overflow-y-auto bg-white p-4 text-left font-sans ${modalBodyTextClass}`

export const PAGE_SECTION_TITLE_CLASS = moduleSectionTitleClass

export const PAGE_SECTION_SUBTITLE_CLASS = moduleSectionSubtitleClass

export const FORM_SECTION_TITLE_CLASS = sectionTitleClass
