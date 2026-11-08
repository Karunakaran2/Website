import { useEffect, useMemo } from 'react'
import { useProbityForm } from '@/shared/utils/useProbityForm'
import FormModal from '@/shared/components/modals/FormModal'
import {
  confirmBeforeAction,
  useActionConfirm,
  validateTriggerForm,
} from '@/shared/components/confirm'
import { DomainFormFooter } from '@/shared/components/domain'
import { InputField, OrgSelectField } from '@/shared/components/forms'
import { MODULE_FORM_ERROR_BANNER_CLASS } from '@/shared/constants/moduleLayoutStyles'
import { mergeProbityFieldRules } from '@/shared/utils/fieldValidationRules'
import { setupFormFieldClass } from '@/domain/administration/setup/constants/setupStyles'

const ADD_ITEM_SERVICE_LEDGER_FORM_ID = 'add-item-service-ledger-form'

const EMPTY_VALUES = {
  hoaName: '',
  accountTypeId: '',
}

export default function AddItemServiceLedgerModal({
  open,
  kind = 'sales',
  groupOptions = [],
  onClose,
  onSave,
  saving = false,
  errorMessage,
}) {
  const requestConfirm = useActionConfirm()
  const isSales = kind === 'sales'
  const title = isSales ? 'Add New Sales Ledger' : 'Add Purchase Ledger'
  const nameLabel = isSales ? 'Sales Ledger Name' : 'Purchase Ledger Name'
  const groupLabel = isSales ? 'Sales Group Name' : 'Purchase Group Name'

  const {
    register,
    control,
    getValues,
    trigger,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useProbityForm({ defaultValues: EMPTY_VALUES })

  const selectOptions = useMemo(
    () => [
      { value: '', label: '--------Select--------' },
      ...(groupOptions || []).filter((option) => option?.value),
    ],
    [groupOptions],
  )

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
    const ok = await onSave({
      hoaName: values.hoaName.trim(),
      accountTypeId: Number(values.accountTypeId),
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
      title={title}
      size="lg"
      stack="nested"
      showFooter
      headerVariant="default"
      bodyMaxHeightClass="max-h-none"
      bodyClassName="!overflow-visible"
      footer={
        <DomainFormFooter
          layout="portal"
          form={ADD_ITEM_SERVICE_LEDGER_FORM_ID}
          onCancel={onClose}
          submitLabel="Save"
          submitLoading={saving}
        />
      }
    >
      <form
        id={ADD_ITEM_SERVICE_LEDGER_FORM_ID}
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
          <InputField
            label={nameLabel}
            required
            placeholder="Enter here"
            {...register(
              'hoaName',
              mergeProbityFieldRules(
                'hoaName',
                { required: true, label: 'Ledger Name' },
                { required: 'Please Enter Ledger Name' },
              ),
            )}
            error={errors.hoaName?.message}
          />

          <div className="min-w-0">
            <OrgSelectField
              control={control}
              name="accountTypeId"
              label={groupLabel}
              options={selectOptions}
              required
              rules={{ required: 'Please Select Group Name' }}
              externalError={errors.accountTypeId?.message}
            />
            {!groupOptions?.length ? (
              <p className="mt-1 text-xs text-amber-700">
                No {isSales ? 'Income' : 'Expense'} groups found. Add groups under Group Setup first.
              </p>
            ) : null}
          </div>
        </div>
      </form>
    </FormModal>
  )
}
