const PREFERRED_LABEL_KEYS = [
  'partyName',
  'accountName',
  'setupName',
  'costCentreName',
  'officeName',
  'hoaName',
  'accountNumber',
  'serviceType',
  'description',
  'tallyName',
  'allocatedFor',
  'userName',
]

export function setupRowDeleteDescription(row, master) {
  if (!row || typeof row !== 'object') {
    return undefined
  }

  for (const key of PREFERRED_LABEL_KEYS) {
    const value = row[key]
    if (value != null && String(value).trim()) {
      return String(value).trim()
    }
  }

  const columns = master?.columns ?? []
  for (const column of columns) {
    if (typeof column.accessor === 'string' && row[column.accessor] != null) {
      const text = String(row[column.accessor]).trim()
      if (text) {
        return text
      }
    }
  }

  return undefined
}
