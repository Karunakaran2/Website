import { useCallback, useEffect } from 'react'
import { useProbityForm } from '@/shared/utils/useProbityForm'
import { validateTriggerForm } from '@/shared/components/confirm'
import { useSetupFormSaveRequest } from '../hooks/useSetupFormSaveRequest'
import { SetupLinkButton } from './setupGigwButtons'
import { FieldGrid, InputField, OrgSelectField } from '@/shared/components/forms'
import { scheduleFocusFirstFormError } from '@/shared/utils/formValidationFocus'
import { mergeProbityFieldRules } from '@/shared/utils/fieldValidationRules'
import SetupFormFooter from './SetupFormFooter'
import SetupFormShell from './SetupFormShell'
import { setupFormFieldClass } from '../constants/setupStyles'
import { useGetCostCentreListQuery } from '../services/setupApi'
import {
  DUPLICATE_COST_UNIT_MESSAGE,
  isDuplicateCostUnitName,
} from '../utils/costUnitUniqueness'

const emptyValues = {
  costCentreName: '',
  groupUnder: '',
}

function buildCostUnitFormValues(initialValues) {
  return {
    ...emptyValues,
    costCentreName: initialValues?.costCentreName ?? '',
    groupUnder: initialValues?.costCategoryId ?? '',
  }
}

export default function CostUnitForm({
  initialValues,
  groupUnderOptions = [],
  fieldErrors = {},
  formError,
  onSubmit,
  onCancel,
  onOpenAddCategory,
  isEditing = false,
}) {
  const requestSave = useSetupFormSaveRequest(isEditing)
  const {
    register,
    control,
    getValues,
    setError,
    trigger,
    reset,
    formState,
  } = useProbityForm({ defaultValues: emptyValues })
  const { errors } = formState
  const { data: costCentreList = [] } = useGetCostCentreListQuery()

  const recordKey = `cost-unit:${initialValues?.costId ?? 'new'}`

  useEffect(() => {
    reset(buildCostUnitFormValues(initialValues))
  }, [recordKey, reset, initialValues])

  const handleReset = () => {
    reset(buildCostUnitFormValues(initialValues))
  }

  const validateBeforeSave = useCallback(async () => {
    const valid = await validateTriggerForm(trigger)
    if (!valid) {
      scheduleFocusFirstFormError(() => formState.errors)
      return false
    }
    const values = getValues()
    const costCategoryId = values.groupUnder || initialValues?.costCategoryId
    if (isDuplicateCostUnitName(
      values.costCentreName,
      costCategoryId,
      costCentreList,
      initialValues,
    )) {
      setError('costCentreName', { type: 'validate', message: DUPLICATE_COST_UNIT_MESSAGE })
      scheduleFocusFirstFormError(() => ({
        ...formState.errors,
        costCentreName: { message: DUPLICATE_COST_UNIT_MESSAGE },
      }))
      return false
    }
    return true
  }, [costCentreList, formState.errors, getValues, initialValues, setError, trigger])

  const handleFormSubmit = useCallback(
    (event) => {
      event.preventDefault()
      const values = getValues()
      requestSave(
        () =>
          onSubmit({
            costCentreName: values.costCentreName?.trim() || null,
            costCategoryId: values.groupUnder ? Number(values.groupUnder) : null,
          }),
        validateBeforeSave,
      )
    },
    [getValues, onSubmit, requestSave, validateBeforeSave],
  )

  const costCentreError = fieldErrors.costCentreName || errors.costCentreName?.message
  const groupUnderError =
    fieldErrors.groupUnder || fieldErrors.costCategoryId || errors.groupUnder?.message

  return (
    <form
      onSubmit={handleFormSubmit}
      className={`flex w-full min-w-0 flex-col gap-4 ${setupFormFieldClass}`}
      noValidate
    >
      <SetupFormShell formError={formError}>
        <FieldGrid cols={1} className="w-full">
          <InputField
            label="Cost Unit Name"
            required
            autoComplete="off"
            {...register(
              'costCentreName',
              mergeProbityFieldRules(
                'costCentreName',
                { required: true, label: 'Cost Unit Name' },
                { required: 'Please enter Cost Unit Name.' },
              ),
            )}
            error={costCentreError}
          />

          <div className="min-w-0">
            <OrgSelectField
              control={control}
              name="groupUnder"
              label="Group Under"
              options={groupUnderOptions}
              required
              disabled={isEditing}
              rules={{ required: 'Please select Group Under.' }}
              externalError={groupUnderError}
            />
            {!isEditing ? (
              <SetupLinkButton type="button" onClick={onOpenAddCategory}>
                [Add new cost category]
              </SetupLinkButton>
            ) : null}
          </div>
        </FieldGrid>
      </SetupFormShell>

      <SetupFormFooter
        onReset={handleReset}
        onCancel={onCancel}
        submitLabel={isEditing ? 'Update' : 'Save'}
      />
    </form>
  )
}
