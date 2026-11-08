import { useCallback } from 'react'
import { showAppToast } from '@/shared/components'
import { confirmBeforeAction } from '@/shared/components/confirm'
import { validateAssetInformationForm } from '../utils/assetInformationValidation'
import {
  isAssetInformationApproved,
  isAssetInformationVerified,
} from '../utils/assetInformationStatus'

/** Approve on edit only when capitalisation is verified (V). */
export function canShowAssetInformationApprove({ idMask, status }) {
  return Boolean(String(idMask ?? '').trim()) && isAssetInformationVerified(status)
}

export async function runAssetInformationApproveFlow({
  idMask,
  approveAssetInformation,
}) {
  return approveAssetInformation(idMask).unwrap()
}

export function useAssetInformationApprove({
  requestConfirm,
  formValues,
  editingIdMask,
  setFieldErrors,
  setFormError,
  saveAssetInformation,
  approveAssetInformation,
  closeForm,
  refetch,
  setPage,
}) {
  const showApprove = canShowAssetInformationApprove({
    idMask: editingIdMask,
    status: formValues.status,
  })

  const validateForApprove = useCallback(() => {
    const validation = validateAssetInformationForm(formValues)
    if (!validation.valid) {
      setFieldErrors(validation.fieldErrors)
      setFormError('Please correct the highlighted fields before approving.')
      return false
    }
    if (!editingIdMask) {
      setFormError('Save the asset before approving.')
      return false
    }
    if (isAssetInformationApproved(formValues.status)) {
      setFormError('This asset is already approved. Use View All Assets to edit the description.')
      return false
    }
    if (!isAssetInformationVerified(formValues.status)) {
      setFormError('Verify the asset before approving.')
      return false
    }
    return true
  }, [editingIdMask, formValues, setFieldErrors, setFormError])

  const handleApprove = useCallback(async () => {
    if (!validateForApprove()) {
      return false
    }
    try {
      await runAssetInformationApproveFlow({
        idMask: editingIdMask,
        approveAssetInformation,
      })
      closeForm()
      refetch()
      setPage(1)
      showAppToast(
        'Asset approved successfully. It will appear under View All Assets.',
        'success',
      )
      return true
    } catch (error) {
      const serverFieldErrors =
        error?.data?.fieldErrors ?? error?.payload?.fieldErrors
      if (serverFieldErrors && typeof serverFieldErrors === 'object') {
        setFieldErrors(serverFieldErrors)
      }
      setFormError(error?.data?.message || error?.message || 'Unable to approve asset.')
      return false
    }
  }, [
    approveAssetInformation,
    closeForm,
    editingIdMask,
    refetch,
    setFieldErrors,
    setFormError,
    setPage,
    validateForApprove,
  ])

  const handleApproveRequest = useCallback(() => {
    confirmBeforeAction(requestConfirm, {
      action: 'approve',
      recordLabel: formValues.assetId || formValues.assetDescription || undefined,
      stack: 'nested',
      validate: validateForApprove,
      runAction: handleApprove,
    })
  }, [formValues.assetDescription, formValues.assetId, handleApprove, requestConfirm, validateForApprove])

  return {
    showApprove,
    handleApproveRequest,
  }
}
