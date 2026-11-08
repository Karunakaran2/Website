import { parseAmount } from '@/shared/utils/probityFormat'

export function validateAssetMaintenanceForm(values) {
  const fieldErrors = {}

  if (!String(values.assetInformationIdMask ?? '').trim()) {
    fieldErrors.assetInformationIdMask = 'Asset Id is required.'
  }

  if (!String(values.maintenanceDateStr ?? '').trim()) {
    fieldErrors.maintenanceDateStr = 'Maintenance date is required.'
  }

  if (!String(values.purchaseInvoiceIdMask ?? '').trim()) {
    fieldErrors.purchaseInvoiceIdMask = 'Purchase invoice is required.'
  }

  if (!String(values.vendorIdMask ?? '').trim()) {
    fieldErrors.vendorIdMask = 'Vendor is required. Select a purchase invoice.'
  }

  const costRaw = String(values.cost ?? '').trim()
  if (!costRaw) {
    fieldErrors.cost = 'Cost is required.'
  } else if (!Number.isFinite(parseAmount(costRaw)) || parseAmount(costRaw) < 0) {
    fieldErrors.cost = 'Enter a valid cost.'
  }

  if (!String(values.maintenanceDescription ?? '').trim()) {
    fieldErrors.maintenanceDescription = 'Maintenance description is required.'
  }

  return fieldErrors
}
