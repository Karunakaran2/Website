export function validateAssetAllocationForm(values, { requireCustodian = true } = {}) {
  const fieldErrors = {}

  if (!String(values.assetInformationIdMask ?? '').trim()) {
    fieldErrors.assetInformationIdMask = 'Asset Id is required.'
  }

  if (requireCustodian && !String(values.custodianIdMask ?? '').trim()) {
    fieldErrors.custodianIdMask = 'New custodian is required.'
  }

  if (!String(values.allocationDateStr ?? '').trim()) {
    fieldErrors.allocationDateStr = 'Allocation date is required.'
  }

  return fieldErrors
}
