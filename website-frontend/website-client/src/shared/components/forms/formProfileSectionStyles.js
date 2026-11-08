import { sectionTitleClass } from '@/shared/components/typography/typographyStyles'

/** Nested section cards inside form body */

export const formProfileSectionShellClass =
  'relative z-auto min-w-0 w-full overflow-visible rounded-lg border border-slate-200 bg-white shadow-none print:break-inside-avoid dark:border-slate-700 has-[[aria-expanded=true]]:z-[80] focus-within:z-[80]'

export const formProfileSectionHeaderClass =
  'flex items-center justify-between gap-2 border-b border-slate-200 bg-[#F4FAFF] px-4 py-2.5 dark:border-slate-700 dark:bg-slate-900'

export const formProfileSectionTitleClass =
  `${sectionTitleClass} text-slate-700 dark:text-slate-200`

/** GIGW sub-heading icon — 16×16, locked px (not fluid rem). */
export const FORM_SECTION_ICON_SIZE = 16

export const formSectionIconClass =
  'h-[16px] w-[16px] min-h-[16px] min-w-[16px] shrink-0 text-slate-500 dark:text-slate-400'

export const formProfileSectionBodyClass = 'p-4 sm:p-5'
