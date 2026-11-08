import { useEffect, useState } from 'react'
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

const ADD_BRANCH_FORM_ID = 'add-branch-form'

const EMPTY_VALUES = {
  branchName: '',
  ifsc: '',
}

export default function AddBranchModal({
  open,
  bankName,
  onClose,
  onSave,
  onLookupIfsc,
  saving = false,
  errorMessage,
}) {
  const requestConfirm = useActionConfirm()
  const [lookingUp, setLookingUp] = useState(false)
  const {
    register,
    getValues,
    setValue,
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
    setLookingUp(false)
  }, [open, reset, clearErrors])

  useEffect(() => {
    if (!open || !errorMessage) {
      return
    }
    setError('root', { message: errorMessage })
  }, [open, errorMessage, setError])

  const handleIfscBlur = async () => {
    const trimmed = getValues('ifsc').trim().toUpperCase()
    if (trimmed.length !== 11 || !onLookupIfsc) {
      return
    }
    setLookingUp(true)
    const details = await onLookupIfsc(trimmed)
    setLookingUp(false)
    if (details?.ifscNo) {
      setValue('ifsc', details.ifscNo, { shouldValidate: true })
    }
    if (details?.branchName && !getValues('branchName').trim()) {
      setValue('branchName', details.branchName, { shouldValidate: true })
    }
  }

  const branchNameReg = register(
    'branchName',
    mergeProbityFieldRules(
      'branchName',
      { required: true, label: 'Branch Name' },
      { required: 'Please enter branch name.' },
    ),
  )
  const ifscReg = register(
    'ifsc',
    mergeProbityFieldRules(
      'ifsc',
      { required: true, label: 'IFSC Code' },
      { required: 'Please enter IFSC code.' },
    ),
  )

  const runSave = async (values) => {
    clearErrors('root')
    const ok = await onSave({
      branchName: values.branchName.trim(),
      ifsc: values.ifsc.trim().toUpperCase() || null,
    })
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
      title="Add New Branch"
      size="sm"
      stack="nested"
      showFooter
      headerVariant="default"
      bodyMaxHeightClass="max-h-none"
      bodyClassName={setupFormFieldClass}
      footer={
        <DomainFormFooter
          layout="portal"
          form={ADD_BRANCH_FORM_ID}
          onCancel={onClose}
          submitLabel="Save"
          submitLoading={saving}
        />
      }
    >
      <form
        id={ADD_BRANCH_FORM_ID}
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

        <p className="text-sm text-slate-600">
          Bank:{' '}
          <span className="font-medium text-slate-800">{bankName || 'Selected bank'}</span>
        </p>

        <InputField
          label="Branch Name"
          required
          autoComplete="off"
          name={branchNameReg.name}
          ref={branchNameReg.ref}
          onBlur={branchNameReg.onBlur}
          onChange={branchNameReg.onChange}
          error={errors.branchName?.message}
        />

        <InputField
          label="IFSC Code"
          required
          autoComplete="off"
          maxLength={11}
          className="uppercase"
          hint={lookingUp ? 'Looking up IFSC…' : undefined}
          name={ifscReg.name}
          ref={ifscReg.ref}
          onChange={(event) => {
            ifscReg.onChange({
              ...event,
              target: { ...event.target, value: event.target.value.toUpperCase() },
            })
          }}
          onBlur={(event) => {
            ifscReg.onBlur(event)
            void handleIfscBlur()
          }}
          error={errors.ifsc?.message}
        />
      </form>
    </FormModal>
  )
}
