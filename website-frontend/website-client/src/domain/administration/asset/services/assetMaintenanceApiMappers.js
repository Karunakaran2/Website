import { parseAmount } from '@/shared/utils/probityFormat'
import {
  journalLineDisplayAmount,
  normalizeJournalEntryDisplayType,
} from '../utils/normalizeJournalEntryDisplayType'

export function mapMaintenanceListItem(dto) {
  if (!dto) {
    return null
  }
  return {
    idMask: dto.idMask ?? '',
    assetInformationIdMask: dto.assetInformationIdMask ?? '',
    assetId: dto.assetId ?? '',
    assetDescription: dto.assetDescription ?? '',
    description: dto.description ?? '',
    maintenanceDate: dto.maintenanceDate ?? '',
    maintenanceType: dto.maintenanceType ?? '',
    vendorIdMask: dto.vendorIdMask ?? '',
    vendorName: dto.vendorName ?? '',
    purchaseInvoiceIdMask: dto.purchaseInvoiceIdMask ?? '',
    purchaseInvoice: dto.purchaseInvoice ?? '',
    nextDueDate: dto.nextDueDate ?? '',
    cost: dto.cost ?? '',
    underWarranty: Boolean(dto.underWarranty),
    status: dto.status ?? '',
    approve: dto.approve ?? '',
    workflowStatus: dto.workflowStatus ?? 'I',
    canSubmit: dto.canSubmit,
    canForward: dto.canForward,
    canVerify: dto.canVerify,
    canApprove: dto.canApprove,
  }
}

export function mapMaintenanceWorkflowRow(dto) {
  if (!dto) {
    return null
  }
  return {
    idMask: dto.idMask ?? '',
    workflowStatus: dto.workflowStatus ?? '',
    assetId: dto.assetId ?? '',
    assetDescription: dto.assetDescription ?? '',
    maintenanceDate: dto.maintenanceDate ?? '',
    description: dto.description ?? '',
    receivedFrom: dto.receivedFrom ?? '',
    receivedOn: dto.receivedOn,
    forwardedTo: dto.forwardedTo ?? '',
    forwardedOn: dto.forwardedOn,
    approvedBy: dto.approvedBy ?? '',
    approvedOn: dto.approvedOn,
    isRead: dto.isRead,
    canForward: dto.canForward,
    canVerify: dto.canVerify,
    canApprove: dto.canApprove,
  }
}

/** One draft maintenance row per asset (list is sorted newest-first). */
export function dedupeDraftMaintenanceRows(rows) {
  if (!rows?.length) {
    return []
  }
  const byAsset = new Map()
  for (const row of rows) {
    const key =
      String(row.assetInformationIdMask ?? '').trim() ||
      String(row.assetId ?? '').trim() ||
      row.idMask
    if (!byAsset.has(key)) {
      byAsset.set(key, row)
    }
  }
  return Array.from(byAsset.values())
}

export function mapMaintenanceSearchResponse(payload, statusFilter = '') {
  let rows = (payload?.rows ?? []).map(mapMaintenanceListItem).filter(Boolean)
  const apiTotal = payload?.total ?? rows.length
  if (statusFilter === 'draft') {
    const beforeCount = rows.length
    rows = dedupeDraftMaintenanceRows(rows)
    const removedOnPage = beforeCount - rows.length
    return {
      rows,
      total: removedOnPage > 0 ? Math.max(rows.length, apiTotal - removedOnPage) : apiTotal,
    }
  }
  return {
    rows,
    total: apiTotal,
  }
}

export function mapMaintenanceAssetOption(dto) {
  if (!dto?.idMask) {
    return null
  }
  return {
    idMask: dto.idMask,
    label: dto.label ?? dto.idMask,
    assetDescription: dto.assetDescription ?? '',
  }
}

/** Hide assets that already have a draft maintenance row; keep current asset when editing. */
export function filterMaintenanceAssetOptions(options, draftAssetIdMasks, keepIdMask = '') {
  const blocked = draftAssetIdMasks instanceof Set ? draftAssetIdMasks : new Set(draftAssetIdMasks ?? [])
  return (options ?? []).filter(
    (opt) => opt?.idMask && (!blocked.has(opt.idMask) || opt.idMask === keepIdMask),
  )
}

export function withMaintenanceAssetOptionForEdit(options, formValues) {
  const idMask = String(formValues?.assetInformationIdMask ?? '').trim()
  if (!idMask || (options ?? []).some((opt) => opt.idMask === idMask)) {
    return options ?? []
  }
  const assetId = String(formValues?.assetId ?? '').trim()
  const desc = String(formValues?.assetDescription ?? '').trim()
  const label = assetId ? (desc ? `${assetId} — ${desc}` : assetId) : idMask
  return [{ idMask, label, assetDescription: desc }, ...(options ?? [])]
}

export function mapMaintenanceVendorOption(dto) {
  if (!dto?.idMask) {
    return null
  }
  return {
    idMask: dto.idMask,
    label: dto.partyName ?? dto.idMask,
  }
}

export function mapMaintenanceInvoiceOption(dto) {
  if (!dto?.idMask) {
    return null
  }
  return {
    idMask: dto.idMask,
    label: dto.label ?? dto.idMask,
    vendorIdMask: dto.vendorIdMask ?? '',
    vendorName: dto.vendorName ?? '',
  }
}

export function mapMaintenanceJournalLine(dto) {
  if (!dto) {
    return null
  }
  const entryType = normalizeJournalEntryDisplayType(
    dto.entryType,
    dto.debitAmount,
    dto.creditAmount,
  )
  return {
    entryType,
    hoaName: dto.hoaName ?? '—',
    amount: journalLineDisplayAmount(dto.entryType, dto.debitAmount, dto.creditAmount),
  }
}

function normalizeMaintenanceCostForApi(cost) {
  const parsed = parseAmount(cost)
  if (parsed != null && Number.isFinite(parsed)) {
    return String(parsed)
  }
  return cost == null ? '' : String(cost)
}

export function maintenanceFormToSaveRequest(form) {
  return {
    idMask: form.idMask || undefined,
    assetInformationIdMask: form.assetInformationIdMask,
    maintenanceDateStr: form.maintenanceDateStr,
    maintenanceType: form.maintenanceType || 'C',
    vendorIdMask: form.vendorIdMask,
    purchaseInvoiceIdMask: form.purchaseInvoiceIdMask || undefined,
    nextDueDateStr:
      form.nextDueDateStr != null && String(form.nextDueDateStr).trim() !== ''
        ? String(form.nextDueDateStr).trim()
        : undefined,
    cost: normalizeMaintenanceCostForApi(form.cost),
    underWarranty: Boolean(form.underWarranty),
    description: form.maintenanceDescription ?? form.description ?? '',
    status: form.status || 'C',
  }
}

export function mapMaintenanceSortField(sortBy) {
  const allowed = new Set([
    'assetId',
    'assetDescription',
    'description',
    'maintenanceDate',
    'vendorName',
    'cost',
    'approve',
  ])
  return allowed.has(sortBy) ? sortBy : 'maintenanceDate'
}
