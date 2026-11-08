/**
 * Generic options mapper for select controls (OrgSelectField, FeaturedBasicSelect, etc.).
 */
export function toSelectOptions(
  rows,
  labelKeys,
  valueKeys = ['idMask', 'id', 'costId', 'hoaId', 'accountLedgerId']
) {
  return (rows ?? [])
    .map((row) => {
      const valueKey = valueKeys.find((key) => row?.[key] != null && row[key] !== '')
      const label = labelKeys
        .map((key) => row?.[key])
        .find((candidate) => candidate != null && String(candidate).trim() !== '')
      if (valueKey == null || !label) {
        return null
      }
      return { value: String(row[valueKey]), label: String(label), raw: row }
    })
    .filter(Boolean)
}

export const MANUAL_NUMBERING_OPTION = {
  value: '__manual__',
  label: 'Manual (Direct)',
}
