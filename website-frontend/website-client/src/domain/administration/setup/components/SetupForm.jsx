import { useCallback, useEffect, useMemo } from 'react'
import { Controller } from 'react-hook-form'
import { useProbityForm } from '@/shared/utils/useProbityForm'
import { useTranslatedOptions } from '@/app/i18n/useTranslatedOptions'
import { FeaturedBasicSelect } from '@/shared/lib/tailwreck'
import { fieldUsesUppercaseClass, probityFieldRules, resolveSelectValue } from '@/shared/utils'
import { sanitizeDigitsInput } from '@/shared/utils/probityFormat'
import { FORM_FOOTER_CANCEL_CLASS } from '@/shared/components/buttons/actionButtonStyles'
import { GigwButton } from '@/shared/components/buttons/gigw'
import { SetupLinkButton } from './setupGigwButtons'
import { Caption } from '@/shared/components/typography'
import {
  FieldError,
  FieldGrid,
  formFieldCellClass,
  formGridCellClass,
  IndianAmountField,
  OrgDateField,
  FormLabel,
  OrgRadioGroup,
  OrgReadOnlyField,
  OrgSelectField,
  InputField,
  ReadOnlyField,
  TextAreaField,
  formCheckboxControlClass,
  formOptionLabelClass,
  resolveOptionLabel,
} from '@/shared/components/forms'
import {
  orgProbityControlSlotClass,
  orgProbitySelectInvalidClass,
  orgProbitySelectTriggerClass,
} from '@/shared/components/forms/tailwreckFormShell'
import {
  formatDisplayDate,
  formatIndianAmountForInput,
  formatIndianAmountOrDash,
  sanitizeDecimalAmountInput,
} from '@/shared/utils/probityFormat'
import { isSetupAmountField } from '../utils/setupAmountField'
import SetupFormFooter from './SetupFormFooter'
import SetupFormShell from './SetupFormShell'
import { confirmBeforeAction, validateTriggerForm } from '@/shared/components/confirm'
import { useActionConfirm } from '@/shared/components/confirm'
import { setupRowDeleteDescription } from '../utils/setupRowDeleteDescription'
import { setupFormSubmitLabel } from '../utils/setupFormModalTitle'
import { resolveSetupPublicId } from '../utils/setupRowId'

function emptyValues(fields) {
  return fields.reduce((acc, field) => {
    if (field.type === 'checkbox') {
      acc[field.name] = field.defaultValue ?? false
      return acc
    }
    acc[field.name] = field.defaultValue ?? ''
    return acc
  }, {})
}

function toCheckboxValue(value) {
  return value === true || value === 'Y'
}

function matchesWhen(when, values) {
  if (!when) {
    return true
  }
  return Object.entries(when).every(([name, expected]) => {
    const actual = values?.[name]
    return Array.isArray(expected) ? expected.includes(actual) : actual === expected
  })
}

function isFieldVisible(field, values) {
  return matchesWhen(field.visibleWhen, values)
}

function isFieldRequired(field, values) {
  if (!isFieldVisible(field, values)) {
    return false
  }
  if (field.requiredWhen) {
    return matchesWhen(field.requiredWhen, values)
  }
  return Boolean(field.required)
}

function isFieldDisabled(field, { readOnly, isEditing }) {
  if (readOnly || field.disabled) {
    return true
  }
  return Boolean(isEditing && field.readOnlyWhenEditing)
}

function mergeInitialValues(fields, initialValues) {
  const merged = emptyValues(fields)
  if (!initialValues) {
    return merged
  }
  for (const field of fields) {
    const raw = initialValues[field.name]
    if (raw == null || raw === '') {
      continue
    }
    if (field.type === 'checkbox') {
      merged[field.name] = toCheckboxValue(raw)
      continue
    }
    if (isSetupAmountField(field)) {
      merged[field.name] = formatIndianAmountForInput(raw, { emptyAsZero: false })
      continue
    }
    merged[field.name] = typeof raw === 'number' ? String(raw) : raw
  }
  return merged
}

function GridFieldLinkSlot({ linkAction }) {
  if (!linkAction) {
    return null
  }
  return <div className="mt-1 min-h-7 shrink-0">{linkAction}</div>
}

function SelectFieldWithChange({
  field,
  control,
  options,
  required,
  readOnly,
  isEditing,
  validation,
  fieldError,
  wrapperClassName,
  formValues,
  onFieldChange,
  linkAction,
}) {
  const translatedOptions = useTranslatedOptions(options)
  return (
    <div className={wrapperClassName}>
      <div className={formFieldCellClass}>
        <FormLabel label={field.label} required={required} />
        <Controller
          name={field.name}
          control={control}
          rules={validation}
          render={({ field: rf, fieldState }) => {
            const message = fieldState.error?.message || fieldError
            const invalid = Boolean(message)
            return (
              <>
                <div className={orgProbityControlSlotClass}>
                  <FeaturedBasicSelect
                    name={rf.name}
                    options={translatedOptions}
                    value={rf.value ?? ''}
                    onChange={(value) => {
                      const next = resolveSelectValue(value)
                      rf.onChange(next)
                      onFieldChange(field.name, next, { ...formValues, [field.name]: next })
                    }}
                    disabled={isFieldDisabled(field, { readOnly, isEditing })}
                    size="md"
                    theme="primary"
                    border="sm"
                    className={`${orgProbitySelectTriggerClass} ${invalid ? orgProbitySelectInvalidClass : ''}`.trim()}
                  />
                </div>
                <FieldError message={message} />
              </>
            )
          }}
        />
      </div>
      <GridFieldLinkSlot linkAction={linkAction} />
    </div>
  )
}

function fieldGridSpanClass(field) {
  if (field.colSpan === 3) {
    return `${formGridCellClass} sm:col-span-2 lg:col-span-3`
  }
  if (field.colSpan === 2) {
    return `${formGridCellClass} sm:col-span-2`
  }
  return formGridCellClass
}

export default function SetupForm({
  master,
  initialValues,
  fieldErrors,
  formError,
  onSubmit,
  onCancel,
  readOnly = false,
  hideCancel = false,
  useResetFooter = false,
  showSubmit = true,
  submitLabel,
  formTitle,
  headerActions,
  fieldOptions,
  showSectionTitle = false,
  onFieldChange,
  onLinkClick,
  externalValues,
  fieldGridCols = 3,
  confirmOnSave = true,
}) {
  const requestConfirm = useActionConfirm()
  const isEditing = Boolean(initialValues && resolveSetupPublicId(initialValues, master))
  const editingId = isEditing ? resolveSetupPublicId(initialValues, master) : null
  const resolvedSubmitLabel = submitLabel ?? setupFormSubmitLabel(master, editingId)
  const defaultValues = useMemo(
    () => mergeInitialValues(master.fields, initialValues),
    [master.fields, initialValues],
  )

  const recordKey = `${master.resource}:${resolveSetupPublicId(initialValues, master) || 'new'}`

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    getValues,
    trigger,
    formState,
  } = useProbityForm({ defaultValues })

  const { errors } = formState

  // Only re-seed when switching create/edit records — not when parent re-renders with a new
  // initialValues object reference (that was wiping in-progress edits like description).
  useEffect(() => {
    reset(mergeInitialValues(master.fields, initialValues))
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally keyed by recordKey only
  }, [recordKey, master.fields, reset])

  useEffect(() => {
    if (!externalValues) {
      return
    }
    Object.entries(externalValues).forEach(([name, value]) => {
      setValue(name, value ?? '', { shouldDirty: true, shouldValidate: false })
    })
  }, [externalValues, setValue])

  const formValues = watch()

  const handleReset = useCallback(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  const normalizeSubmitValues = useCallback(
    (values) => {
      const next = { ...values }
      master.fields.forEach((field) => {
        if (!isFieldVisible(field, values)) {
          next[field.name] = field.type === 'checkbox' ? false : ''
        }
      })
      return next
    },
    [master.fields],
  )

  const handleFormSubmit = useCallback(
    (event) => {
      event.preventDefault()
      if (readOnly) {
        return
      }
      if (!confirmOnSave) {
        void handleSubmit((values) => onSubmit(normalizeSubmitValues(values)))()
        return
      }
      confirmBeforeAction(requestConfirm, {
        action: isEditing ? 'update' : 'save',
        recordLabel: setupRowDeleteDescription(getValues(), master),
        stack: 'base',
        validate: () => validateTriggerForm(trigger),
        runAction: () => onSubmit(normalizeSubmitValues(getValues())),
      })
    },
    [
      confirmOnSave,
      getValues,
      handleSubmit,
      isEditing,
      master,
      normalizeSubmitValues,
      onSubmit,
      readOnly,
      requestConfirm,
      trigger,
    ],
  )

  const sectionTitle =
    showSectionTitle &&
    (formTitle ||
      (readOnly ? master.title : initialValues ? `Edit ${master.title}` : `Add ${master.title}`))

  const cancelInHeader = !hideCancel && onCancel && !showSubmit
  const shellHeaderActions =
    headerActions || cancelInHeader
      ? (
          <>
            {headerActions}
            {cancelInHeader ? (
              <GigwButton
                type="button"
                variant="secondary"
                hideIcon
                className={FORM_FOOTER_CANCEL_CLASS}
                onClick={onCancel}
              >
                Cancel
              </GigwButton>
            ) : null}
          </>
        )
      : undefined

  return (
    <form onSubmit={handleFormSubmit} className="flex w-full min-w-0 flex-col gap-4" noValidate>
      <SetupFormShell
        title={sectionTitle || undefined}
        headerActions={shellHeaderActions}
        formError={formError}
      >
        <FieldGrid cols={fieldGridCols} className="w-full overflow-visible">
          {master.fields.map((field) => {
            if (!isFieldVisible(field, formValues)) {
              return null
            }

            const fieldError = fieldErrors[field.name] || errors[field.name]?.message
            const fieldDisabled = isFieldDisabled(field, { readOnly, isEditing })
            const required = isFieldRequired(field, formValues) && !readOnly && !fieldDisabled
            const amountField = isSetupAmountField(field)
            const resolvedFieldType = amountField ? 'amount' : field.type
            let validation =
              required && field.type === 'checkbox'
                ? {
                    validate: (value) =>
                      value === true || `Please select ${field.label}.`,
                  }
                : probityFieldRules(field.name, {
                    required,
                    label: field.label,
                    fieldType: resolvedFieldType,
                    formatKey: field.formatKey,
                  })
            if (field.maxLength != null && field.maxLength > 0) {
              validation = {
                ...validation,
                maxLength: {
                  value: field.maxLength,
                  message: `${field.label} must not exceed ${field.maxLength} characters.`,
                },
              }
            }

            const linkAction = !readOnly && field.linkLabel && onLinkClick ? (
              <SetupLinkButton type="button" onClick={() => onLinkClick(field, formValues)}>
                {field.linkLabel}
              </SetupLinkButton>
            ) : null

            if (readOnly) {
              if (field.type === 'radio' || field.type === 'select') {
                const options = fieldOptions?.[field.name] || field.options || []
                return (
                  <Controller
                    key={field.name}
                    name={field.name}
                    control={control}
                    render={({ field: rf }) => (
                      <ReadOnlyField
                        label={field.label}
                        value={resolveOptionLabel(rf.value, options) || '—'}
                        wrapperClassName="min-w-0"
                      />
                    )}
                  />
                )
              }

              if (field.type === 'date') {
                return (
                  <Controller
                    key={field.name}
                    name={field.name}
                    control={control}
                    render={({ field: rf }) => (
                      <ReadOnlyField
                        label={field.label}
                        value={formatDisplayDate(rf.value) || '—'}
                        wrapperClassName="min-w-0"
                      />
                    )}
                  />
                )
              }

              if (amountField) {
                return (
                  <Controller
                    key={field.name}
                    name={field.name}
                    control={control}
                    render={({ field: rf }) => (
                      <ReadOnlyField
                        label={field.label}
                        value={formatIndianAmountOrDash(rf.value)}
                        wrapperClassName="min-w-0 text-right tabular-nums"
                      />
                    )}
                  />
                )
              }

              return (
                <OrgReadOnlyField
                  key={field.name}
                  control={control}
                  name={field.name}
                  label={field.label}
                />
              )
            }

            if (field.type === 'checkbox') {
              return (
                <div key={field.name} className={`${fieldGridSpanClass(field)} justify-end`}>
                  <label className={`inline-flex h-11 items-center gap-2 ${formOptionLabelClass}`}>
                    <input
                      type="checkbox"
                      className={formCheckboxControlClass}
                      disabled={readOnly}
                      {...register(field.name, validation)}
                    />
                    <span>
                      {field.label}
                      {required ? <span className="text-red-500"> *</span> : null}
                    </span>
                  </label>
                  {fieldError ? <Caption tone="danger">{fieldError}</Caption> : null}
                </div>
              )
            }

            if (field.type === 'textarea') {
              return (
                <div key={field.name} className={fieldGridSpanClass(field)}>
                  <div className={formFieldCellClass}>
                    <Controller
                      name={field.name}
                      control={control}
                      rules={validation}
                      render={({ field: rf, fieldState }) => (
                        <TextAreaField
                          label={field.label}
                          required={required}
                          name={rf.name}
                          value={rf.value ?? ''}
                          maxLength={field.maxLength}
                          onChange={rf.onChange}
                          onBlur={rf.onBlur}
                          ref={rf.ref}
                          error={fieldError || fieldState.error?.message}
                        />
                      )}
                    />
                  </div>
                  <GridFieldLinkSlot linkAction={linkAction} />
                </div>
              )
            }

            if (amountField) {
              const emptyAsZero = field.emptyAsZero === true
              return (
                <div key={field.name} className={fieldGridSpanClass(field)}>
                  <div className={formFieldCellClass}>
                    <Controller
                      name={field.name}
                      control={control}
                      rules={validation}
                      render={({ field: rf, fieldState }) => (
                        <IndianAmountField
                          label={field.label}
                          required={required}
                          disabled={fieldDisabled}
                          name={rf.name}
                          value={rf.value ?? ''}
                          emptyAsZero={emptyAsZero}
                          error={fieldError || fieldState.error?.message}
                          onChange={(event) => {
                            const next = sanitizeDecimalAmountInput(event.target.value)
                            rf.onChange(next)
                            onFieldChange?.(field.name, next, { ...formValues, [field.name]: next })
                          }}
                          onBlur={rf.onBlur}
                          ref={rf.ref}
                        />
                      )}
                    />
                  </div>
                  <GridFieldLinkSlot linkAction={linkAction} />
                </div>
              )
            }

            if (field.type === 'select') {
              const selectOptions = fieldOptions?.[field.name] || field.options || []
              if (onFieldChange) {
                return (
                  <SelectFieldWithChange
                    key={field.name}
                    field={field}
                    control={control}
                    options={selectOptions}
                    required={required}
                    readOnly={readOnly}
                    isEditing={isEditing}
                    validation={validation}
                    fieldError={fieldError}
                    wrapperClassName={fieldGridSpanClass(field)}
                    formValues={formValues}
                    onFieldChange={onFieldChange}
                    linkAction={linkAction}
                  />
                )
              }
              return (
                <div key={field.name} className={fieldGridSpanClass(field)}>
                  <OrgSelectField
                    control={control}
                    name={field.name}
                    label={field.label}
                    options={selectOptions}
                    required={required}
                    disabled={fieldDisabled}
                    rules={validation}
                    externalError={fieldErrors[field.name]}
                  />
                  <GridFieldLinkSlot linkAction={linkAction} />
                </div>
              )
            }

            if (field.type === 'radio') {
              return (
                <div key={field.name} className={fieldGridSpanClass(field)}>
                  <Controller
                    name={field.name}
                    control={control}
                    rules={validation}
                    render={({ field: rf, fieldState }) => (
                      <OrgRadioGroup
                        name={rf.name}
                        label={field.label}
                        options={field.options || []}
                        value={rf.value}
                        onChange={(value) => {
                          rf.onChange(value)
                          onFieldChange?.(field.name, value, { ...formValues, [field.name]: value })
                        }}
                        required={required}
                        disabled={readOnly}
                        error={fieldError || fieldState.error?.message}
                      />
                    )}
                  />
                  <GridFieldLinkSlot linkAction={linkAction} />
                </div>
              )
            }

            if (field.type === 'date') {
              return (
                <div key={field.name} className={fieldGridSpanClass(field)}>
                  <div className={formFieldCellClass}>
                    <OrgDateField
                      control={control}
                      name={field.name}
                      label={field.label}
                      required={required && !readOnly}
                      disabled={readOnly}
                      rules={validation}
                    />
                  </div>
                  <GridFieldLinkSlot linkAction={linkAction} />
                </div>
              )
            }

            return (
              <div key={field.name} className={fieldGridSpanClass(field)}>
                <div className={formFieldCellClass}>
                  <Controller
                    name={field.name}
                    control={control}
                    rules={validation}
                    render={({ field: rf, fieldState }) => (
                      <InputField
                        label={field.label}
                        required={required}
                        disabled={field.disabled}
                        name={rf.name}
                        value={rf.value ?? ''}
                        inputMode={field.digitsOnly ? 'numeric' : undefined}
                        onChange={(event) => {
                          let next = event.target.value
                          if (field.digitsOnly) {
                            next = sanitizeDigitsInput(next, { maxLength: field.maxLength })
                          }
                          rf.onChange(next)
                          if (field.digitsOnly && onFieldChange) {
                            onFieldChange(field.name, next, {
                              ...formValues,
                              [field.name]: next,
                            })
                          }
                        }}
                        onBlur={(event) => {
                          rf.onBlur()
                          onFieldChange?.(field.name, event.target.value, {
                            ...formValues,
                            [field.name]: event.target.value,
                          })
                        }}
                        ref={rf.ref}
                        className={
                          fieldUsesUppercaseClass(field.name) ? 'uppercase' : undefined
                        }
                        wrapperClassName="min-w-0"
                        error={fieldError || fieldState.error?.message}
                      />
                    )}
                  />
                </div>
                <GridFieldLinkSlot linkAction={linkAction} />
              </div>
            )
          })}
        </FieldGrid>
      </SetupFormShell>

      <SetupFormFooter
        useResetFooter={useResetFooter}
        onReset={handleReset}
        onCancel={onCancel}
        hideSecondary={hideCancel}
        showSubmit={showSubmit}
        submitLabel={resolvedSubmitLabel}
      />
    </form>
  )
}
