import { useEffect } from 'react'
import { Package } from 'lucide-react'
import {
  FieldError,
  FieldGrid,
  InputField,
  RadioGroup,
  SelectField,
} from '@/shared/components/forms'
import FormProfileSection from '@/shared/components/forms/FormProfileSection'
import { DomainFormFooter } from '@/shared/components/domain'
import { MODULE_FORM_ERROR_BANNER_CLASS } from '@/shared/constants/moduleLayoutStyles'
import {
  DEPRECIABLE_OPTIONS,
  DEPRECIATION_METHOD_OPTIONS,
} from '../constants/faGroup'
import {
  useGetAssetClassItListQuery,
  useGetFaGroupNumberingSetupListQuery,
} from '../services/assetApi'

export default function FaGroupAssetDetailsForm({
  formId = 'fa-group-form',
  values,
  fieldErrors = {},
  formError,
  editingIdMask,
  showFooter = true,
  onChange,
  onSubmit,
  onCancelEdit,
}) {
  const {
    data: classOptions = [],
    isError: assetClassListError,
    isFetching: assetClassListLoading,
  } = useGetAssetClassItListQuery()

  const assetClassItId = values.assetClassItId
  const selectedClass = classOptions.find(
    (opt) => String(opt.value) === String(assetClassItId),
  )
  const voucherType = (
    selectedClass?.voucherType ||
    selectedClass?.label ||
    ''
  ).trim()
  const {
    data: numberingOptions = [],
    isFetching: numberingLoading,
    isError: numberingError,
  } = useGetFaGroupNumberingSetupListQuery(voucherType, {
    skip: !voucherType,
  })

  const showDepreciationFields = values.depreciable === 'Y'

  useEffect(() => {
    if (!assetClassItId || numberingLoading || numberingError) {
      return
    }
    const current = String(values.assetNumber ?? '')
    const stillValid = numberingOptions.some((opt) => opt.value === current)
    if (!stillValid) {
      onChange('assetNumber', numberingOptions[0]?.value ?? '')
    }
  }, [
    assetClassItId,
    numberingLoading,
    numberingError,
    numberingOptions,
    onChange,
    values.assetNumber,
  ])

  const handleField =
    (field) =>
    (event) => {
      const next = event?.target?.value ?? event
      onChange(field, next)
    }

  const handleClassChange = (event) => {
    const classId = event.target.value
    onChange('assetClassItId', classId)
    onChange('assetNumber', '')
  }

  return (
    <form
      id={formId}
      className="flex min-w-0 flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
      noValidate
    >
      <FormProfileSection icon={Package} title="Asset Details">
        <FieldGrid cols={3}>
          <InputField
            label="Asset Type"
            name="assetType"
            value={values.assetType}
            onChange={handleField('assetType')}
            placeholder="Asset Type"
            required
            error={fieldErrors.assetType}
            className="uppercase"
          />

          <SelectField
            label="Asset Class (IT)"
            name="assetClassItId"
            value={values.assetClassItId}
            onChange={handleClassChange}
            required
            error={
              fieldErrors.assetClassItId ||
              (assetClassListError
                ? 'Unable to load asset classes. Check asset service and try again.'
                : !assetClassListLoading && classOptions.length === 0
                  ? 'No asset classes are configured in the database. Restart asset-service or seed asset_class_it.'
                  : undefined)
            }
            disabled={
              assetClassListLoading ||
              assetClassListError ||
              classOptions.length === 0
            }
            className="uppercase"
          >
            <option value="">Select class</option>
            {classOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </SelectField>

          {assetClassItId && numberingOptions.length > 0 ? (
            <SelectField
              label="Asset Numbering Group"
              name="assetNumber"
              value={values.assetNumber}
              onChange={handleField('assetNumber')}
              className="uppercase"
              disabled={numberingLoading}
            >
              <option value="">
                {numberingLoading ? 'Loading…' : 'Select numbering'}
              </option>
              {numberingOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </SelectField>
          ) : (
            <InputField
              label="Asset Numbering Group"
              name="assetNumber"
              value={values.assetNumber}
              onChange={handleField('assetNumber')}
              placeholder={
                !assetClassItId
                  ? 'Select asset class first'
                  : numberingLoading
                    ? 'Loading numbering…'
                    : 'No numbering setup for this class'
              }
              disabled={!assetClassItId || numberingLoading}
              readOnly={!assetClassItId}
              error={
                numberingError
                  ? 'Could not load numbering setup (check asset-service is running with latest code).'
                  : (fieldErrors.numberingGroupId ?? fieldErrors.assetNumber)
              }
            />
          )}

          <div className="sm:col-span-1">
            <RadioGroup
              legend="Depreciable"
              name="depreciable"
              value={values.depreciable}
              onChange={handleField('depreciable')}
              options={DEPRECIABLE_OPTIONS}
              required
            />
            <FieldError message={fieldErrors.depreciable} />
          </div>
        </FieldGrid>

        {showDepreciationFields ? (
          <FieldGrid cols={3} className="mt-4">
            <InputField
              label="Depreciation Rate (IT)"
              name="depreciationRateIt"
              value={values.depreciationRateIt}
              onChange={handleField('depreciationRateIt')}
              required
              error={fieldErrors.depreciationRateIt}
            />

            <SelectField
              label="Depreciation Method"
              name="depreciationMethod"
              value={values.depreciationMethod}
              onChange={handleField('depreciationMethod')}
              required
              error={fieldErrors.depreciationMethod}
              className="uppercase"
            >
              {DEPRECIATION_METHOD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </SelectField>
          </FieldGrid>
        ) : null}

        {formError ? (
          <p className={`mt-2 ${MODULE_FORM_ERROR_BANNER_CLASS}`} role="alert">
            {formError}
          </p>
        ) : null}
      </FormProfileSection>

      {showFooter ? (
        <DomainFormFooter
          submitLabel={editingIdMask ? 'Update' : 'Save'}
          onCancel={onCancelEdit}
          showSubmit
        />
      ) : null}
    </form>
  )
}
