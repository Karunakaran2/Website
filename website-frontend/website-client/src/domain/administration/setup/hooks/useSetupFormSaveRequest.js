import { useCallback } from 'react'
import {
  confirmBeforeAction,
  saveOrUpdateConfirmAction,
} from '@/shared/components/confirm'
import { useActionConfirm } from '@/shared/components/confirm'

/** Open save/update confirm only after optional `validate` succeeds (nested modal). */
export function useSetupFormSaveRequest(isEditing) {
  const requestConfirm = useActionConfirm()

  return useCallback(
    (runSave, validate) => {
      confirmBeforeAction(requestConfirm, {
        action: saveOrUpdateConfirmAction(isEditing),
        stack: 'base',
        validate,
        runAction: runSave,
      })
    },
    [requestConfirm, isEditing],
  )
}
