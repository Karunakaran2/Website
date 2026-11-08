import { confirmBeforeAction } from './confirmBeforeAction'

/**
 * Confirm before CSV / Excel export (list header, report footer, etc.).
 */
export function confirmExportAction(requestConfirm, runAction, options = {}) {
  const { stack = 'base', showSuccessToast = false, validate, message, title } = options

  return confirmBeforeAction(requestConfirm, {
    action: 'export',
    stack,
    validate,
    runAction,
    showSuccessToast,
    message,
    title,
  })
}
