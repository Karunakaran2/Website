import { ChevronDown } from 'lucide-react'
import { inputControlClass } from './FormFields'

/**
 * Native select used by org forms and table toolbars.
 * `onChange` receives the DOM change event.
 */
export default function BasicSelect({
  id,
  name,
  options = [],
  value = '',
  onChange,
  disabled = false,
  placeholder,
  className = '',
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedBy,
}) {
  const selected = value == null ? '' : String(value)

  return (
    <div className="relative w-full min-w-0">
      <select
        id={id}
        name={name}
        value={selected}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedBy}
        onChange={onChange}
        className={`${inputControlClass} appearance-none cursor-pointer pr-9 ${className}`.trim()}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option, index) => {
          const optionValue =
            typeof option === 'object' && option !== null ? (option.value ?? option.id ?? '') : option
          const label =
            typeof option === 'object' && option !== null
              ? (option.label ?? option.value ?? option.id ?? '')
              : option
          const normalized = optionValue == null ? '' : String(optionValue)
          return (
            <option key={`${normalized}-${index}`} value={normalized}>
              {label}
            </option>
          )
        })}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
        <ChevronDown size={16} aria-hidden />
      </div>
    </div>
  )
}
