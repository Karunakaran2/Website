const ACRONYMS = new Set([
  'ID',
  'API',
  'GSTIN',
  'GST',
  'CGST',
  'SGST',
  'IGST',
  'PF',
  'PAN',
  'TAN',
  'IFSC',
  'UAN',
  'HR',
  'IT',
  'VAT',
  'KPI',
  'CSV',
  'PDF',
  'EMI',
])

/** Title Case for UI labels; preserves acronyms and existing mixed-case tokens. */
export function toUiLabelCase(input) {
  if (input == null || input === '') return ''
  const str = String(input).trim()
  if (!str) return ''

  return str
    .split(/\s+/)
    .map((word) => {
      const upper = word.toUpperCase()
      if (ACRONYMS.has(upper)) return upper
      if (/^[A-Z0-9-]+$/.test(word) && word.length <= 6) return word
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}

export function labelFromFieldKey(key) {
  if (!key) return ''
  const spaced = String(key)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
  return toUiLabelCase(spaced)
}
