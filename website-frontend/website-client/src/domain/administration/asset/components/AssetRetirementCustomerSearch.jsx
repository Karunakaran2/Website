import { useMemo } from 'react'
import { toSelectOptions } from '@/shared/utils/selectOptions'

const SELECT_CLASS =
  'w-full min-w-[10rem] rounded-md border border-slate-300 px-2 py-1 text-sm disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500'

/** Customer dropdown for retirement preview / edit (same party list as sales voucher). */
export default function AssetRetirementCustomerSearch({
  value,
  onChange,
  customers = [],
  disabled,
}) {
  const options = useMemo(
    () => toSelectOptions(customers, ['partyName'], ['id', 'idMask']),
    [customers],
  )

  const selectValue = useMemo(() => {
    const raw = value != null && value !== '' ? String(value) : ''
    if (!raw) {
      return ''
    }
    if (options.some((opt) => opt.value === raw)) {
      return raw
    }
    const customer = customers.find(
      (row) => String(row.id ?? '') === raw || String(row.idMask ?? '') === raw,
    )
    if (!customer) {
      return ''
    }
    const resolved = options.find((opt) => opt.raw === customer)
    return resolved?.value ?? ''
  }, [value, options, customers])

  return (
    <select
      className={SELECT_CLASS}
      disabled={disabled}
      value={selectValue}
      aria-label="Customer"
      onChange={(event) => onChange?.(event.target.value)}
    >
      <option value="">Select customer</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
