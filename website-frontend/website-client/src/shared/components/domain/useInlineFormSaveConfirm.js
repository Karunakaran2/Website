import { useCallback } from 'react'
import {
  confirmBeforeAction,
  saveOrUpdateConfirmAction,
  useActionConfirm,
} from '@/shared/components/confirm'

/**
 * Save/update confirm for inline page forms ({@link DomainListWithFormModal}).
 * Uses `stack: 'base'` so only one dialog is shown (no form modal underneath).
 */
export default function useInlineFormSaveConfirm() {
  const requestConfirm = useActionConfirm()

  return useCallback(
    ({ isEditing, validate, runAction, recordLabel, action }) =>
      confirmBeforeAction(requestConfirm, {
        action: action ?? saveOrUpdateConfirmAction(Boolean(isEditing)),
        stack: 'base',
        recordLabel,
        validate,
        runAction,
      }),
    [requestConfirm],
  )
}
