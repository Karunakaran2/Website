import { showAppToast } from '@/shared/components/toast/appToast'
import { getActionSuccessToastMessage } from './actionSuccessToast'

/**
 * Validate, then open ConfirmDialog (or run immediately if no provider).
 *
 * Use only when the user is about to perform a **meaningful action** — persisted save/update,
 * delete, submit, approve/reject, process, upload, and similar mutations.
 *
 * Do **not** use for navigation, opening/closing overlays for browsing, or changing list filters,
 * search, sort, or page size (no confirm on everyday exploration).
 *
 * @param {Function|null} requestConfirm — from `useActionConfirm()`
 * @param {object} options
 * @param {string} options.action — key for `getActionConfirmDialogProps` (save, update, process, upload, submit, …)
 * @param {() => void | Promise<void>} options.runAction — mutation / submit handler
 * @param {() => boolean | void | Promise<boolean | void>} [options.validate] — return false to abort (after setting field errors in caller)
 * @param {string} [options.recordLabel]
 * @param {string} [options.submitLabel] — for action `submit`
 * @param {'nested' | 'base'} [options.stack] — `base` for inline page forms; `nested` only when another modal is already open (e.g. picker)
 * @param {string} [options.successMessage] — toast after success (overrides action default)
 * @param {boolean} [options.showSuccessToast] — set false to skip success toast
 * @param {string} [options.message] — confirm dialog message (overrides the action default)
 * @param {string} [options.confirmMessage] — alias for `message` (legacy callers)
 * @param {string} [options.title]
 * @param {string} [options.description]
 * @returns {boolean} false if validation failed; true if confirm was shown or action started
 */
export function confirmBeforeAction(requestConfirm, {
  action,
  runAction,
  validate,
  recordLabel,
  submitLabel,
  stack = 'base',
  successMessage,
  showSuccessToast,
  message,
  confirmMessage,
  title,
  description,
}) {
  const dialogMessage = message ?? confirmMessage
  const openConfirm = () => {
    if (requestConfirm) {
      requestConfirm(runAction, {
        action,
        recordLabel,
        submitLabel,
        stack,
        successMessage,
        showSuccessToast,
        message: dialogMessage,
        title,
        description,
      })
      return true
    }

    void (async () => {
      const result = await runAction()
      if (result === false) {
        return
      }
      if (showSuccessToast !== false) {
        const message = successMessage ?? getActionSuccessToastMessage(action)
        if (message) {
          showAppToast(message, 'success', { action })
        }
      }
    })()
    return true
  }

  if (typeof validate === 'function') {
    void (async () => {
      const valid = await validate()
      if (valid === false) {
        return
      }
      openConfirm()
    })()
    return true
  }

  return openConfirm()
}

/** Standard save vs update action for add/edit modals. */
export function saveOrUpdateConfirmAction(isEditing) {
  return isEditing ? 'update' : 'save'
}

/** Pass to `confirmBeforeAction` `validate` so RHF runs before the confirm dialog (probity-ui §3.9). */
export async function validateTriggerForm(trigger) {
  if (typeof trigger !== 'function') {
    return true
  }
  return trigger()
}
