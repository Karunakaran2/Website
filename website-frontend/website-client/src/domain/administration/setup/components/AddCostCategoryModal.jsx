import { useEffect } from 'react'
import { useProbityForm } from '@/shared/utils/useProbityForm'
import FormModal from '@/shared/components/modals/FormModal'
import {
  confirmBeforeAction,
  useActionConfirm,
  validateTriggerForm,
} from '@/shared/components/confirm'
import { DomainFormFooter } from '@/shared/components/domain'
import { InputField } from '@/shared/components/forms'
import { MODULE_FORM_ERROR_BANNER_CLASS } from '@/shared/constants/moduleLayoutStyles'
import { mergeProbityFieldRules } from '@/shared/utils/fieldValidationRules'
import { setupFormFieldClass } from '../constants/setupStyles'

const ADD_COST_CATEGORY_FORM_ID = 'add-cost-category-form'

const EMPTY_VALUES = { costCategoryName: '' }

export default function AddCostCategoryModal({
  open,
  onClose,
  onSave,
  saving = false,
  errorMessage,
}) {
  const requestConfirm = useActionConfirm()
  const {
    register,
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
    reset(EMPTY_VALUES)
    clearErrors()
  }, [open, reset, clearErrors])

  useEffect(() => {
    if (!open || !errorMessage) {
      return
    }
    setError('root', { message: errorMessage })
  }, [open, errorMessage, setError])

  const runSave = async (values) => {
    clearErrors('root')
    const ok = await onSave(values.costCategoryName.trim())
    if (!ok) {
      return false
    }
    onClose()
    return true
  }

  const requestSave = () => {
    clearErrors('root')
    confirmBeforeAction(requestConfirm, {
      action: 'save',
      stack: 'nested',
      validate: () => validateTriggerForm(trigger),
      runAction: () => runSave(getValues()),
    })
  }

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Add New Cost Category"
      size="sm"
      stack="nested"
      showFooter
      headerVariant="default"
      bodyMaxHeightClass="max-h-none"
      footer={
        <DomainFormFooter
          layout="portal"
          form={ADD_COST_CATEGORY_FORM_ID}
          onCancel={onClose}
          submitLabel="Save"
          submitLoading={saving}
        />
      }
    >
      <form
        id={ADD_COST_CATEGORY_FORM_ID}
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

        <InputField
          label="Group Name"
          required
          placeholder="Cost category name"
          autoComplete="off"
          {...register(
            'costCategoryName',
            mergeProbityFieldRules(
              'costCategoryName',
              { required: true, label: 'Group Name' },
              { required: 'Please enter Group Name.' },
            ),
          )}
          error={errors.costCategoryName?.message}
        />
      </form>
    </FormModal>
  )
}
