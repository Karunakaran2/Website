import {
  PORTAL_MODAL_BODY_CLASS as TYPO_MODAL_BODY,
  PORTAL_MODAL_LABEL_CLASS as TYPO_MODAL_LABEL,
  PORTAL_MODAL_TITLE_CLASS as TYPO_MODAL_TITLE,
  modalBodyTextClass,
  sectionTitleClass,
} from '@/shared/components/typography/typographyStyles'

/** GIGW base modal stacking (above fixed chrome; nested confirms above forms). */
export const PORTAL_MODAL_Z_INDEX = 1055
export const PORTAL_MODAL_NESTED_Z_INDEX = 1060

export const PORTAL_MODAL_TITLE_CLASS = TYPO_MODAL_TITLE

/** Default (data entry) header — white surface. */
export const PORTAL_MODAL_HEADER_CLASS =
  'flex min-h-[56px] items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-4'

/** Read-only / view modals — light gray header per SEEPZ spec. */
export const PORTAL_MODAL_HEADER_READONLY_CLASS =
  'flex min-h-[56px] items-center justify-between gap-3 border-b border-slate-200 bg-[#F8F9FA] px-4 py-4'

export const PORTAL_MODAL_BODY_CLASS = TYPO_MODAL_BODY

export const PORTAL_MODAL_FOOTER_CLASS =
  'probity-portal-modal-footer flex w-full flex-wrap items-center gap-2 border-t border-slate-200 bg-white px-4 py-3'

export const PORTAL_MODAL_LABEL_CLASS = TYPO_MODAL_LABEL

export const PORTAL_MODAL_PRIMARY_BUTTON_CLASS =
  'inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded border-none bg-[#01458e] px-5 text-sm font-semibold text-white hover:bg-[#01336a] disabled:cursor-not-allowed disabled:opacity-50'

export const PORTAL_MODAL_SECONDARY_BUTTON_CLASS =
  'inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50'

const PORTAL_MODAL_SHELL_CLASS =
  'max-h-[min(92dvh,calc(100dvh-1.5rem))] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg flex flex-col'

/** Modal max-widths — same scale as last commit (FormModal default `xl` = max-w-4xl). */
/** GIGW feedback modals — alert width (500px), borderless shell. */
export const FEEDBACK_MODAL_SHELL_CLASS =
  'mx-auto w-full max-w-[min(500px,calc(100vw-2rem))] overflow-hidden rounded-lg border-0 bg-white shadow-lg'

export const FEEDBACK_MODAL_FOOTER_CLASS =
  'probity-portal-modal-footer flex w-full flex-wrap items-center gap-2 border-0 bg-white px-4 pb-4 pt-0'

export const FEEDBACK_MODAL_ALERT_BODY_CLASS =
  `overflow-y-auto bg-white px-5 py-4 text-center font-sans ${modalBodyTextClass}`

export const FEEDBACK_MODAL_REJECTION_BODY_CLASS =
  `overflow-y-auto bg-white p-4 text-left font-sans ${modalBodyTextClass}`

export const FEEDBACK_MODAL_ALERT_TITLE_CLASS = `${sectionTitleClass} mb-3`

/** @type {Record<string, { headerBg: string, iconColor: string, closeLight: boolean, staticBackdrop: boolean, alertLayout: boolean, primaryVariant: string, defaultPrimaryLabel: string, showSecondary: boolean, footerLayout: 'center' | 'between' }>} */
export const FEEDBACK_MODAL_VARIANT = {
  success: {
    headerBg: 'bg-[#157347]',
    iconColor: '#157347',
    closeLight: true,
    staticBackdrop: false,
    alertLayout: true,
    primaryVariant: 'success',
    defaultPrimaryLabel: 'Continue',
    showSecondary: false,
    footerLayout: 'center',
  },
  warning: {
    headerBg: 'bg-[#FFC107]',
    iconColor: '#FFC107',
    closeLight: false,
    staticBackdrop: true,
    alertLayout: true,
    primaryVariant: 'primary',
    defaultPrimaryLabel: 'Proceed',
    showSecondary: true,
    footerLayout: 'center',
  },
  error: {
    headerBg: 'bg-[#B42318]',
    iconColor: '#B42318',
    closeLight: true,
    staticBackdrop: true,
    alertLayout: true,
    primaryVariant: 'danger',
    defaultPrimaryLabel: 'Close',
    showSecondary: false,
    footerLayout: 'center',
  },
  rejection: {
    headerBg: 'bg-[#B42318]',
    iconColor: '#B42318',
    closeLight: true,
    staticBackdrop: true,
    alertLayout: false,
    primaryVariant: 'danger',
    defaultPrimaryLabel: 'Confirm Rejection',
    showSecondary: true,
    footerLayout: 'between',
  },
}

const PORTAL_MODAL_VIEWPORT_MARGIN = 'mx-2 sm:mx-4'

export const PORTAL_MODAL_SIZE_CLASS = {
  sm: `w-full max-w-[min(28rem,calc(100vw-1rem))] ${PORTAL_MODAL_VIEWPORT_MARGIN} ${PORTAL_MODAL_SHELL_CLASS}`,
  md: `w-full max-w-[min(32rem,calc(100vw-1rem))] ${PORTAL_MODAL_VIEWPORT_MARGIN} ${PORTAL_MODAL_SHELL_CLASS}`,
  lg: `w-full max-w-[min(48rem,calc(100vw-1rem))] ${PORTAL_MODAL_VIEWPORT_MARGIN} ${PORTAL_MODAL_SHELL_CLASS}`,
  xl: `w-full max-w-[min(56rem,calc(100vw-1rem))] ${PORTAL_MODAL_VIEWPORT_MARGIN} ${PORTAL_MODAL_SHELL_CLASS}`,
  '2xl': `w-full max-w-[min(64rem,calc(100vw-1rem))] ${PORTAL_MODAL_VIEWPORT_MARGIN} ${PORTAL_MODAL_SHELL_CLASS}`,
  '3xl': `w-full max-w-[min(72rem,calc(100vw-1rem))] ${PORTAL_MODAL_VIEWPORT_MARGIN} ${PORTAL_MODAL_SHELL_CLASS}`,
  '4xl': `w-full max-w-[min(80rem,calc(100vw-1rem))] ${PORTAL_MODAL_VIEWPORT_MARGIN} ${PORTAL_MODAL_SHELL_CLASS}`,
  '5xl': `w-full max-w-[min(92rem,calc(100vw-1rem))] ${PORTAL_MODAL_VIEWPORT_MARGIN} ${PORTAL_MODAL_SHELL_CLASS}`,
}
