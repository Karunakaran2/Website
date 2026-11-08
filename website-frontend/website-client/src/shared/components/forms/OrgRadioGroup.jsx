import { useTranslatedOptions } from '@/app/i18n/useTranslatedOptions'
import { FieldError, RadioGroup } from '@/shared/components/forms'

export default function OrgRadioGroup({
  name,
  label,
  options = [],
  value,
  onChange,
  required = false,
  action = null,
  error,
  className = '',
  disabled = false,
}) {
  const translatedOptions = useTranslatedOptions(options)

  return (
    <div className={`min-w-0 ${className}`.trim()}>
      <RadioGroup
        legend={label}
        name={name}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        options={translatedOptions}
        required={required}
        disabled={disabled}
        action={action}
      />
      <FieldError message={error} />
    </div>
  )
}
