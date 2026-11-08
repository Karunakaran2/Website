import { FormLabel, inputControlClass } from '@/shared/components/forms'

export default function DashboardYearFilter({
  id = 'dashboard-financial-year',
  label = 'Financial Year',
  value,
  options = [],
  onChange,
  disabled = false,
}) {
  return (
    <div className="flex flex-nowrap items-center gap-2">
      <FormLabel
        label={label}
        htmlFor={id}
        className="!mb-0 !inline-block !w-auto shrink-0 whitespace-nowrap"
      />
      <select
        id={id}
        name={id}
        aria-label={label}
        disabled={disabled}
        className={`${inputControlClass} !mt-0 !h-9 !min-h-9 !max-h-9 !w-[8.5rem] !max-w-[8.5rem] shrink-0 py-1.5 text-xs uppercase`}
        value={value || ''}
        onChange={(event) => onChange?.(event.target.value)}
      >
        {options.map((year) => (
          <option key={year} value={year}>
            {year.replace('-', ' - ')}
          </option>
        ))}
      </select>
    </div>
  )
}
