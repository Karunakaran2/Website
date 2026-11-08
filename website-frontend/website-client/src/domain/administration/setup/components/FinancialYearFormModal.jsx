import { useEffect } from 'react'
import { useProbityForm } from '@/shared/utils/useProbityForm'
import { scheduleFocusFirstFormError } from '@/shared/utils/formValidationFocus'
import FormModal from '@/shared/components/modals/FormModal'
import {
  confirmBeforeAction,
  useActionConfirm,
  validateTriggerForm,
} from '@/shared/components/confirm'
import { DomainFormFooter } from '@/shared/components/domain'
import { OrgDateField } from '@/shared/components/forms'
import { MODULE_FORM_ERROR_BANNER_CLASS } from '@/shared/constants/moduleLayoutStyles'
import { setupFormFieldClass } from '../constants/setupStyles'

const EMPTY_VALUES = { fromDate: null, toDate: null }

export default function FinancialYearFormModal({ open, onClose, onSave, editing = null }) {
  const requestConfirm = useActionConfirm()
  const {
    control,
    getValues,
    trigger,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useProbityForm({ defaultValues: EMPTY_VALUES })

  useEffect(() => {
    if (!open) {
      return
    }
    reset(editing
      ? { fromDate: editing.fromDate ?? null, toDate: editing.toDate ?? null }
      : EMPTY_VALUES)
    clearErrors()
  }, [open, editing, reset, clearErrors])

  const validateDates = async () => {
    clearErrors('root')
    const valid = await validateTriggerForm(trigger)
    if (!valid) {
      scheduleFocusFirstFormError()
      return false
    }
    const { fromDate, toDate } = getValues()
    if (fromDate && toDate && toDate < fromDate) {
      setError('toDate', { message: 'To date must be on or after from date.' })
      scheduleFocusFirstFormError(() => ({
        toDate: { message: 'To date must be on or after from date.' },
      }))
      return false
    }
    return true
  }

  const requestSave = () => {
    confirmBeforeAction(requestConfirm, {
      action: editing ? 'update' : 'save',
      stack: 'nested',
      recordLabel: editing?.label,
      validate: validateDates,
      runAction: async () => {
        const { fromDate, toDate } = getValues()
        const failure = await onSave({
          idMask: editing?.idMask,
          fromDate,
          toDate,
        })
        if (failure) {
          const fieldErrors = failure.fieldErrors || {}
          if (fieldErrors.fromDate) {
            setError('fromDate', { message: fieldErrors.fromDate })
          }
          if (fieldErrors.toDate) {
            setError('toDate', { message: fieldErrors.toDate })
          }
          if (!fieldErrors.fromDate && !fieldErrors.toDate) {
            setError('root', {
              message: typeof failure.message === 'string'
                ? failure.message
                : 'Unable to save the financial year.',
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
      title={editing ? 'Edit Financial Year' : 'Add Financial Year'}
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
        <div className="grid gap-4 sm:grid-cols-2">
          <OrgDateField
            control={control}
            name="fromDate"
            label="From Date"
            required
            rules={{ required: 'Please select from date.' }}
          />
          <OrgDateField
            control={control}
            name="toDate"
            label="To Date"
            required
            rules={{ required: 'Please select to date.' }}
          />
        </div>
        <DomainFormFooter
          layout="page"
          onCancel={onClose}
          submitLabel={editing ? 'Update' : 'Save'}
        />
      </form>
    </FormModal>
  )
}
