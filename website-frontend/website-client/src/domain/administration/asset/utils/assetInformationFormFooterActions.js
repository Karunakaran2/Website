/** Asset information workflow status codes (probity asset_information.status). */
export function normalizeAssetInformationStatus(status) {
  const code = String(status ?? 'I').trim().toUpperCase()
  if (code === 'S' || code === 'V' || code === 'A' || code === 'B') {
    return code === 'B' ? 'A' : code
  }
  return 'I'
}

/**
 * Footer actions on Asset Information edit modal (parity with journal vouchers).
 * I: Update + Verify (+ Forward for multi-user); S: Update + Verify + Forward; V: Approve; A: read-only.
 */
function workflowActionAllowed(flag, hasCapabilities) {
  if (!hasCapabilities) {
    return true
  }
  return flag === true
}

/** Draft (I): self-service uses Verify; show unless server explicitly denies. */
function verifyAllowedOnInitiatedDraft({ hasCapabilities, canVerify, canForward }) {
  if (!hasCapabilities) {
    return true
  }
  if (canVerify === false && canForward !== true) {
    return false
  }
  return true
}

export function resolveAssetInformationFormFooterActions({
  status,
  hasId,
  canSubmit,
  canForward,
  canVerify,
  canApprove,
}) {
  const statusCode = normalizeAssetInformationStatus(status)
  const lockedAfterVerify = statusCode === 'V' || statusCode === 'A'
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
      && (statusCode === 'I'
        ? verifyAllowedOnInitiatedDraft({ hasCapabilities, canVerify, canForward })
        : statusCode === 'S' && workflowActionAllowed(canVerify, hasCapabilities)),
    showApprove:
      Boolean(hasId)
      && statusCode === 'V'
      && (!hasCapabilities || canApprove === true),
    showForward:
      Boolean(hasId)
      && (statusCode === 'I' || statusCode === 'S')
      && workflowActionAllowed(canForward, hasCapabilities),
    lockedAfterVerify,
    readOnlyForm: statusCode === 'A' || statusCode === 'V',
  }
}

/** List row: Edit when draft or server allows a workflow action on this row. */
export function canEditAssetInformationFromList(row) {
  const status = typeof row === 'string' ? row : row?.status
  const code = normalizeAssetInformationStatus(status)
  if (code === 'I') {
    if (typeof row === 'string') {
      return true
    }
    const hasCapabilities =
      row?.canForward !== undefined || row?.canVerify !== undefined
    if (!hasCapabilities) {
      return true
    }
    return row.canForward === true || row.canVerify === true
  }
  if (typeof row === 'string') {
    return code === 'S' || code === 'V'
  }
  const hasCapabilities =
    row?.canForward !== undefined
    || row?.canVerify !== undefined
    || row?.canApprove !== undefined
  if (!hasCapabilities) {
    return code === 'S' || code === 'V'
  }
  if (code === 'S') {
    return row.canForward === true || row.canVerify === true
  }
  if (code === 'V') {
    return row.canApprove === true
  }
  return false
}
