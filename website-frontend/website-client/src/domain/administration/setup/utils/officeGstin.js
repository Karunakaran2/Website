export function gstinFieldErrorKey(index) {
  return index === 0 ? 'gstNumber' : `gstNumber[${index}]`
}

export function normalizeGstin(value) {
  return String(value || '').trim().toUpperCase()
}

/** True when the typed GSTIN belongs to the office being edited. */
export function isExistingOfficeGstin(gstNumber, editingOffice, index = 0) {
  const value = normalizeGstin(gstNumber)
  if (!value) {
    return false
  }
  const currentGstin = normalizeGstin(editingOffice?.gstNumber)
  const currentEntryGstin = normalizeGstin(editingOffice?.gstAddressEntries?.[index]?.gstNumber)
  return value === currentGstin || value === currentEntryGstin
}
