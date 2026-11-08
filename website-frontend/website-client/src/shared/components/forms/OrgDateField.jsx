import { useTranslation } from 'react-i18next'
import { InputField } from '@/shared/components/forms'
import { orgProbityControlHeightClass } from '@/shared/components/forms/tailwreckFormShell'
import { Controller } from 'react-hook-form'
import { parseDisplayDate } from '@/shared/utils/probityFormat'

/** HTML date input (yyyy-MM-dd) ↔ form value (Date). */
export function toNativeDateInputValue(value) {
  if (value == null || value === '') return ''
  const date =
    value instanceof Date ? value : parseDisplayDate(value) || new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function fromNativeDateInputValue(value) {
  if (!value) return null
  const parsed = parseDisplayDate(value)
  if (parsed) return parsed
  const [year, month, day] = String(value).slice(0, 10).split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

/**
 * Org / voucher date field — native calendar date picker.
 * Form value remains a Date (or null). Lists/modals still use formatDisplayDate (dd-mm-yyyy).
 */
export default function OrgDateField({
  control,
  name,
  label,
  required = false,
  placeholder,
  rules,
  disabled = false,
  className = '',
  value,
  onChange,
  error,
  ...rest
}) {
  const { t } = useTranslation()
  const resolvedPlaceholder = placeholder ?? t('form.placeholder.date')

  if (!control) {
    return (
      <InputField
        className={`${orgProbityControlHeightClass} ${className}`.trim()}
        wrapperClassName="min-w-0"
        label={label}
        required={required}
        type="date"
        name={name}
        id={rest.id ?? name}
        disabled={disabled}
        placeholder={resolvedPlaceholder}
        value={toNativeDateInputValue(value)}
        onChange={onChange}
        error={error}
        {...rest}
      />
    )
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <InputField
          className={`${orgProbityControlHeightClass} ${className}`.trim()}
          wrapperClassName="min-w-0"
          label={label}
          required={required}
          type="date"
          name={field.name}
          id={field.name}
          disabled={disabled}
          placeholder={resolvedPlaceholder}
          value={toNativeDateInputValue(field.value)}
          onChange={(event) =>
            field.onChange(fromNativeDateInputValue(event.target.value))
          }
          onBlur={field.onBlur}
          error={fieldState.error?.message || error}
          {...rest}
        />
      )}
    />
  )
}
