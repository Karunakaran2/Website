import { forwardRef } from 'react'
import {
  FieldError,
  FieldHint,
  FORM_FIELD_HINTS_ENABLED,
  buildFieldDescribedBy,
  inputControlClass,
  useFieldMessageIds,
} from './FormFields'
import FormLabel, { formFieldWrapperClass } from './FormLabel'
import { orgProbityControlSlotClass } from './tailwreckFormShell'
import { readOnlyInputClass } from './readOnlyFieldStyles'
import {
  formatIndianAmountInputValue,
  INDIAN_AMOUNT_INPUT_ZERO,
} from '@/shared/utils/probityFormat'
import { AMOUNT_INPUT_MAX_LENGTH } from '@/shared/utils/fieldValidationRules'

function resolveInputClassName({ readOnly, error, className = '' }) {
  const base = readOnly ? readOnlyInputClass : inputControlClass
  const errorClass = error ? '!border-rose-400 focus:!border-rose-500 focus:!ring-rose-400' : ''
  const extra = className.includes('input-field')
    ? className.replace(/\binput-field\b/g, '').replace(/\s+/g, ' ').trim()
    : className
  return `${base} ${errorClass} ${extra}`.trim()
}

/** Compact money control (tables, inline grids) — en-IN grouping on blur. */
export const IndianAmountBareInput = forwardRef(function IndianAmountBareInput(
  {
    value,
    onChange,
    onBlur,
    readOnly = false,
    disabled = false,
    className = '',
    placeholder = INDIAN_AMOUNT_INPUT_ZERO,
    emptyAsZero = true,
    'aria-label': ariaLabel,
    name,
    id,
  },
  ref,
) {
  const locked = readOnly || disabled
  const blurOptions = { emptyAsZero }
  const displayValue = locked ? formatIndianAmountInputValue(value, blurOptions) : (value ?? '')

  return (
    <input
      ref={ref}
      type="text"
      inputMode="decimal"
      maxLength={AMOUNT_INPUT_MAX_LENGTH}
      id={id}
      name={name}
      aria-label={ariaLabel}
      aria-invalid={undefined}
      readOnly={readOnly}
      disabled={disabled}
      placeholder={placeholder}
      className={className || inputControlClass}
      value={displayValue}
      onChange={(event) => {
        if (locked) return
        onChange?.(event)
      }}
      onBlur={(event) => {
        if (!locked && onChange) {
          const formatted = formatIndianAmountInputValue(event.target.value, blurOptions)
          onChange({
            ...event,
            target: { ...event.target, value: formatted, name: event.target.name },
          })
        }
        onBlur?.(event)
      }}
    />
  )
})

/** Labelled money field for list modals and domain forms (same blur UX as voucher {@link IndianAmountInput}). */
export const IndianAmountField = forwardRef(function IndianAmountField(
  {
    label,
    required,
    readOnly,
    disabled,
    error,
    hint,
    className = '',
    wrapperClassName = '',
    value,
    onChange,
    onBlur,
    name,
    id,
    placeholder = INDIAN_AMOUNT_INPUT_ZERO,
    emptyAsZero = true,
  },
  ref,
) {
  const fieldId = id ?? name
  const { errorId, hintId } = useFieldMessageIds(fieldId)
  const effectiveHint = FORM_FIELD_HINTS_ENABLED ? hint : undefined
  const describedBy = buildFieldDescribedBy({
    error,
    hint: effectiveHint,
    errorId,
    hintId,
  })
  const hasVisibleLabel = label != null && String(label).trim() !== ''
  const controlSlotClass = `${orgProbityControlSlotClass}${hasVisibleLabel ? '' : ' !mt-0'}`.trim()
  const locked = readOnly || disabled
  const blurOptions = { emptyAsZero }
  const displayValue = locked ? formatIndianAmountInputValue(value, blurOptions) : (value ?? '')

  return (
    <div
      className={`${formFieldWrapperClass} ${wrapperClassName}`.trim()}
      data-form-field-anchor={name}
    >
      <FormLabel label={label} required={required} htmlFor={fieldId} />
      <div className={controlSlotClass}>
        <input
          ref={ref}
          type="text"
          inputMode="decimal"
          maxLength={AMOUNT_INPUT_MAX_LENGTH}
          id={fieldId}
          name={name}
          readOnly={readOnly}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          aria-readonly={readOnly || undefined}
          placeholder={placeholder}
          className={`${resolveInputClassName({ readOnly, error, className })} text-right tabular-nums`.trim()}
          value={displayValue}
          onChange={(event) => {
            if (locked) return
            onChange?.(event)
          }}
          onBlur={(event) => {
            if (!locked && onChange) {
              const formatted = formatIndianAmountInputValue(event.target.value, blurOptions)
              onChange({
                ...event,
                target: { ...event.target, value: formatted, name: event.target.name },
              })
            }
            onBlur?.(event)
          }}
        />
      </div>
      <FieldHint id={hintId}>{effectiveHint}</FieldHint>
      <FieldError id={errorId} message={error} />
    </div>
  )
})

export default IndianAmountField
