/** Asset maintenance workflow status codes (probity asset_maintenance.workflow_status). */
export function normalizeAssetMaintenanceWorkflowStatus(status) {
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

export function resolveAssetMaintenanceFormFooterActions({
  workflowStatus,
  hasId,
  canSubmit,
  canForward,
  canVerify,
  canApprove,
  isFinallyApproved,
}) {
  const statusCode = normalizeAssetMaintenanceWorkflowStatus(workflowStatus)
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

export function canEditAssetMaintenanceFromList(row) {
  if (isMaintenanceFinallyApproved(row)) {
    return false
  }
  const status = normalizeAssetMaintenanceWorkflowStatus(row?.workflowStatus ?? row?.approve)
  if (status === 'I') {
    if (!rowHasWorkflowCapabilities(row)) {
      return true
    }
    return (
      row.canForward === true
      || row.canVerify === true
      || row.canSubmit === true
    )
  }
  const hasCapabilities = rowHasWorkflowCapabilities(row)
  if (!hasCapabilities) {
    return status === 'S' || status === 'V'
  }
  if (status === 'S') {
    return row.canForward === true || row.canVerify === true
  }
  if (status === 'V') {
    return row.canApprove === true
  }
  return false
}

export function isMaintenanceFinallyApproved(row) {
  const approve = row?.approve
  return approve === 'A' || approve === 'a'
}
