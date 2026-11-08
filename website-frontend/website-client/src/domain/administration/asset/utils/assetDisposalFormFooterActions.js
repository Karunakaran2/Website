/** Asset disposal workflow status codes (probity asset_disposal.workflow_status). */
export function normalizeAssetDisposalWorkflowStatus(status) {
  const code = String(status ?? 'I').trim().toUpperCase()
  if (code === 'S' || code === 'V' || code === 'A') {
    return code
  }
  return 'I'
}

function workflowActionAllowed(flag, hasCapabilities) {
  if (!hasCapabilities) {
    return true
  }
  return flag === true
}

function verifyAllowedOnInitiatedDraft({ hasCapabilities, canVerify, canForward }) {
  if (!hasCapabilities) {
    return true
  }
  if (canVerify === false && canForward !== true) {
    return false
  }
  return true
}

export function isDisposalFinallyApproved(row) {
  const status = row?.status
  if (status === 'A' || status === 'a') {
    return true
  }
  const workflow = normalizeAssetDisposalWorkflowStatus(row?.workflowStatus)
  return workflow === 'A'
}

export function resolveAssetDisposalFormFooterActions({
  workflowStatus,
  hasId,
  canSubmit,
  canForward,
  canVerify,
  canApprove,
  isFinallyApproved,
}) {
  const statusCode = normalizeAssetDisposalWorkflowStatus(workflowStatus)
  const lockedAfterVerify = statusCode === 'V' || statusCode === 'A' || isFinallyApproved
  const hasCapabilities =
    canSubmit !== undefined
    || canForward !== undefined
    || canVerify !== undefined
    || canApprove !== undefined

  return {
    statusCode,
    showDraftSave: !hasId,
    showUpdate:
      Boolean(hasId)
      && !lockedAfterVerify
      && (statusCode === 'I'
        || (statusCode === 'S'
          && (!hasCapabilities
            || canVerify !== false
            || canForward !== false))),
    showSubmit:
      Boolean(hasId)
      && statusCode === 'I'
      && hasCapabilities
      && canSubmit === true
      && canVerify === false,
    showVerify:
      Boolean(hasId)
      && !isFinallyApproved
      && (statusCode === 'I'
        ? verifyAllowedOnInitiatedDraft({ hasCapabilities, canVerify, canForward })
        : statusCode === 'S' && workflowActionAllowed(canVerify, hasCapabilities)),
    showApprove:
      Boolean(hasId)
      && statusCode === 'V'
      && !isFinallyApproved
      && (!hasCapabilities || canApprove === true),
    showForward:
      Boolean(hasId)
      && !isFinallyApproved
      && (statusCode === 'I' || statusCode === 'S')
      && workflowActionAllowed(canForward, hasCapabilities),
    lockedAfterVerify,
    readOnlyForm: isFinallyApproved || statusCode === 'A' || statusCode === 'V',
  }
}

function rowHasWorkflowCapabilities(row) {
  return (
    row?.canForward != null
    || row?.canVerify != null
    || row?.canSubmit != null
    || row?.canApprove != null
  )
}

/** List row edit — initiated workflow only (not finally approved). */
export function canEditAssetDisposalFromList(row) {
  if (isDisposalFinallyApproved(row)) {
    return false
  }
  const status = normalizeAssetDisposalWorkflowStatus(row?.workflowStatus ?? 'I')
  if (status !== 'I') {
    return false
  }
  if (!rowHasWorkflowCapabilities(row)) {
    return true
  }
  return (
    row.canForward === true
    || row.canVerify === true
    || row.canSubmit === true
  )
}

export function canDeleteAssetDisposalFromList(row) {
  return canEditAssetDisposalFromList(row)
}
