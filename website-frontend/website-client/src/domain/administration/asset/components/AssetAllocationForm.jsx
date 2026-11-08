import { FieldGrid, InputField, SelectField } from '@/shared/components/forms'
import { MODULE_FORM_ERROR_BANNER_CLASS } from '@/shared/constants/moduleLayoutStyles'
import { GigwButton } from '@/shared/components/buttons/gigw'
import { MODULE_FORM_FOOTER_CLASS } from '@/shared/constants/moduleLayoutStyles'
import AssetAllocationAssetSummary from './AssetAllocationAssetSummary'

export default function AssetAllocationForm({
  values,
  fieldErrors = {},
  formError,
  assetOptions = [],
  custodianOptions = [],
  allocating,
  returning,
  onChange,
  onAllocate,
  onReturnToStore,
  onOpenHistory,
  historyDisabled,
}) {
  const handleField =
    (field) =>
    (event) => {
      onChange(field, event?.target?.value ?? event)
    }

  const handleAssetChange = (event) => {
    onChange('assetInformationIdMask', event.target.value)
  }

  const handleCustodianChange = (event) => {
    onChange('custodianIdMask', event.target.value)
  }

  return (
    <form className="flex min-w-0 flex-col gap-4" noValidate>
      {formError ? (
        <p className={MODULE_FORM_ERROR_BANNER_CLASS} role="alert">
          {formError}
        </p>
      ) : null}

      <FieldGrid cols={3}>
        <SelectField
          label="Asset Id"
          name="assetInformationIdMask"
          value={values.assetInformationIdMask}
          onChange={handleAssetChange}
          required
          error={fieldErrors.assetInformationIdMask}
        >
          <option value="">Select asset id</option>
          {assetOptions.map((opt) => (
            <option key={opt.idMask} value={opt.idMask}>
              {opt.label}
            </option>
          ))}
        </SelectField>
        <InputField
          label="New Location"
          name="newLocation"
          value={values.newLocation}
          onChange={handleField('newLocation')}
          placeholder="New Location"
        />
        <SelectField
          label="New Custodian"
          name="custodianIdMask"
          value={values.custodianIdMask ?? ''}
          onChange={handleCustodianChange}
          required
          error={fieldErrors.custodianIdMask}
        >
          <option value="">Select custodian</option>
          {custodianOptions.map((opt) => (
            <option key={`custodian-${opt.idMask}`} value={opt.idMask}>
              {opt.label}
            </option>
          ))}
        </SelectField>
        <InputField
          label="Allocation Date"
          name="allocationDateStr"
          type="date"
          value={values.allocationDateStr}
          onChange={handleField('allocationDateStr')}
          required
          error={fieldErrors.allocationDateStr}
        />
        <InputField
          label="Comments"
          name="comments"
          value={values.comments}
          onChange={handleField('comments')}
          placeholder="Comments"
        />
      </FieldGrid>

      <AssetAllocationAssetSummary assetInformationIdMask={values.assetInformationIdMask} />

      {onOpenHistory ? (
        <GigwButton
          type="button"
          variant="outlineUtility"
          onClick={onOpenHistory}
          disabled={historyDisabled}
        >
          Allocation history
        </GigwButton>
      ) : null}

      <div className={MODULE_FORM_FOOTER_CLASS}>
        <GigwButton
          type="button"
          variant="primary"
          loading={allocating}
          disabled={allocating || returning}
          onClick={onAllocate}
        >
          Allocate
        </GigwButton>
        <GigwButton
          type="button"
          variant="primary"
          loading={returning}
          disabled={allocating || returning}
          onClick={onReturnToStore}
        >
          Return to Store
        </GigwButton>
      </div>
    </form>
  )
}
