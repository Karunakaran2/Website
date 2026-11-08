import { formatIndianAmountForInput } from '@/shared/utils/probityFormat'
import { createEmptyAssetMaintenanceForm } from '../constants/assetMaintenance'

/** HTML date inputs require yyyy-MM-dd; normalize legacy dd/MM/yyyy list values. */
export function normalizeMaintenanceDateInput(value) {
  if (value == null || value === '') {
    return ''
  }
  const raw = String(value).trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return raw
  }
  const slashMatch = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(raw)
  if (slashMatch) {
    const [, day, month, year] = slashMatch
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }
  return raw
}

export function assetMaintenanceRowToForm(row) {
  if (!row) {
    return createEmptyAssetMaintenanceForm()
  }
  return {
    idMask: row.idMask ?? '',
    assetInformationIdMask: row.assetInformationIdMask ?? '',
    assetId: row.assetId ?? '',
    assetDescription: row.assetDescription ?? '',
    maintenanceDateStr: normalizeMaintenanceDateInput(row.maintenanceDate),
    maintenanceType: row.maintenanceType ?? 'C',
    vendorIdMask: row.vendorIdMask ?? '',
    vendorName: row.vendorName ?? '',
    purchaseInvoiceIdMask: row.purchaseInvoiceIdMask ?? '',
    nextDueDateStr: normalizeMaintenanceDateInput(row.nextDueDate),
    cost:
      row.cost != null && row.cost !== ''
        ? formatIndianAmountForInput(row.cost)
        : '',
    underWarranty: Boolean(row.underWarranty),
    maintenanceDescription: row.description ?? '',
    status: row.status ?? 'C',
    approve: row.approve ?? 'N',
    workflowStatus: row.workflowStatus ?? 'I',
    canSubmit: row.canSubmit,
    canForward: row.canForward,
    canVerify: row.canVerify,
    canApprove: row.canApprove,
  }
}
