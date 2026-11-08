/** SPFO member login right-column tokens (PasswordForm / LoginCaptchaField). */

export const LOGIN_NAVY = '#263AB5'
export const LOGIN_BORDER = '#0D2EAB'

export const loginLabelClass = 'mb-2 block font-noto text-sm font-medium text-slate-900'

export const loginPillInputClass =
  'h-11 w-full min-w-0 rounded-lg border border-[#0D2EAB] bg-white px-4 font-noto text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#263AB5] focus:ring-1 focus:ring-[#263AB5] disabled:cursor-not-allowed disabled:bg-slate-50 sm:h-[52px] sm:px-5'

/** CAPTCHA: stack image + entry on phones; side-by-side from md+. */
export const loginCaptchaRowClass =
  'flex w-full min-w-0 flex-col gap-3 md:flex-row md:items-center'

export const loginCaptchaImageShellClass =
  'flex h-11 w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-[#0D2EAB] bg-white px-2.5 sm:px-3 md:h-[52px] md:min-w-0 md:flex-[1_1_42%] md:max-w-[48%]'

export const loginCaptchaImageViewportClass =
  'flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden py-0.5'

export const loginCaptchaImgClass =
  'max-h-9 w-auto max-w-full object-contain sm:max-h-10 md:max-h-11'

export const loginCaptchaInputClass = `${loginPillInputClass} md:min-w-0 md:flex-[1_1_58%]`

/** Login left column — compact “Track portal request” widget (shorter than main login fields). */
export const loginTrackPanelFormRowClass =
  'flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center'

export const loginTrackPanelInputClass =
  'h-9 min-h-9 w-full min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 font-noto text-[13px] text-slate-800 placeholder:text-slate-400 outline-none transition touch-manipulation focus:border-[#01458e] focus:ring-1 focus:ring-[#01458e] sm:h-10 sm:min-h-10 sm:px-3.5'

export const loginTrackPanelButtonClass =
  'inline-flex h-9 min-h-9 w-full shrink-0 cursor-pointer items-center justify-center gap-1 rounded-lg border border-[#01458e] bg-white px-3 font-noto text-[13px] font-semibold text-[#01458e] transition touch-manipulation hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#01458e] sm:h-10 sm:min-h-10 sm:w-auto sm:min-w-[6.5rem] sm:px-3.5'

export const loginPrimaryBtnClass =
  'inline-flex h-11 w-full min-w-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-[#263AB5] px-4 font-noto text-sm font-semibold text-white transition hover:bg-[#1e2e91] disabled:cursor-not-allowed disabled:opacity-50 sm:h-[52px]'

export const loginLinkClass =
  'cursor-pointer border-0 bg-transparent p-0 font-noto text-sm font-semibold text-[#263AB5] hover:underline'

export const loginFooterLinkClass =
  'font-noto text-sm font-semibold text-[#263AB5] no-underline hover:underline'

export const loginOutlineBtnClass =
  'inline-flex h-11 w-full min-w-0 cursor-pointer items-center justify-center rounded-lg border border-[#0D2EAB] bg-white px-4 font-noto text-sm font-semibold text-[#263AB5] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:h-[52px]'

export function loginTabClass(active) {
  return `flex h-11 min-w-0 flex-1 cursor-pointer items-center justify-center rounded-lg px-2 font-noto text-xs font-semibold transition sm:h-[52px] sm:px-3 sm:text-sm ${
    active
      ? 'border-0 bg-[#263AB5] text-white'
      : 'border border-[#0D2EAB] bg-white text-[#263AB5] hover:bg-slate-50'
  }`
}
