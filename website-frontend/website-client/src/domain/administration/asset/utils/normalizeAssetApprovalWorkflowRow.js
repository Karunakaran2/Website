import { formatDisplayDateOrDash } from '@/shared/utils/probityFormat'

/** Defaults empty party/date fields for asset approval workflow table rows. */
export function normalizeAssetApprovalWorkflowRow(row) {
  if (!row?.idMask) {
    return null
  }
  return {
    ...row,
    idMask: String(row.idMask),
    receivedFrom: row.receivedFrom || '—',
    receivedOn: row.receivedOn,
    receivedOnDisplay: formatDisplayDateOrDash(row.receivedOn),
    forwardedTo: row.forwardedTo || '—',
    forwardedOn: row.forwardedOn,
    forwardedOnDisplay: formatDisplayDateOrDash(row.forwardedOn),
    approvedBy: row.approvedBy || '—',
    approvedOn: row.approvedOn,
    approvedOnDisplay: formatDisplayDateOrDash(row.approvedOn),
  }
}
