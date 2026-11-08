import { normalizeAssetMaintenanceWorkflowStatus } from './assetMaintenanceFormFooterActions'

export function assetMaintenanceWorkflowStatusLabel(workflowStatus, approve) {
  if (approve === 'A' || approve === 'a') {
    return 'Approved'
  }
  const code = normalizeAssetMaintenanceWorkflowStatus(workflowStatus)
  switch (code) {
    case 'S':
      return 'Submitted'
    case 'V':
      return 'Verified'
    case 'A':
      return 'Approved'
    case 'I':
    default:
      return 'Draft'
  }
}
