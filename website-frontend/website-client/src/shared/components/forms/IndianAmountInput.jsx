import { Controller } from 'react-hook-form'
import {
  formatIndianAmountInputValue as formatIndianAmountBlur,
  INDIAN_AMOUNT_INPUT_ZERO,
  sanitizeDecimalAmountInput,
} from '@/shared/utils/probityFormat'
import { AMOUNT_INPUT_MAX_LENGTH } from '@/shared/utils/fieldValidationRules'
import { FieldError, inputControlClass } from './FormFields'
import { voucherGridControlShellClass } from './tailwreckFormShell'

/** @deprecated import from `@/shared/utils/probityFormat` */
export { formatIndianAmountInputValue } from '@/shared/utils/probityFormat'

/**
 * Controlled money input (en-IN commas on blur). Form state may contain commas;
 * always {@link parseAmount} / {@link toApiAmount} when building request bodies.
 */
export default function IndianAmountInput({
  control,
  name,
  readOnly = false,
  disabled = false,
  className = '',
  placeholder = INDIAN_AMOUNT_INPUT_ZERO,
  emptyAsZero = true,
  sanitizeInput = false,
  rules,
  onBlur: onBlurExtra,
  onChange: onChangeExtra,
  'aria-label': ariaLabel,
}) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const showFormatted = readOnly || disabled
        const blurOptions = { emptyAsZero }
        const displayValue = showFormatted
          ? formatIndianAmountBlur(field.value, blurOptions)
          : (field.value ?? '')
        const invalid = Boolean(fieldState.error?.message)
        const invalidClass = invalid
          ? '!border-rose-400 focus:!border-rose-500 focus:!ring-rose-400'
          : ''

        return (
          <div className="flex min-w-0 w-full flex-col" data-form-field-anchor={field.name}>
            <div className={voucherGridControlShellClass}>
              <input
                type="text"
                inputMode="decimal"
                maxLength={AMOUNT_INPUT_MAX_LENGTH}
                name={field.name}
                aria-label={ariaLabel}
                aria-invalid={invalid || undefined}
                readOnly={readOnly}
                disabled={disabled}
                placeholder={placeholder}
                className={`${inputControlClass} ${invalidClass} ${className}`.trim()}
                value={displayValue}
                onChange={(event) => {
                  if (showFormatted) return
                  const nextValue = sanitizeInput
                    ? sanitizeDecimalAmountInput(event.target.value)
                    : event.target.value
                  field.onChange(nextValue)
                  onChangeExtra?.(event)
                }}
                onBlur={(event) => {
                  if (!readOnly && !disabled) {
                    field.onChange(formatIndianAmountBlur(event.target.value, blurOptions))
                  }
                  field.onBlur()
                  onBlurExtra?.(event)
                }}
              />
            </div>
            <FieldError message={fieldState.error?.message} />
          </div>
        )
      }}
    />
  )
}
