export function validateFaGroupForm(values) {
  /** @type {Record<string, string>} */
  const fieldErrors = {}

  const assetType = String(values.assetType ?? '').trim()
  if (!assetType) {
    fieldErrors.assetType = 'Asset type is required.'
  }

  if (!values.assetClassItId) {
    fieldErrors.assetClassItId = 'Asset class (IT) is required.'
  }

  if (!values.depreciable) {
    fieldErrors.depreciable = 'Depreciable is required.'
  }

  if (values.depreciable === 'Y') {
    const rate = String(values.depreciationRateIt ?? '').trim()
    if (rate === '' || Number.isNaN(Number(rate))) {
      fieldErrors.depreciationRateIt = 'Enter a valid depreciation rate.'
    }

    if (!values.depreciationMethod) {
      fieldErrors.depreciationMethod = 'Depreciation method is required.'
    }
  }

  return fieldErrors
}
