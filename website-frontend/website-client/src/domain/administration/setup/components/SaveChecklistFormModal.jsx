import { useEffect, useMemo } from 'react'
import { useWatch } from 'react-hook-form'
import { useProbityForm } from '@/shared/utils/useProbityForm'
import { scheduleFocusFirstFormError } from '@/shared/utils/formValidationFocus'
import FormModal from '@/shared/components/modals/FormModal'
import {
  confirmBeforeAction,
  useActionConfirm,
  validateTriggerForm,
} from '@/shared/components/confirm'
import { DomainFormFooter } from '@/shared/components/domain'
import { OrgSelectField, TextAreaField } from '@/shared/components/forms'
import { MODULE_FORM_ERROR_BANNER_CLASS } from '@/shared/constants/moduleLayoutStyles'
import { setupFormFieldClass } from '../constants/setupStyles'
import { useGetFinancialYearMonthListQuery } from '../services/setupApi'

const EMPTY_VALUES = {
  financialYearId: '',
  frequency: '',
  month: '',
  toDoList: '',
}

const FREQUENCY_OPTIONS = [
  { value: 'M', label: 'Monthly' },
  { value: 'Y', label: 'Yearly' },
]

function monthOptionLabel(month) {
  return `${month.monthName} ${month.monthYear}`
}

export default function SaveChecklistFormModal({
  open,
  onClose,
  onSave,
  yearOptions = [],
  financialYearId = '',
  frequency = '',
  month = '',
}) {
  const requestConfirm = useActionConfirm()
  const {
    control,
    register,
    getValues,
    trigger,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useProbityForm({ defaultValues: EMPTY_VALUES })
  const selectedFrequency = useWatch({ control, name: 'frequency' })
  const selectedYearId = useWatch({ control, name: 'financialYearId' })
  const monthQuery = useGetFinancialYearMonthListQuery(selectedYearId, {
    skip: !open || !selectedYearId,
  })
  const monthOptions = useMemo(() => {
    const rows = Array.isArray(monthQuery.data) ? monthQuery.data : []
    return rows.map((month) => ({
      value: month.idMask,
      label: monthOptionLabel(month),
    }))
  }, [monthQuery.data])

  useEffect(() => {
    if (!open) {
      return
    }
    reset({
      financialYearId: financialYearId || '',
      frequency: frequency || '',
      month: frequency === 'M' ? (month || '') : '',
      toDoList: '',
    })
    clearErrors()
  }, [open, financialYearId, frequency, month, reset, clearErrors])

  const requestSave = () => {
    confirmBeforeAction(requestConfirm, {
      action: 'save',
      stack: 'nested',
      validate: async () => {
        clearErrors('root')
        const valid = await validateTriggerForm(trigger)
        if (!valid) {
          scheduleFocusFirstFormError()
        }
        return valid
      },
      runAction: async () => {
        const values = getValues()
        const failure = await onSave({
          financialYearId: values.financialYearId,
          frequency: values.frequency,
          financialYearMonthId: values.frequency === 'M' ? values.month : null,
          toDoList: values.toDoList.trim(),
        })
        if (failure) {
          const fieldErrors = failure.fieldErrors || {}
          ;['financialYearId', 'frequency', 'month', 'toDoList'].forEach((field) => {
            if (fieldErrors[field]) {
              setError(field, { message: fieldErrors[field] })
            }
          })
          if (!Object.keys(fieldErrors).length) {
            setError('root', {
              message: typeof failure.message === 'string'
                ? failure.message
                : 'Unable to save the checklist.',
            })
          }
          scheduleFocusFirstFormError()
          return false
        }
        onClose()
        return true
      },
    })
  }

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Save Checklist"
      size="4xl"
      showFooter={false}
    >
      <form
        className={`flex min-w-0 flex-col gap-4 ${setupFormFieldClass}`}
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          requestSave()
        }}
      >
        {errors.root?.message ? (
          <p className={MODULE_FORM_ERROR_BANNER_CLASS} role="alert">
            {errors.root.message}
          </p>
        ) : null}
        <OrgSelectField
          control={control}
          name="financialYearId"
          label="Financial Year"
          required
          translateOptions={false}
          placeholder="Select financial year"
          options={yearOptions}
          rules={{ required: 'Please select a financial year.' }}
        />
        <OrgSelectField
          control={control}
          name="frequency"
          label="Frequency"
          required
          translateOptions={false}
          placeholder="Select frequency"
          options={FREQUENCY_OPTIONS}
          rules={{ required: 'Please select a frequency.' }}
        />
        {selectedFrequency === 'M' ? (
          <OrgSelectField
            control={control}
            name="month"
            label="Month"
            required
            translateOptions={false}
            placeholder="Select month"
            options={monthOptions}
            rules={{ required: 'Please select a month.' }}
          />
        ) : null}
        <TextAreaField
          label="Checklist"
          required
          rows={4}
          error={errors.toDoList?.message}
          {...register('toDoList', {
            validate: (value) => (String(value || '').trim() ? true : 'Please enter the checklist.'),
          })}
        />
        <DomainFormFooter
          layout="page"
          onCancel={onClose}
          submitLabel="Save"
        />
      </form>
    </FormModal>
  )
}
