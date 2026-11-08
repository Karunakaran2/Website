/** Resolve display label for select/radio option values (SPFO-style forms). */
export function resolveOptionLabel(value, options = []) {
  if (value == null || value === '') {
    return ''
  }
  const match = options.find(
    (opt) => String(typeof opt === 'string' ? opt : opt.value) === String(value),
  )
  if (!match) {
    return String(value)
  }
  return typeof match === 'string' ? match : match.label
}
