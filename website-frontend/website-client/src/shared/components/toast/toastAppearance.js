/** v11 applies `className` on the toast root — Tailwind only (no app Toastify override CSS). */
const TOAST_SHELL_CLASS =
  '!min-h-[56px] !rounded-lg !border !border-slate-200 !bg-white !shadow-md !transition-all !duration-300 !ease-out !text-[14px] !font-semibold !leading-5 !px-5 !py-4'

/** White surface + slate border; message color follows action / tone. */
export const TOAST_VARIANT_APPEARANCE = {
  success: {
    toastClassName: `${TOAST_SHELL_CLASS} !text-emerald-800`,
    progressClassName: '!bg-emerald-600',
  },
  info: {
    toastClassName: `${TOAST_SHELL_CLASS} !text-sky-800`,
    progressClassName: '!bg-sky-600',
  },
  warning: {
    toastClassName: `${TOAST_SHELL_CLASS} !text-amber-900`,
    progressClassName: '!bg-amber-600',
  },
  danger: {
    toastClassName: `${TOAST_SHELL_CLASS} !text-rose-800`,
    progressClassName: '!bg-rose-600',
  },
}

/**
 * @param {'success' | 'error' | 'update' | 'info' | 'warning'} tone
 * @param {string} [action] — confirm action key (save, approve, delete, …)
 */
export function resolveToastVariant(tone, action) {
  if (tone === 'warning') {
    return 'warning'
  }
  if (tone === 'info' || tone === 'update') {
    return 'info'
  }

  if (action) {
    if (['delete', 'reject', 'deactivate', 'remove'].includes(action)) {
      return 'danger'
    }
    if (['upload', 'submit', 'process', 'forward', 'download'].includes(action)) {
      return 'info'
    }
    if (['approve', 'verify', 'finalize'].includes(action)) {
      return 'success'
    }
  }

  return 'success'
}

export function getToastAppearance(tone, action) {
  if (tone === 'error') {
    return TOAST_VARIANT_APPEARANCE.danger
  }
  const variant = resolveToastVariant(tone, action)
  return TOAST_VARIANT_APPEARANCE[variant] ?? TOAST_VARIANT_APPEARANCE.success
}
