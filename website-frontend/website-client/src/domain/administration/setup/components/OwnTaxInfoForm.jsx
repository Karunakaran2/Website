import { useCallback, useEffect, useState } from 'react'
import { useFieldArray } from 'react-hook-form'
import { validateTriggerForm } from '@/shared/components/confirm'
import { useSetupFormSaveRequest } from '../hooks/useSetupFormSaveRequest'
import { Building2, Landmark, Receipt } from 'lucide-react'
import { useProbityForm } from '@/shared/utils/useProbityForm'
import { scheduleFocusFirstFormError } from '@/shared/utils/formValidationFocus'
import { fieldUsesUppercaseClass, probityFieldRules } from '@/shared/utils/fieldValidationRules'
import { SetupFormIconRowActions } from './setupGigwButtons'
import {
  FieldGrid,
  FormSection,
  formCheckboxControlClass,
  formOptionLabelClass,
  InputField,
  OrgSelectField,
  TextAreaField,
} from '@/shared/components/forms'
import SetupFormFooter from './SetupFormFooter'
import SetupFormSection from './SetupFormSection'
import SetupFormShell from './SetupFormShell'
import { setupFormFieldClass } from '../constants/setupStyles'

const emptyGstAddress = {
  gstNumber: '',
  buildingName: '',
  firstLocation: '',
  secondLocation: '',
  city: '',
  state: '',
  pincode: '',
  phoneNo: '',
  mailId: '',
  authorizedPersonName: '',
  authorizedPersonDesignation: '',
  defaultStatus: false,
}

const emptyCompanyLedger = {
  gstNumber: '',
  sgstInputLedgerId: '',
  cgstInputLedgerId: '',
  igstInputLedgerId: '',
  sgstPayableLedgerId: '',
  cgstPayableLedgerId: '',
  igstPayableLedgerId: '',
}

const emptyTdsLedger = {
  tdsTypeId: '',
  tdsPayableLedgerId: '',
  tdsReceivableLedgerId: '',
}

const gstAddressFields = [
  { name: 'gstNumber', label: 'GSTIN', required: true },
  { name: 'buildingName', label: 'Building Name', required: true },
  { name: 'firstLocation', label: 'Location 1', required: true },
  { name: 'secondLocation', label: 'Location 2' },
  { name: 'city', label: 'City', required: true },
  { name: 'state', label: 'State', required: true },
  { name: 'pincode', label: 'Pincode', required: true },
  { name: 'phoneNo', label: 'Phone No', required: true },
  { name: 'mailId', label: 'Mail Id', required: true },
  { name: 'authorizedPersonName', label: 'Authorized Person Name', required: true },
  { name: 'authorizedPersonDesignation', label: 'Authorized Person Designation', required: true },
]

const companyLedgerFields = [
  { name: 'sgstInputLedgerId', label: 'SGST Input Account Ledger', required: true },
  { name: 'cgstInputLedgerId', label: 'CGST Input Account Ledger', required: true },
  { name: 'igstInputLedgerId', label: 'IGST Input Account Ledger', required: true },
  { name: 'sgstPayableLedgerId', label: 'SGST Payable Account Ledger', required: true },
  { name: 'cgstPayableLedgerId', label: 'CGST Payable Account Ledger', required: true },
  { name: 'igstPayableLedgerId', label: 'IGST Payable Account Ledger', required: true },
]

const tdsLedgerFields = [
  { name: 'tdsTypeId', label: 'TDS Type', required: true, optionsKey: 'tdsType' },
  { name: 'tdsPayableLedgerId', label: 'TDS Payable Ledger', required: true },
  { name: 'tdsReceivableLedgerId', label: 'TDS Receivable Ledger', required: true },
]

function toSelectId(value) {
  return value == null || value === '' ? '' : String(value)
}

const companyDetailFields = [
  { name: 'companyName', label: 'Company Name', required: true },
  { name: 'registeredOfficeAddress', label: 'Registered Address', type: 'textarea', required: true },
  { name: 'contactNumber', label: 'Contact Number', required: true },
  { name: 'mailId', label: 'Mail Id', required: true },
  { name: 'panNumber', label: 'PAN', required: true },
  { name: 'tanNumber', label: 'TAN', required: true },
]

function emptyOwnTaxValues() {
  return {
    companyId: '',
    companyName: '',
    registeredOfficeAddress: '',
    contactNumber: '',
    mailId: '',
    panNumber: '',
    tanNumber: '',
    gstAddressEntries: [{ ...emptyGstAddress }],
    companyLedgerEntries: [{ ...emptyCompanyLedger }],
    tdsLedgerEntries: [{ ...emptyTdsLedger }],
  }
}

function buildOwnTaxFormValues(initialValues) {
  return {
    ...emptyOwnTaxValues(),
    ...(initialValues || {}),
    gstAddressEntries: initialValues?.gstAddressEntries?.length
      ? initialValues.gstAddressEntries
      : [{ ...emptyGstAddress }],
    companyLedgerEntries: initialValues?.companyLedgerEntries?.length
      ? initialValues.companyLedgerEntries.map((entry) => ({
          ...emptyCompanyLedger,
          ...entry,
          sgstInputLedgerId: toSelectId(entry.sgstInputLedgerId),
          cgstInputLedgerId: toSelectId(entry.cgstInputLedgerId),
          igstInputLedgerId: toSelectId(entry.igstInputLedgerId),
          sgstPayableLedgerId: toSelectId(entry.sgstPayableLedgerId),
          cgstPayableLedgerId: toSelectId(entry.cgstPayableLedgerId),
          igstPayableLedgerId: toSelectId(entry.igstPayableLedgerId),
        }))
      : [{ ...emptyCompanyLedger }],
    tdsLedgerEntries: initialValues?.tdsLedgerEntries?.length
      ? initialValues.tdsLedgerEntries.map((entry) => ({
          ...emptyTdsLedger,
          ...entry,
          tdsTypeId: toSelectId(entry.tdsTypeId),
          tdsPayableLedgerId: toSelectId(entry.tdsPayableLedgerId),
          tdsReceivableLedgerId: toSelectId(entry.tdsReceivableLedgerId),
        }))
      : [{ ...emptyTdsLedger }],
  }
}

export default function OwnTaxInfoForm({
  initialValues,
  fieldErrors,
  formError,
  onSubmit,
  onCancel,
  onGstNumberBlur,
  isEditing = false,
  hoaOptions = [{ value: '', label: 'Select HOA Name' }],
  tdsTypeOptions = [{ value: '', label: 'Select TDS Type' }],
}) {
  const requestSave = useSetupFormSaveRequest(isEditing)
  const [rowNotice, setRowNotice] = useState('')
  const { register, getValues, reset, setValue, control, trigger, formState } = useProbityForm({
    defaultValues: emptyOwnTaxValues(),
  })
  const { errors } = formState
  const {
    fields: gstFields,
    append: appendGst,
    remove: removeGst,
  } = useFieldArray({ control, name: 'gstAddressEntries' })
  const {
    fields: ledgerFields,
    append: appendLedger,
    remove: removeLedger,
  } = useFieldArray({ control, name: 'companyLedgerEntries' })
  const {
    fields: tdsFields,
    append: appendTds,
    remove: removeTds,
  } = useFieldArray({ control, name: 'tdsLedgerEntries' })

  const recordKey = `own-tax-info:${initialValues?.id ?? 'new'}:${initialValues?.companyId ?? ''}`

  useEffect(() => {
    reset(buildOwnTaxFormValues(initialValues))
    // Reset only when switching create/edit record or company id loads — not on every parent re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordKey, reset])

  const handleReset = () => {
    reset(buildOwnTaxFormValues(initialValues))
  }

  const syncLedgerGstNumber = (index, gstNumber) => {
    setValue(`companyLedgerEntries.${index}.gstNumber`, gstNumber || '')
  }

  const handleAddGstRow = () => {
    appendGst({ ...emptyGstAddress })
    appendLedger({ ...emptyCompanyLedger })
  }

  const handleRemoveGstRow = (index) => {
    // Probity 2.0: only the last GST row can be removed; keep at least one row.
    if (gstFields.length <= 1) {
      setRowNotice('Minimum one GST detail row is required.')
      return
    }
    setRowNotice('')
    if (index !== gstFields.length - 1) {
      return
    }
    removeGst(index)
    if (ledgerFields.length > index) {
      removeLedger(index)
    }
  }

  const handleAddTdsRow = () => {
    appendTds({ ...emptyTdsLedger })
  }

  const handleRemoveTdsRow = (index) => {
    if (tdsFields.length <= 1) {
      setRowNotice('Minimum one TDS detail row is required.')
      return
    }
    setRowNotice('')
    if (index !== tdsFields.length - 1) {
      return
    }
    removeTds(index)
  }

  const handleDefaultChange = (index, checked) => {
    setValue(`gstAddressEntries.${index}.defaultStatus`, checked)
    if (!checked) {
      return
    }
    gstFields.forEach((_, rowIndex) => {
      if (rowIndex !== index) {
        setValue(`gstAddressEntries.${rowIndex}.defaultStatus`, false)
      }
    })
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
      <input type="hidden" {...register('companyId')} />

      <SetupFormShell formError={rowNotice || formError}>
        <FormSection title="Company Details" variant="card" icon={Building2}>
        <FieldGrid cols={3}>
          {companyDetailFields.map((field) => {
            const fieldError = fieldErrors[field.name] || errors[field.name]?.message
            if (field.type === 'textarea') {
              return (
                <TextAreaField
                  key={field.name}
                  label={field.label}
                  required={field.required}
                  readOnly
                  disabled
                  rows={3}
                  {...register(
                    field.name,
                    probityFieldRules(field.name, { required: field.required, label: field.label }),
                  )}
                  error={fieldError}
                />
              )
            }
            return (
              <InputField
                key={field.name}
                label={field.label}
                required={field.required}
                readOnly
                disabled
                className={fieldUsesUppercaseClass(field.name) ? 'uppercase' : undefined}
                {...register(
                  field.name,
                  probityFieldRules(field.name, { required: field.required, label: field.label }),
                )}
                error={fieldError}
              />
            )
          })}
        </FieldGrid>
        </FormSection>
      </SetupFormShell>

      <SetupFormSection title="GST Details" icon={Receipt}>
        {gstFields.map((row, index) => {
          const isLastGstRow = index === gstFields.length - 1
          return (
            <div
              key={row.id}
              className="space-y-3 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0"
            >
              <FieldGrid cols={3}>
                {gstAddressFields.map((field) => {
                  const mappedName = field.name === 'mailId' ? 'gstMailId' : field.name
                  const errorKey = index === 0 ? mappedName : `${mappedName}[${index}]`
                  const gstErrorKey = index === 0 ? 'gstNumber' : `gstNumber[${index}]`
                  const rhfMessage = errors.gstAddressEntries?.[index]?.[field.name]?.message
                  const gstFieldError = fieldErrors[errorKey]
                    || (field.name === 'gstNumber' ? fieldErrors[gstErrorKey] : '')
                    || rhfMessage
                  const fieldName = `gstAddressEntries.${index}.${field.name}`
                  const validation = probityFieldRules(field.name, {
                    required: field.required,
                    label: field.label,
                  })
                  const registration = register(fieldName, validation)
                  return (
                    <InputField
                      key={field.name}
                      label={field.label}
                      required={field.required}
                      className={fieldUsesUppercaseClass(field.name) ? 'uppercase' : undefined}
                      autoComplete="off"
                      name={registration.name}
                      ref={registration.ref}
                      onChange={registration.onChange}
                      onBlur={(event) => {
                        registration.onBlur(event)
                        if (field.name === 'gstNumber') {
                          const value = event.target.value
                          syncLedgerGstNumber(index, value)
                          onGstNumberBlur?.(value, index)
                        }
                      }}
                      error={gstFieldError}
                    />
                  )
                })}

                <input type="hidden" {...register(`companyLedgerEntries.${index}.gstNumber`)} />
                {companyLedgerFields.map((field) => {
                  const errorKey = index === 0 ? field.name.replace(/Id$/, '') : `${field.name.replace(/Id$/, '')}[${index}]`
                  const idErrorKey = index === 0 ? field.name : `${field.name}[${index}]`
                  const fieldError =
                    fieldErrors[errorKey] || fieldErrors[idErrorKey] || errors.companyLedgerEntries?.[index]?.[field.name]?.message
                  const fieldName = `companyLedgerEntries.${index}.${field.name}`
                  return (
                    <OrgSelectField
                      key={field.name}
                      control={control}
                      name={fieldName}
                      label={field.label}
                      options={hoaOptions}
                      required
                      rules={probityFieldRules(field.name, {
                        required: true,
                        label: field.label,
                        fieldType: 'select',
                      })}
                      externalError={fieldError}
                    />
                  )
                })}

                <div className="flex min-w-0 flex-col justify-end">
                  <label className={`mb-1 cursor-pointer ${formOptionLabelClass}`}>
                    <input
                      type="checkbox"
                      className={formCheckboxControlClass}
                      {...register(`gstAddressEntries.${index}.defaultStatus`)}
                      onChange={(event) => handleDefaultChange(index, event.target.checked)}
                    />
                    Set as default
                  </label>
                </div>

                <div className="min-w-0">
                  <SetupFormIconRowActions
                    canRemove={gstFields.length > 1 && isLastGstRow}
                    showAdd={isLastGstRow}
                    onRemove={() => handleRemoveGstRow(index)}
                    onAdd={handleAddGstRow}
                    removeLabel={`Remove GST row ${index + 1}`}
                    addLabel="Add GST row"
                  />
                </div>
              </FieldGrid>
            </div>
          )
        })}
      </SetupFormSection>

      <SetupFormSection title="TDS Details" icon={Landmark}>
        {tdsFields.map((row, index) => {
          const isLastTdsRow = index === tdsFields.length - 1
          return (
            <div
              key={row.id}
              className="space-y-3 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0"
            >
              <FieldGrid cols={3}>
                {tdsLedgerFields.map((field) => {
                  const errorKey = index === 0 ? field.name.replace(/Id$/, '') : `${field.name.replace(/Id$/, '')}[${index}]`
                  const idErrorKey = index === 0 ? field.name : `${field.name}[${index}]`
                  const fieldError =
                    fieldErrors[errorKey] || fieldErrors[idErrorKey] || errors.tdsLedgerEntries?.[index]?.[field.name]?.message
                  const fieldName = `tdsLedgerEntries.${index}.${field.name}`
                  const options = field.optionsKey === 'tdsType' ? tdsTypeOptions : hoaOptions
                  return (
                    <OrgSelectField
                      key={field.name}
                      control={control}
                      name={fieldName}
                      label={field.label}
                      options={options}
                      required
                      rules={probityFieldRules(field.name, {
                        required: true,
                        label: field.label,
                        fieldType: 'select',
                      })}
                      externalError={fieldError}
                    />
                  )
                })}
                <div className="min-w-0">
                  <SetupFormIconRowActions
                    canRemove={tdsFields.length > 1 && isLastTdsRow}
                    showAdd={isLastTdsRow}
                    onRemove={() => handleRemoveTdsRow(index)}
                    onAdd={handleAddTdsRow}
                    removeLabel={`Remove TDS row ${index + 1}`}
                    addLabel="Add TDS row"
                  />
                </div>
              </FieldGrid>
            </div>
          )
        })}
      </SetupFormSection>

      <SetupFormFooter
        onReset={handleReset}
        onCancel={onCancel}
        submitLabel={isEditing ? 'Update' : 'Save'}
      />
    </form>
  )
}
