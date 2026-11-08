import { parseAmount } from '@/shared/utils/probityFormat'

export function validateAssetInformationForm(values) {
  const fieldErrors = {}

  if (!String(values.assetDescription ?? '').trim()) {
    fieldErrors.assetDescription = 'Asset description is required.'
  }
  if (!values.faGroupIdMask) {
    fieldErrors.faGroupIdMask = 'Asset type is required.'
  }
  if (!values.capitalisationDate) {
    fieldErrors.capitalisationDate = 'Capitalisation date is required.'
  }
  if (!values.putToUseDate) {
    fieldErrors.putToUseDate = 'Put to use date is required.'
  }
  if (!values.costCenterId) {
    fieldErrors.costCenterId = 'Cost center is required.'
  }
  const custodian = String(values.custodianId ?? '').trim()
  if (!custodian || custodian === '0') {
    fieldErrors.custodianId = 'Custodian is required.'
  }
  const qty = String(values.assetQty ?? '').trim()
  if (!qty || Number(qty) <= 0) {
    fieldErrors.assetQty = 'Asset quantity must be greater than zero.'
  }
  const cost = String(values.assetCost ?? '').trim()
  if (!cost || !Number.isFinite(parseAmount(cost))) {
    fieldErrors.assetCost = 'Asset cost is required.'
  }

  return {
    valid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  }
}
