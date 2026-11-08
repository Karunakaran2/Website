import { useTranslatedOptions } from '@/app/i18n/useTranslatedOptions'
import { FeaturedBasicSelect } from '@/shared/lib/tailwreck'
import {
  FieldError,
  FieldHint,
  FORM_FIELD_HINTS_ENABLED,
  buildFieldDescribedBy,
  useFieldMessageIds,
} from './FormFields'
import {
  formFieldCellClass,
  orgProbityControlSlotClass,
  orgProbitySelectInvalidClass,
  orgProbitySelectInvalidShellClass,
  orgProbitySelectTriggerClass,
} from './tailwreckFormShell'
import { resolveSelectValue } from '@/shared/utils/resolveSelectValue'
import { resolveProbityRules } from '@/shared/utils/fieldValidationRules'
import { Controller } from 'react-hook-form'
import FormLabel from './FormLabel'

export default function OrgSelectField({
  control,
  name,
  label,
  options = [],
  required = false,
  placeholder,
  width,
  className = orgProbitySelectTriggerClass,
  disabled = false,
  rules,
  externalError,
  hint,
  id,
  translateOptions = true,
}) {
  const translatedOptions = useTranslatedOptions(options)
  const selectOptions = translateOptions ? translatedOptions : options
  const mergedRules = resolveProbityRules(name, {
    required,
    label,
    fieldType: 'select',
    rules,
  })

  const fieldId = id ?? name
  const { errorId, hintId } = useFieldMessageIds(fieldId)

  return (
    <div className={formFieldCellClass} data-form-field-anchor={name}>
      <FormLabel label={label} required={required} htmlFor={fieldId} />
      <Controller
        name={name}
        control={control}
        rules={mergedRules}
        render={({ field, fieldState }) => {
          const message = fieldState.error?.message || externalError
          const invalid = Boolean(message)
          const effectiveHint = FORM_FIELD_HINTS_ENABLED ? hint : undefined
          const describedBy = buildFieldDescribedBy({
            error: message,
            hint: effectiveHint,
            errorId,
            hintId,
          })
          return (
            <>
              <div
                className={`${orgProbityControlSlotClass} ${invalid ? orgProbitySelectInvalidShellClass : ''}`.trim()}
              >
                <FeaturedBasicSelect
                  id={fieldId}
                  name={field.name}
                  options={selectOptions}
                  value={field.value}
                  onChange={(value) => {
                    const next = resolveSelectValue(value)
                    field.onChange(next)
                    if (String(next ?? '').trim()) {
                      field.onBlur()
                    }
                  }}
                  placeholder={placeholder}
                  disabled={disabled}
                  size="md"
                  theme="primary"
                  border="sm"
                  width={width}
                  aria-invalid={invalid ? true : undefined}
                  aria-describedby={describedBy}
                  className={`${className} ${invalid ? orgProbitySelectInvalidClass : ''}`.trim()}
                />
              </div>
              <FieldHint id={hintId}>{effectiveHint}</FieldHint>
              <FieldError id={errorId} message={message} />
            </>
          )
        }}
      />
    </div>
  )
}
