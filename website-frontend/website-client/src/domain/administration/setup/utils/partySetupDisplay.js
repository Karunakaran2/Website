const PARTY_TYPE_LABELS = {
  CUSTOMER: 'Customer',
  C: 'Customer',
  VENDOR: 'Vendor',
  V: 'Vendor',
  BOTH: 'Both',
  B: 'Both',
}

/** List/table label for client-details party type (API or DB codes). */
export function partyTypeListLabel(partyType) {
  if (partyType == null || String(partyType).trim() === '') {
    return '-'
  }
  const key = String(partyType).trim().toUpperCase()
  return PARTY_TYPE_LABELS[key] ?? String(partyType).trim()
}

/** Empty/null → dash for setup listing cells. */
export function setupListCellText(value) {
  if (value == null) {
    return '-'
  }
  const text = String(value).trim()
  return text || '-'
}

export function partyListPhone(row) {
  return setupListCellText(row?.phnNo ?? row?.phoneNo)
}

export function partyListEmail(row) {
  return setupListCellText(row?.mailId ?? row?.emailId)
}

export function partyListGstin(row) {
  return setupListCellText(row?.gstin ?? row?.gstinNo)
}

/** Mask bank account number for read-only party detail views (probity 2.0 parity). */
export function maskPartyBankAccountNumber(accountNumber) {
  if (accountNumber == null || String(accountNumber).trim() === '') {
    return '-'
  }
  const digits = String(accountNumber).replace(/\s/g, '')
  if (digits.length <= 4) {
    return digits
  }
  return `******${digits.slice(-4)}`
}
