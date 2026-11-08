/** Logged-in module shell (Org UI standard). */

import { PAGE_SECTION_SHELL_CLASS } from '@/shared/components/page/pageHeaderStyles'
import { bodyTextClass } from '@/shared/components/typography/typographyStyles'
import { MODULE_PAGE_BODY_CLASS as MODULE_PAGE_BODY_INNER_CLASS } from '@/shared/constants/moduleLayoutStyles'

export const MODULE_ROOT_CLASS =
  'flex h-full max-h-full min-h-0 w-full flex-col overflow-hidden bg-[#FDFEFF]'

/** Main is the only scroll container. No h-full: in Chrome that percentage
 *  becomes a minimum and, with the nav and footer, stretches the page past the viewport. */
export const MODULE_MAIN_CLASS =
  'custom-scrollbar flex min-h-0 min-w-0 max-w-full flex-1 flex-col overflow-y-auto bg-[#FDFEFF] px-3 py-4 outline-none sm:px-5 sm:py-5 xl:px-[20px]'

export const MODULE_MAIN_INNER_CLASS = 'flex w-full min-w-0 max-w-full flex-col'

export const MODULE_CARD_CLASS = `${PAGE_SECTION_SHELL_CLASS} flex w-full min-w-0 max-w-full flex-col !overflow-visible font-sans text-left ${bodyTextClass}`

/** @deprecated Use MODULE_CARD_CLASS */
export const MODULE_PAGE_PANEL_CLASS = MODULE_CARD_CLASS

export const MODULE_PAGE_BODY_CLASS = MODULE_PAGE_BODY_INNER_CLASS
