/** Approved capitalised asset (probity-2.0 status A/B). */
export function isAssetInformationApproved(status) {
  const code = String(status ?? '').trim().toUpperCase()
  return code === 'A' || code === 'B'
}

export function isAssetInformationVerified(status) {
  return String(status ?? '').trim().toUpperCase() === 'V'
}

export function isAssetInformationDraft(status) {
  return String(status ?? '').trim().toUpperCase() === 'I'
}

export function isAssetInformationSubmitted(status) {
  const code = String(status ?? '').trim().toUpperCase()
  return code === 'S' || code === 'V'
}

const WORKFLOW_STATUS_LABELS = {
  I: 'Saved',
  S: 'Submitted',
  V: 'Verified',
  A: 'Approved',
  B: 'Approved',
  D: 'Disposed',
}

export function assetInformationWorkflowStatusLabel(status) {
  const code = String(status ?? '').trim().toUpperCase()
  if (!code) {
    return '—'
  }
  return WORKFLOW_STATUS_LABELS[code] ?? code
}
