/** Display IT depreciation rate as a percentage (not currency). */
export function formatDepreciationRate(rate) {
  if (rate == null || rate === '') {
    return '—'
  }
  const numeric = Number(rate)
  if (!Number.isFinite(numeric)) {
    return '—'
  }
  return `${numeric}%`
}
