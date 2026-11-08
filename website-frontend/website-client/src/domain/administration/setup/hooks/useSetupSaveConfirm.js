import { useCallback } from 'react'
import { useSetupFormSaveRequest } from './useSetupFormSaveRequest'

/**
 * @deprecated Prefer `useSetupFormSaveRequest` + validate before confirm.
 * Kept for screens that pass `(values, runSave, validate)`.
 */
export function useSetupSaveConfirm(isEditing) {
  const requestSave = useSetupFormSaveRequest(isEditing)

  return useCallback(
    (values, runSave, validate) => {
      requestSave(() => runSave(values), validate)
    },
    [requestSave],
  )
}
