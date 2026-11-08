import React, { forwardRef, useId } from 'react'
import { ChevronDown } from 'lucide-react'
import ActionButton from '../buttons/ActionButton'
import ReadOnlyField from './ReadOnlyField'
import { readOnlyInputClass, readOnlyValueClass } from './readOnlyFieldStyles'
import ProbityTextarea from './ProbityTextarea'
import { Caption } from '@/shared/components/typography'
import {
  FORM_SECTION_TITLE_CLASS,
  formCheckboxControlClass,
  formChoiceControlClass,
} from '@/shared/components/typography/typographyStyles'
import FormLabel, {
  formFieldLabelClass,
  formFieldLegendClass,
  formFieldWrapperClass,
  formOptionLabelClass,
} from './FormLabel'
import { orgProbityControlSlotClass } from './tailwreckFormShell'
import { resolveFieldMaxLength } from '@/shared/utils/fieldValidationRules'
import FormProfileSection from './FormProfileSection'
import { formProfileSectionTitleClass } from './formProfileSectionStyles'

/**
 * Field styles aligned to Org UI Standard — Complex Input Form
 * (keep in sync with spfo_frontend OTR FormFields.jsx)
 */

/** Control chrome only — top spacing comes from {@link orgProbityControlSlotClass}. */
export const inputControlClass =
  'input-field !mt-0 h-11 min-h-11 max-h-11 box-border w-full touch-manipulation rounded border border-slate-300 bg-white px-3 py-2.5 text-[13px] leading-normal text-slate-800 placeholder:text-slate-400 transition-colors focus:border-[#01458e] focus:outline-none focus:ring-1 focus:ring-[#01458e] disabled:cursor-not-allowed disabled:bg-white disabled:text-slate-500 dark:bg-slate-900 dark:border-slate-600 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-[#01458e] dark:disabled:bg-slate-900'

/** @deprecated Prefer {@link inputControlClass} inside {@link orgProbityControlSlotClass}. */
export const inputFieldClass = `${inputControlClass} mt-1`

function resolveInputClassName({ readOnly, error, className = '' }) {
  const base = readOnly ? readOnlyInputClass : inputControlClass
  const errorClass = error ? '!border-rose-400 focus:!border-rose-500 focus:!ring-rose-400' : ''
  const extra = className.includes('input-field') ? className.replace(/\binput-field\b/g, '').replace(/\s+/g, ' ').trim() : className
  return `${base} ${errorClass} ${extra}`.trim()
}

export { textareaControlClass } from './ProbityTextarea'

/** @deprecated alias — prefer formFieldLabelClass */
export const labelClass = formFieldLabelClass
export { default as FormLabel } from './FormLabel'
export { formFieldLabelClass, formFieldLegendClass, formOptionLabelClass }

export { FORM_SECTION_TITLE_CLASS }

/** Inline validation message — no reserved height when empty (avoids extra row gap). */
export const fieldMessageSlotClass = 'mt-1 w-full'

/** KRAN portal: labels + validation errors only — no helper copy under controls. */
export const FORM_FIELD_HINTS_ENABLED = false

export function buildFieldDescribedBy({ error, hint, errorId, hintId }) {
  const showHint = FORM_FIELD_HINTS_ENABLED && hint
  return [error && errorId ? errorId : null, showHint && hintId ? hintId : null]
    .filter(Boolean)
    .join(' ') || undefined
}

export function useFieldMessageIds(fieldId) {
  const uid = useId()
  const base = fieldId || `field${uid.replace(/:/g, '')}`
  return {
    errorId: `${base}-error`,
    hintId: `${base}-hint`,
  }
}

export const FieldError = ({ message, id }) => {
  if (!message) {
    return null
  }
  return (
    <div id={id} className={fieldMessageSlotClass} aria-live="polite">
      <Caption tone="danger" role="alert" className="!mt-0">
        {message}
      </Caption>
    </div>
  )
}

export const FieldHint = ({ children, id }) => {
  if (!FORM_FIELD_HINTS_ENABLED || !children) return null
  return (
    <Caption id={id} className={fieldMessageSlotClass}>
      {children}
    </Caption>
  )
}

/** Complex-form section — use `variant="card"` (or pass `icon`) for Probity voucher-style sections. */
export function FormSection({
  title,
  description,
  icon,
  children,
  bordered = false,
  variant = 'plain',
  className = '',
  sectionId,
}) {
  const useCard = variant === 'card' || Boolean(icon)

  if (useCard && title) {
    return (
      <FormProfileSection sectionId={sectionId} title={title} icon={icon} className={className}>
        {description ? (
          <p className="m-0 mb-4 text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
            {description}
          </p>
        ) : null}
        {children}
      </FormProfileSection>
    )
  }

  return (
    <section
      id={sectionId}
      className={`min-w-0 space-y-3 outline-none transition-shadow ${bordered ? 'border-t border-slate-100 pt-4 dark:border-slate-700' : ''} ${className}`.trim()}
    >
      {title ? (
        <div className="space-y-1">
          <h3 className={formProfileSectionTitleClass}>{title}</h3>
          {FORM_FIELD_HINTS_ENABLED && description ? (
            <p className="m-0 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  )
}

/** 3-col responsive grid used by Complex Input Form */
const FIELD_GRID_GAP_CLASS = 'gap-3'

/** One grid column — label row + control row (aligns inputs across mixed field types). */
export const formGridCellClass =
  'relative z-auto flex min-w-0 flex-col has-[[aria-expanded=true]]:z-[100] focus-within:z-[100]'

export function fieldGridClass(cols = 3) {
  if (cols === 1) {
    return `grid ${FIELD_GRID_GAP_CLASS} grid-cols-1`
  }
  if (cols === 2) {
    return `grid ${FIELD_GRID_GAP_CLASS} grid-cols-1 sm:grid-cols-2`
  }
  if (cols === 4) {
    return `grid ${FIELD_GRID_GAP_CLASS} sm:grid-cols-2 lg:grid-cols-4`
  }
  if (cols === 5) {
    return `grid ${FIELD_GRID_GAP_CLASS} grid-cols-1 sm:grid-cols-2 lg:grid-cols-5`
  }
  if (cols === 6) {
    return `grid ${FIELD_GRID_GAP_CLASS} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6`
  }
  return `grid ${FIELD_GRID_GAP_CLASS} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
}

/** 3-col responsive grid used by Complex Input Form */
export function FieldGrid({ cols = 3, children, className = '' }) {
  return (
    <div className={`${fieldGridClass(cols)} w-full min-w-0 items-start overflow-visible ${className}`.trim()}>
      {children}
    </div>
  )
}

export const InputField = forwardRef(function InputField(
  {
    label,
    required,
    readOnly,
    error,
    hint,
    className = '',
    wrapperClassName = '',
    type = 'text',
    maxLength,
    ...props
  },
  ref,
) {
  const { disabled, id, name, ...inputProps } = props
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
  const resolvedMaxLength = resolveFieldMaxLength(name, { type, explicit: maxLength })
  return (
    <div
      className={`${formFieldWrapperClass} ${wrapperClassName}`.trim()}
      data-form-field-anchor={name}
    >
      <FormLabel label={label} required={required} htmlFor={fieldId} />
      <div className={controlSlotClass}>
        <input
          ref={ref}
          id={fieldId}
          name={name}
          type={type}
          maxLength={resolvedMaxLength}
          readOnly={readOnly}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          aria-readonly={readOnly || undefined}
          className={resolveInputClassName({ readOnly, error, className })}
          {...inputProps}
        />
      </div>
      <FieldHint id={hintId}>{effectiveHint}</FieldHint>
      <FieldError id={errorId} message={error} />
    </div>
  )
})

export const SelectField = forwardRef(function SelectField(
  {
    label,
    required,
    children,
    options,
    placeholder,
    error,
    hint,
    className = '',
    wrapperClassName = '',
    ...props
  },
  ref,
) {
  const { id, name, ...selectProps } = props
  const fieldId = id ?? name
  const { errorId, hintId } = useFieldMessageIds(fieldId)
  const effectiveHint = FORM_FIELD_HINTS_ENABLED ? hint : undefined
  const describedBy = buildFieldDescribedBy({
    error,
    hint: effectiveHint,
    errorId,
    hintId,
  })
  return (
    <div
      className={`${formFieldWrapperClass} ${wrapperClassName}`.trim()}
      data-form-field-anchor={name}
    >
      <FormLabel label={label} required={required} htmlFor={fieldId} />
      <div className={`${orgProbityControlSlotClass} relative`}>
        <select
          ref={ref}
          id={fieldId}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`${inputControlClass} appearance-none pr-9 cursor-pointer ${
            error ? '!border-rose-400 focus:!border-rose-500 focus:!ring-rose-400' : ''
          } ${className}`.trim()}
          {...selectProps}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {Array.isArray(options) &&
            options.map((opt) => {
              const val = typeof opt === 'object' && opt !== null ? (opt.value ?? opt.id) : opt
              const lbl = typeof opt === 'object' && opt !== null ? (opt.label ?? opt.value ?? opt.id) : opt
              return (
                <option key={String(val)} value={val}>
                  {lbl}
                </option>
              )
            })}
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
          <ChevronDown size={16} />
        </div>
      </div>
      <FieldHint id={hintId}>{effectiveHint}</FieldHint>
      <FieldError id={errorId} message={error} />
    </div>
  )
})

export const TextAreaField = forwardRef(function TextAreaField(
  {
    label,
    required,
    readOnly,
    error,
    hint,
    className = '',
    wrapperClassName = '',
    rows = 2,
    maxLength,
    value,
    ...props
  },
  ref,
) {
  const { disabled, id, name, style: textareaStyle, ...textareaProps } = props
  const fieldId = id ?? name
  const { errorId, hintId } = useFieldMessageIds(fieldId)
  const effectiveHint = FORM_FIELD_HINTS_ENABLED ? hint : undefined
  const describedBy = buildFieldDescribedBy({
    error,
    hint: effectiveHint,
    errorId,
    hintId,
  })
  const resolvedMaxLength = resolveFieldMaxLength(name, { multiline: true, explicit: maxLength })
  const charCount =
    resolvedMaxLength != null ? String(value ?? textareaProps.defaultValue ?? '').length : null
  const atLimit = resolvedMaxLength != null && charCount >= resolvedMaxLength
  return (
    <div
      className={`${formFieldWrapperClass} ${wrapperClassName}`.trim()}
      data-form-field-anchor={name}
    >
      <FormLabel label={label} required={required} htmlFor={fieldId} />
      <div className={`${orgProbityControlSlotClass} min-w-0`}>
        <ProbityTextarea
          ref={ref}
          id={fieldId}
          name={name}
          value={value}
          maxLength={resolvedMaxLength}
          readOnly={readOnly}
          disabled={disabled}
          rows={rows}
          error={error}
          aria-describedby={describedBy}
          className={className}
          style={textareaStyle}
          {...textareaProps}
        />
        {resolvedMaxLength != null ? (
          <Caption
            className={`!mt-1 block text-right tabular-nums ${atLimit ? '!text-rose-600' : ''}`.trim()}
            aria-live="polite"
          >
            {charCount} / {resolvedMaxLength}
          </Caption>
        ) : null}
      </div>
      <FieldHint id={hintId}>{effectiveHint}</FieldHint>
      <FieldError id={errorId} message={error} />
    </div>
  )
})

/** Single required/optional checkbox with label, hint, and field-level error below the control. */
export function FormCheckboxField({
  id,
  name,
  label,
  description,
  required = false,
  error,
  hint,
  className = '',
  disabled = false,
  register,
  rules,
  ...inputProps
}) {
  const fieldId = id ?? name
  const { errorId, hintId } = useFieldMessageIds(fieldId)
  const effectiveHint = FORM_FIELD_HINTS_ENABLED ? hint : undefined
  const showDescription = FORM_FIELD_HINTS_ENABLED && description
  const describedBy = buildFieldDescribedBy({
    error,
    hint: effectiveHint,
    errorId,
    hintId,
  })
  const registration = register && name ? register(name, rules) : {}
  const { ref: registrationRef, ...registrationProps } = registration

  return (
    <div
      className={`${formFieldWrapperClass} ${className}`.trim()}
      data-form-field-anchor={name}
    >
      <div className="flex items-start gap-3">
        <input
          ref={registrationRef}
          id={fieldId}
          name={name}
          type="checkbox"
          disabled={disabled}
          className={`mt-0.5 shrink-0 ${formCheckboxControlClass}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...registrationProps}
          {...inputProps}
        />
        <div className="min-w-0 flex-1">
          <label htmlFor={fieldId} className={`${formOptionLabelClass} cursor-pointer`}>
            <span className="text-[13px] font-semibold text-slate-800">
              {label}
              {required ? <span className="text-rose-600 font-bold"> *</span> : null}
            </span>
          </label>
          {showDescription ? (
            <p className="mt-0.5 text-[11px] text-slate-500">{description}</p>
          ) : null}
          <FieldHint id={hintId}>{effectiveHint}</FieldHint>
        </div>
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  )
}

export function RadioGroup({
  legend,
  name,
  value,
  onChange,
  options = [],
  columns = 'mt-1 flex min-h-11 flex-wrap items-center gap-x-4 gap-y-2',
  required = false,
  disabled = false,
  error,
  hint,
  className = '',
  legendClassName = '',
  action = null,
}) {
  const { errorId, hintId } = useFieldMessageIds(name)
  const effectiveHint = FORM_FIELD_HINTS_ENABLED ? hint : undefined
  const describedBy = buildFieldDescribedBy({
    error,
    hint: effectiveHint,
    errorId,
    hintId,
  })
  return (
    <fieldset
      className={`min-w-0 border-0 p-0 ${className}`.trim()}
      data-form-field-anchor={name}
      aria-describedby={describedBy}
      aria-invalid={error ? true : undefined}
    >
      {legend ? (
        <FormLabel label={legend} required={required} as="legend" className={legendClassName} />
      ) : null}
      <div className={columns}>
        {options.map((opt) => {
          const optValue = typeof opt === 'string' ? opt : opt.value
          const optLabel = typeof opt === 'string' ? opt : opt.label
          return (
            <label
              key={optValue}
              className={`${formOptionLabelClass} ${
                disabled ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={optValue}
                checked={value === optValue}
                onChange={onChange}
                disabled={disabled}
                className={formChoiceControlClass}
              />
              {optLabel}
            </label>
          )
        })}
        {action}
      </div>
      <FieldHint id={hintId}>{effectiveHint}</FieldHint>
      <FieldError id={errorId} message={error} />
    </fieldset>
  )
}

export function CheckboxGroup({ legend, options = [], values = [], onToggle, error, hint }) {
  const groupName = legend ? String(legend).replace(/\s+/g, '-').toLowerCase() : 'checkbox-group'
  const { errorId, hintId } = useFieldMessageIds(groupName)
  const effectiveHint = FORM_FIELD_HINTS_ENABLED ? hint : undefined
  const describedBy = buildFieldDescribedBy({
    error,
    hint: effectiveHint,
    errorId,
    hintId,
  })
  return (
    <fieldset
      className="min-w-0 border-0 p-0"
      data-form-field-anchor={groupName}
      aria-describedby={describedBy}
      aria-invalid={error ? true : undefined}
    >
      {legend ? <FormLabel label={legend} as="legend" /> : null}
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {options.map((opt) => (
          <label
            key={opt}
            className={`cursor-pointer ${formOptionLabelClass}`}
          >
            <input
              type="checkbox"
              checked={values.includes(opt)}
              onChange={() => onToggle(opt)}
              className={formCheckboxControlClass}
            />
            {opt}
          </label>
        ))}
      </div>
      <FieldHint id={hintId}>{effectiveHint}</FieldHint>
      <FieldError id={errorId} message={error} />
    </fieldset>
  )
}

export function SectionDivider({ title, icon: Icon, action = null }) {
  return (
    <div className="mb-1 flex items-center justify-between gap-3">
      <h3 className={`${FORM_SECTION_TITLE_CLASS} flex items-center gap-2`}>
        {Icon ? <Icon size={16} className="h-[16px] w-[16px] min-h-[16px] min-w-[16px] shrink-0 text-slate-500 dark:text-slate-400" aria-hidden /> : null}
        {title}
      </h3>
      {action}
    </div>
  )
}

/** @deprecated Use ActionButton variant="verify" or PrimaryButton */
export function VerifyActionButton({ children, className = '', ...props }) {
  return (
    <ActionButton
      variant="verify"
      className={`min-h-10 px-3 py-2.5 shadow-sm ${className}`.trim()}
      {...props}
    >
      {children}
    </ActionButton>
  )
}

export function StatusPill({ tone = 'success', children }) {
  const tones = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300',
    warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300',
    danger: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300',
    info: 'bg-slate-100 text-[#01458e] border-slate-200 dark:bg-slate-800 dark:text-blue-300',
  }
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded border ${tones[tone] || tones.info}`}
    >
      {children}
    </span>
  )
}

export { readOnlyInputClass, readOnlyValueClass, ReadOnlyField }
