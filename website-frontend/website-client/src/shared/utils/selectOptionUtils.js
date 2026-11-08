/** Map string arrays (e.g. HRMS departments) to SelectField `{ value, label }` options. */
export function stringsToSelectOptions(items = [], { exclude = [] } = {}) {
  const skip = new Set(exclude)
  return items.filter((item) => item != null && !skip.has(item)).map((item) => ({ value: item, label: item }))
}
