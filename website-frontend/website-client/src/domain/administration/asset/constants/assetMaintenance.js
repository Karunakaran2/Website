/** Fixed assets maintenance — entry form and listing (legacy assetsMaintenance). */

import { formatIndianAmountOrDash } from '@/shared/utils/probityFormat'

export const MAINTENANCE_TYPE_OPTIONS = [
  { value: 'C', label: 'Corrective' },
  { value: 'U', label: 'Upgrade' },
]

export const MAINTENANCE_STATUS_OPTIONS = [
  { value: 'S', label: 'Scheduled' },
  { value: 'C', label: 'Completed' },
]

/** List filter: workflow approve column (draft = N, approved = A). */
export const MAINTENANCE_WORKFLOW_FILTER_DEFAULT = 'draft'

export const MAINTENANCE_WORKFLOW_FILTER_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'approved', label: 'Approved' },
]

export const MAINTENANCE_APPROVE_PENDING = 'N'
export const MAINTENANCE_APPROVE_DONE = 'A'

export function createEmptyAssetMaintenanceForm() {
  const today = new Date().toISOString().slice(0, 10)
  return {
    idMask: '',
    assetInformationIdMask: '',
    assetDescription: '',
    maintenanceDateStr: today,
    nextDueDateStr: '',
    maintenanceType: 'C',
    vendorIdMask: '',
    vendorName: '',
    purchaseInvoiceIdMask: '',
    cost: '',
    underWarranty: false,
    maintenanceDescription: '',
    status: 'C',
    approve: MAINTENANCE_APPROVE_PENDING,
    workflowStatus: 'I',
    canSubmit: undefined,
    canForward: undefined,
    canVerify: undefined,
    canApprove: undefined,
  }
}

export function maintenanceTypeLabel(code) {
  return MAINTENANCE_TYPE_OPTIONS.find((opt) => opt.value === code)?.label ?? code ?? '—'
}

export function maintenanceStatusLabel(code) {
  return MAINTENANCE_STATUS_OPTIONS.find((opt) => opt.value === code)?.label ?? code ?? '—'
}

export function maintenanceWorkflowLabel(approveCode, workflowStatus) {
  if (approveCode === MAINTENANCE_APPROVE_DONE || approveCode === 'A') {
    return 'Approved'
  }
  const code = String(workflowStatus ?? 'I').trim().toUpperCase()
  if (code === 'S') return 'Submitted'
  if (code === 'V') return 'Verified'
  if (code === 'A') return 'Approved'
  if (approveCode === MAINTENANCE_APPROVE_PENDING || approveCode === 'N') {
    return 'Draft'
  }
  return approveCode ?? '—'
}

export function formatMaintenanceCost(value) {
  if (value == null || value === '') {
    return '—'
  }
  const num = Number(value)
  if (Number.isNaN(num)) {
    return value
  }
  return formatIndianAmountOrDash(value)
}

export function underWarrantyLabel(flag) {
  return flag ? 'Yes' : 'No'
}

export function isMaintenanceApproved(approve) {
  return approve === MAINTENANCE_APPROVE_DONE || approve === 'A'
}
