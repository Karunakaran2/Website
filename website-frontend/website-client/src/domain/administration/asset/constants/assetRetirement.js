/** Fixed asset retirement / disposal — process form and listing (legacy assetDisposal). */

import { formatIndianAmountForInput, formatIndianAmountOrDash } from '@/shared/utils/probityFormat'
import { normalizeAssetDisposalWorkflowStatus } from '../utils/assetDisposalFormFooterActions'

export const RETIREMENT_CATEGORY_OPTIONS = [
  { value: 'A', label: 'All Asset' },
  { value: 'S', label: 'Asset Class' },
  { value: 'T', label: 'Asset Type' },
  { value: 'I', label: 'Asset ID' },
  { value: 'C', label: 'Cost Center' },
  { value: 'L', label: 'Location' },
  { value: 'CS', label: 'Custodian' },
]

export const RETIREMENT_CATEGORY_SUGGESTIONS = {
  S: ['Building', 'Plant & Machinery', 'Motor Vehicles', 'Furniture & Fixtures'],
  T: ['BUILDING', 'PLANT', 'VEHICLE', 'COMPUTER'],
  I: ['FA-000101', 'FA-000205', 'FA-000301'],
  C: ['Development', 'Administrative', 'Estate', 'Finance Division'],
  L: ['Head Office', 'Warehouse Block A', 'SEEPZ Unit 12'],
  CS: ['Mr. Arjun A P', 'Stores In-charge', 'IT Custodian', 'Estate Officer'],
}

export const RETIREMENT_TYPE_OPTIONS = [
  { value: 'Sale', label: 'Sale' },
  { value: 'Scrap', label: 'Scrap' },
]

/** Form/preview row key; backend column is asset_disposal.sales_value (API salesValue). */
export const RETIREMENT_SALES_VALUE_FIELD = 'saleValue'

/** Disposal list column — one amount column for both Sale and Scrap retirements. */
export const RETIREMENT_SALES_VALUE_COLUMN_HEADER = 'Sales value'

export function retirementSalesValueLabel(retirementType) {
  const type = String(retirementType ?? '').trim()
  if (type === 'Scrap' || type === 'D') {
    return 'Scrap value'
  }
  if (type === 'Sale' || type === 'S') {
    return 'Sale value'
  }
  return RETIREMENT_SALES_VALUE_COLUMN_HEADER
}

export function createEmptyRetirementProcessForm() {
  const today = new Date().toISOString().slice(0, 10)
  return {
    retirementDateStr: today,
    retirementGroupId: '',
    previewCountDisposalNumber: '',
    category: 'A',
    categoryList: '',
  }
}


export function retirementCategoryRequiresList(category) {
  return category && category !== 'A'
}

export const RETIREMENT_STATUS_APPROVED = 'A'
export const RETIREMENT_STATUS_PENDING = 'N'

export function assetDisposalWorkflowStatusLabel(workflowStatus, status) {
  if (status === RETIREMENT_STATUS_APPROVED) {
    return 'Approved'
  }
  const code = normalizeAssetDisposalWorkflowStatus(workflowStatus)
  switch (code) {
    case 'S':
      return 'Submitted'
    case 'V':
      return 'Verified'
    case 'A':
      return 'Approved'
    case 'I':
    default:
      return 'Pending'
  }
}

export function createEmptyRetirementEditForm(row) {
  if (!row) {
    return {
      idMask: '',
      retirementType: 'Sale',
      saleValue: '',
      customerId: '',
      assetId: '',
      assetDescription: '',
      bookValue: '',
      assetCost: '',
      assetQty: '',
      gainOrLoss: '',
      journalLines: [],
      editable: false,
      approvable: false,
      workflowStatus: 'I',
      status: RETIREMENT_STATUS_PENDING,
      canSubmit: undefined,
      canForward: undefined,
      canVerify: undefined,
      canApprove: undefined,
    }
  }
  return {
    idMask: row.idMask ?? '',
    retirementType: row.retirementType ?? 'Sale',
    saleValue:
      row.saleValue != null && row.saleValue !== ''
        ? formatIndianAmountForInput(row.saleValue)
        : row.salesValue != null && row.salesValue !== ''
          ? formatIndianAmountForInput(row.salesValue)
          : '',
    customerId: row.customerId != null ? String(row.customerId) : '',
    assetId: row.assetId ?? '',
    assetDescription: row.assetDescription ?? '',
    bookValue: row.bookValue,
    assetCost: row.assetCost,
    assetQty: row.assetQty,
    gainOrLoss: row.gainOrLoss,
    journalLines: row.journalLines ?? [],
    editable: row.editable !== false,
    approvable: row.approvable !== false,
    workflowStatus: row.workflowStatus ?? 'I',
    status: row.status ?? RETIREMENT_STATUS_PENDING,
    canSubmit: row.canSubmit,
    canForward: row.canForward,
    canVerify: row.canVerify,
    canApprove: row.canApprove,
  }
}

export function formatRetirementMoney(value) {
  return formatIndianAmountOrDash(value)
}

export function retirementCategoryLabel(code) {
  return RETIREMENT_CATEGORY_OPTIONS.find((opt) => opt.value === code)?.label ?? code
}

