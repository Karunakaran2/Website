import { toast as notify } from 'react-toastify'
import { getToastAppearance } from './toastAppearance'
import { APP_TOAST_ERROR_DURATION_MS, APP_TOAST_SUCCESS_DURATION_MS } from './toastDuration'

const NOTIFY_BASE = {
  closeButton: true,
  hideProgressBar: false,
  pauseOnHover: true,
  draggable: false,
  closeOnClick: false,
}

function resolveNotifyType(tone) {
  if (tone === 'warning') {
    return 'warning'
  }
  if (tone === 'error') {
    return 'error'
  }
  if (tone === 'info' || tone === 'update') {
    return 'info'
  }
  return 'success'
}

function showNotifyToast(message, tone, action) {
  const { toastClassName, progressClassName } = getToastAppearance(tone, action)
  notify(message, {
    ...NOTIFY_BASE,
    type: resolveNotifyType(tone),
    autoClose: tone === 'error' ? APP_TOAST_ERROR_DURATION_MS : APP_TOAST_SUCCESS_DURATION_MS,
    className: toastClassName,
    progressClassName,
  })
}

/**
 * App toasts — all tones via react-toastify (bottom-center, white card, action tint).
 * @param {string} message
 * @param {'success' | 'error' | 'update' | 'info' | 'warning'} [tone]
 * @param {{ action?: string }} [options] — confirm action for tint (save, approve, delete, …)
 */
export function showAppToast(message, tone = 'success', options = {}) {
  if (!message) {
    return
  }

  showNotifyToast(message, tone, options?.action)
}

/** Drop-in alias for legacy `toast.success` / `toast.error` call sites. */
export const toast = {
  success: (message, options) => showAppToast(message, 'success', options),
  error: (message) => showAppToast(message, 'error'),
  info: (message, options) => showAppToast(message, 'info', options),
  warning: (message, options) => showAppToast(message, 'warning', options),
}

export const appToast = toast
export default appToast
