import { useCallback, useEffect } from 'react'
import { useFieldArray } from 'react-hook-form'
import { validateTriggerForm } from '@/shared/components/confirm'
import { useSetupFormSaveRequest } from '../hooks/useSetupFormSaveRequest'
import { useProbityForm } from '@/shared/utils/useProbityForm'
import { Building2, Receipt } from 'lucide-react'
import { SetupFormRowActions } from './setupGigwButtons'
import { FieldGrid, InputField, OrgSelectField, TextAreaField } from '@/shared/components/forms'
import { scheduleFocusFirstFormError } from '@/shared/utils/formValidationFocus'
import { fieldUsesUppercaseClass, probityFieldRules } from '@/shared/utils/fieldValidationRules'
import SetupFormSection from './SetupFormSection'
import SetupFormFooter from './SetupFormFooter'
import SetupFormShell from './SetupFormShell'
import { setupFormFieldClass } from '../constants/setupStyles'

const emptyGstAddress = {
  gstNumber: '',
  buildingName: '',
  firstLocation: '',
  city: '',
  state: '',
  pincode: '',
  phoneNo: '',
  mailId: '',
  authorizedPersonName: '',
  authorizedPersonDesignation: '',
}

const gstAddressFields = [
  { name: 'gstNumber', label: 'GSTIN', required: true },
  { name: 'buildingName', label: 'Building Name', required: true },
  { name: 'firstLocation', label: 'Location', required: true },
  { name: 'city', label: 'City', required: true },
  { name: 'state', label: 'State', required: true },
  { name: 'pincode', label: 'Pincode', required: true },
  { name: 'phoneNo', label: 'Phone No', required: true },
  { name: 'mailId', label: 'Email', required: true },
  { name: 'authorizedPersonName', label: 'Authorized Person Name', required: true },
  { name: 'authorizedPersonDesignation', label: 'Authorized Person Designation', required: true },
]

function emptyOfficeValues(fields) {
  return fields.reduce((acc, field) => {
    acc[field.name] = ''
    return acc
  }, { gstAddressEntries: [{ ...emptyGstAddress }] })
}

function buildOfficeFormValues(fields, initialValues) {
  return {
    ...emptyOfficeValues(fields),
    ...(initialValues || {}),
    gstAddressEntries: initialValues?.gstAddressEntries?.length
      ? initialValues.gstAddressEntries
      : [{ ...emptyGstAddress }],
  }
}

export default function OfficeSetupForm({
  master,
  initialValues,
  companyOptions,
  fieldErrors,
  formError,
  onSubmit,
  onCancel,
  onGstNumberBlur,
  isEditing = false,
}) {
  const requestSave = useSetupFormSaveRequest(isEditing)
  const { register, getValues, reset, control, trigger, formState } = useProbityForm({
    defaultValues: emptyOfficeValues(master.fields),
  })
  const { errors } = formState
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'gstAddressEntries',
  })

  const recordKey = `${master.resource}:${initialValues?.idMask ?? initialValues?.id ?? 'new'}`

  useEffect(() => {
    reset(buildOfficeFormValues(master.fields, initialValues))
  }, [recordKey, master.fields, reset])

  const handleReset = () => {
    reset(buildOfficeFormValues(master.fields, initialValues))
  }

  const validateBeforeSave = useCallback(async () => {
    const valid = await validateTriggerForm(trigger)
    if (!valid) {
      scheduleFocusFirstFormError(() => formState.errors)
    }
    return valid
  }, [formState.errors, trigger])

  const handleFormSubmit = useCallback(
    (event) => {
      event.preventDefault()
      requestSave(
        () => onSubmit(getValues()),
        validateBeforeSave,
      )
    },
    [getValues, onSubmit, requestSave, validateBeforeSave],
  )

  return (
    <form
      onSubmit={handleFormSubmit}
      className={`flex min-w-0 flex-col gap-4 ${setupFormFieldClass}`}
      noValidate
    >
      <SetupFormShell formError={formError}>
        <SetupFormSection title="Office Details" icon={Building2}>
          <FieldGrid cols={3}>
            {master.fields.map((field) => {
              const fieldError = fieldErrors[field.name] || errors[field.name]?.message
              const validation = probityFieldRules(field.name, {
                required: field.required,
                label: field.label,
                fieldType: field.type,
              })

              if (field.type === 'textarea') {
                return (
                  <TextAreaField
                    key={field.name}
                    label={field.label}
                    required={field.required}
                    rows={3}
                    autoComplete="off"
                    {...register(field.name, validation)}
                    error={fieldError}
                  />
                )
              }

              if (field.type === 'select') {
                return (
                  <OrgSelectField
                    key={field.name}
                    control={control}
                    name={field.name}
                    label={field.label}
                    options={companyOptions}
                    required={field.required}
                    rules={validation}
                    externalError={fieldError}
                  />
                )
              }

              return (
                <InputField
                  key={field.name}
                  label={field.label}
                  required={field.required}
                  autoComplete="off"
                  {...register(field.name, validation)}
                  error={fieldError}
                />
              )
            })}
          </FieldGrid>
        </SetupFormSection>
      </SetupFormShell>

      <SetupFormSection title="GST Details" icon={Receipt}>
        {fields.map((row, index) => (
          <div key={row.id} className="space-y-3 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
            <FieldGrid cols={3}>
              {gstAddressFields.map((field) => {
                const mappedName = field.name === 'mailId' ? 'gstMailId' : field.name
                const errorKey = index === 0 ? mappedName : `${mappedName}[${index}]`
                const gstErrorKey = index === 0 ? 'gstNumber' : `gstNumber[${index}]`
                const serverError =
                  fieldErrors[errorKey] || (field.name === 'gstNumber' ? fieldErrors[gstErrorKey] : '')
                const rhfMessage = errors.gstAddressEntries?.[index]?.[field.name]?.message
                const displayError = serverError || rhfMessage
                const fieldName = `gstAddressEntries.${index}.${field.name}`
                const validation = probityFieldRules(field.name, {
                  required: field.required,
                  label: field.label,
                })
                const registration = register(fieldName, validation)

                return (
                  <InputField
                    key={`${row.id}-${field.name}`}
                    label={field.label}
                    required={field.required}
                    className={fieldUsesUppercaseClass(field.name) ? 'uppercase' : undefined}
                    autoComplete="off"
                    name={registration.name}
                    ref={registration.ref}
                    onChange={registration.onChange}
                    onBlur={(event) => {
                      registration.onBlur(event)
                      if (field.name === 'gstNumber' && onGstNumberBlur) {
                        onGstNumberBlur(event.target.value, index)
                      }
                    }}
                    error={displayError}
                  />
                )
              })}
            </FieldGrid>
            <SetupFormRowActions
              showRemove={fields.length > 1}
              canRemove
              onRemove={() => remove(index)}
              onAdd={index === fields.length - 1 ? () => append({ ...emptyGstAddress }) : undefined}
              addLabel="Add GST"
            />
          </div>
        ))}
      </SetupFormSection>

      <SetupFormFooter
        onReset={handleReset}
        onCancel={onCancel}
        submitLabel={isEditing ? 'Update' : 'Save'}
      />
    </form>
  )
}
