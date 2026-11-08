import { useEffect, useRef } from 'react'
import { Controller } from 'react-hook-form'
import { useProbityForm } from '@/shared/utils/useProbityForm'
import FormModal from '@/shared/components/modals/FormModal'
import {
  confirmBeforeAction,
  useActionConfirm,
  validateTriggerForm,
} from '@/shared/components/confirm'
import { DomainFormFooter } from '@/shared/components/domain'
import { InputField, OrgSelectField } from '@/shared/components/forms'
import { AUDIT_CLOSURE_MONTHS } from '../constants/auditClosureStore'
import { MODULE_FORM_ERROR_BANNER_CLASS } from '@/shared/constants/moduleLayoutStyles'
import { setupFormFieldClass } from '../constants/setupStyles'

const EMPTY_VALUES = { title: '', month: '', financialYearLabel: '' }

export default function PreClosureTodoFormModal({
  open,
  onClose,
  onSave,
  editing,
  yearOptions = [],
  selectedYear = '',
  selectedMonth = '',
  period = 'yearly',
}) {
  const requestConfirm = useActionConfirm()
  const todoInputRef = useRef(null)
  const {
    control,
    getValues,
    trigger,
    reset,
    clearErrors,
    formState: { errors },
  } = useProbityForm({ defaultValues: EMPTY_VALUES })

  useEffect(() => {
    if (!open) {
      return
    }
    reset({
      title: editing?.title ?? '',
      month: editing?.month || selectedMonth || '',
      financialYearLabel: editing?.financialYearLabel || selectedYear || '',
    })
    clearErrors()
    const todoInput = todoInputRef.current
    if (todoInput && document.activeElement !== todoInput) {
      todoInput.readOnly = true
    }
  }, [open, editing, selectedYear, selectedMonth, reset, clearErrors])

  const requestSave = () => {
    confirmBeforeAction(requestConfirm, {
      action: editing ? 'update' : 'save',
      stack: 'nested',
      recordLabel: getValues().title?.trim(),
      validate: () => validateTriggerForm(trigger),
      runAction: () => {
        const values = getValues()
        onSave({
          idMask: editing?.idMask,
          title: values.title.trim(),
          period,
          month: values.month,
          financialYearLabel: values.financialYearLabel,
        })
        onClose()
        return true
      },
    })
  }

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={
        editing
          ? (period === 'monthly' ? 'Edit Monthly Todo' : 'Edit Yearly Todo')
          : (period === 'monthly' ? 'Add Monthly Todo' : 'Add Yearly Todo')
      }
      size="4xl"
      showFooter={false}
    >
      <form
        className={`flex min-w-0 flex-col gap-4 ${setupFormFieldClass}`}
        autoComplete="off"
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
          name="financialYearLabel"
          label="Financial Year"
          required
          translateOptions={false}
          placeholder="Select financial year"
          options={yearOptions}
          rules={{ required: 'Please select a financial year.' }}
        />
        {period === 'monthly' ? (
          <OrgSelectField
            control={control}
            name="month"
            label="Month"
            required
            translateOptions={false}
            placeholder="Select month"
            options={AUDIT_CLOSURE_MONTHS}
            rules={{ required: 'Please select a month.' }}
          />
        ) : null}
        <Controller
          name="title"
          control={control}
          rules={{ required: 'Please enter the todo.' }}
          render={({ field, fieldState }) => (
            <InputField
              label="Todo"
              required
              name={field.name}
              id="audit-closure-todo"
              autoComplete="off"
              ref={(node) => {
                todoInputRef.current = node
                if (node && document.activeElement !== node) {
                  node.readOnly = true
                }
                field.ref(node)
              }}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              onFocus={(event) => {
                event.currentTarget.readOnly = false
              }}
              error={fieldState.error?.message}
            />
          )}
        />
        <DomainFormFooter
          layout="page"
          onCancel={onClose}
          submitLabel={editing ? 'Update' : 'Save'}
        />
      </form>
    </FormModal>
  )
}
