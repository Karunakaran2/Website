import { useEffect } from 'react'
import { Building2 } from 'lucide-react'
import { FieldGrid, IndianAmountField, InputField, SelectField } from '@/shared/components/forms'
import FormProfileSection from '@/shared/components/forms/FormProfileSection'
import { MODULE_FORM_ERROR_BANNER_CLASS } from '@/shared/constants/moduleLayoutStyles'
import { bodyTextClass } from '@/shared/components/typography/typographyStyles'
import AssetInformationFormFooter from './AssetInformationFormFooter'
import AssetInformationWorkflowSteps from './AssetInformationWorkflowSteps'
import {
  useGetFixedAssetGroupListQuery,
  useListAssetInformationCustodiansQuery,
  useListCostCentresQuery,
  useListHsnCodesQuery,
} from '../services/assetApi'
import AssetFaGroupSummaryPanel from './AssetFaGroupSummaryPanel'
import AssetInformationDocumentTable from './AssetInformationDocumentTable'
export default function AssetInformationCapitalisationForm({
  formId = 'asset-information-form',
  values,
  fieldErrors = {},
  formError,
  isEditing,
  readOnly = false,
  showSubmit = false,
  showForward = false,
  showVerify = false,
  showApprove = false,
  showUpdate = true,
  onSubmitWorkflow,
  onForward,
  onVerify,
  onApprove,
  submitLoading = false,
  workflowLoading = false,
  approveLoading = false,
  onChange,
  onSubmit,
  onCancelEdit,
}) {
  const { data: faGroupOptions = [] } = useGetFixedAssetGroupListQuery()
  const {
    data: costCenterOptions = [],
    isError: costCenterError,
    isFetching: costCenterLoading,
  } = useListCostCentresQuery()
  const {
    data: custodianOptions = [],
    isError: custodianError,
    isFetching: custodianLoading,
  } = useListAssetInformationCustodiansQuery()
  const { data: hsnCodeOptions = [] } = useListHsnCodesQuery()

  const handleField =
    (field) =>
    (event) => {
      const next = event?.target?.value ?? event
      onChange(field, next)
    }

  const handleDocumentsChange = (documents) => {
    onChange('documents', documents)
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    onChange('attachmentFile', file ?? null)
    onChange('attachmentFileName', file?.name ?? '')
  }

  useEffect(() => {
    if (custodianLoading || custodianOptions.length === 0) {
      return
    }
    const current = String(values.custodianId ?? '')
    if (current && !custodianOptions.some((opt) => opt.value === current)) {
      onChange('custodianId', '')
    }
  }, [custodianLoading, custodianOptions, onChange, values.custodianId])

  useEffect(() => {
    if (costCenterLoading || costCenterOptions.length === 0) {
      return
    }
    const current = String(values.costCenterId ?? '')
    if (current && !costCenterOptions.some((opt) => opt.value === current)) {
      onChange('costCenterId', '')
    }
  }, [costCenterLoading, costCenterOptions, onChange, values.costCenterId])

  const handleFaGroupChange = (event) => {
    const idMask = event.target.value
    onChange('faGroupIdMask', idMask)
    const selected = faGroupOptions.find((opt) => opt.idMask === idMask)
    onChange('assetTypeLabel', selected?.assetType ?? selected?.label ?? '')
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
      {isEditing ? <AssetInformationWorkflowSteps status={values.status} /> : null}
      {isEditing && values.workflowRecipientName ? (
        <p className={`${bodyTextClass} rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700`}>
          Sent to: <span className="font-semibold text-slate-900">{values.workflowRecipientName}</span>
          {' '}
          (they verify in Asset Information Approval → Received)
        </p>
      ) : null}
      {isEditing
      && String(values.status ?? '').toUpperCase() === 'S'
      && !values.workflowRecipientName ? (
        <p className={`${bodyTextClass} rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900`}>
          Forward to a user after Submit so they can verify. You cannot verify your own submission until
          it is assigned to a recipient.
        </p>
      ) : null}
      <fieldset disabled={readOnly} className="contents min-w-0 border-0 p-0 m-0">
      <FormProfileSection icon={Building2} title="Fixed Asset Capitalisation">
        <FieldGrid cols={3}>
          <InputField
            label="Asset Id"
            name="assetId"
            value={values.assetId}
            placeholder="Auto on save"
            readOnly
            disabled
          />
          <InputField
            label="Asset Description"
            name="assetDescription"
            value={values.assetDescription}
            onChange={handleField('assetDescription')}
            placeholder="Asset information"
            required
            error={fieldErrors.assetDescription}
          />
          <SelectField
            label="Asset Type"
            name="faGroupIdMask"
            value={values.faGroupIdMask}
            onChange={handleFaGroupChange}
            required
            error={fieldErrors.faGroupIdMask}
            className="uppercase"
          >
            <option value="">Select asset type</option>
            {faGroupOptions.map((opt) => (
              <option key={opt.idMask} value={opt.idMask}>
                {opt.label}
              </option>
            ))}
          </SelectField>
        </FieldGrid>

        {values.faGroupIdMask ? (
          <AssetFaGroupSummaryPanel faGroupIdMask={values.faGroupIdMask} />
        ) : null}

        <FieldGrid cols={3} className="mt-4">
          <InputField
            label="Capitalisation Date"
            name="capitalisationDate"
            type="date"
            value={values.capitalisationDate}
            onChange={handleField('capitalisationDate')}
            required
            error={fieldErrors.capitalisationDate}
          />
          <InputField
            label="Put to Use Date"
            name="putToUseDate"
            type="date"
            value={values.putToUseDate}
            onChange={handleField('putToUseDate')}
            required
            error={fieldErrors.putToUseDate}
          />
          <SelectField
            label="HSN Code"
            name="hsnCodeId"
            value={values.hsnCodeId}
            onChange={handleField('hsnCodeId')}
            error={fieldErrors.hsnCodeId}
          >
            <option value="">Select HSN code</option>
            {hsnCodeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Cost Center"
            name="costCenterId"
            value={values.costCenterId}
            onChange={handleField('costCenterId')}
            required
            error={
              fieldErrors.costCenterId ||
              (costCenterError
                ? 'Unable to load cost centers.'
                : !costCenterLoading && costCenterOptions.length === 0
                  ? 'No cost centers found.'
                  : undefined)
            }
            disabled={costCenterLoading}
          >
            <option value="">Select cost center</option>
            {costCenterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </SelectField>
          <InputField
            label="Asset Qty"
            name="assetQty"
            value={values.assetQty}
            onChange={handleField('assetQty')}
            required
            error={fieldErrors.assetQty}
          />
          <IndianAmountField
            label="Asset Cost"
            name="assetCost"
            value={values.assetCost}
            onChange={handleField('assetCost')}
            placeholder="0.00"
            required
            error={fieldErrors.assetCost}
          />
          <InputField
            label="Serial Number"
            name="serialNumber"
            value={values.serialNumber}
            onChange={handleField('serialNumber')}
            placeholder="Serial number"
          />
          <SelectField
            label="New Custodian"
            name="custodianId"
            value={values.custodianId}
            onChange={handleField('custodianId')}
            required
            error={
              fieldErrors.custodianId ||
              (custodianError
                ? 'Unable to load custodians from user allocation.'
                : undefined)
            }
            disabled={custodianLoading}
          >
            <option value="">Select custodian</option>
            {custodianOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </SelectField>
          <InputField
            label="Barcode"
            name="barcode"
            value={values.barcode}
            onChange={handleField('barcode')}
            placeholder="Barcode"
          />
          <InputField
            label="Location"
            name="location"
            value={values.location}
            onChange={handleField('location')}
            placeholder="Location"
          />
          <div className="sm:col-span-1">
            <label className="text-xs font-semibold capitalize tracking-wide text-slate-500 dark:text-slate-400">
              Upload file
            </label>
            <input
              type="file"
              className="input-field mt-1 w-full text-sm"
              onChange={handleFileChange}
            />
            {values.attachmentFileName ? (
              <p className="mt-1 text-xs text-slate-600">{values.attachmentFileName}</p>
            ) : null}
          </div>
        </FieldGrid>

        <AssetInformationDocumentTable
          lines={values.documents ?? []}
          onChange={handleDocumentsChange}
        />

      </FormProfileSection>
      </fieldset>

      {formError ? (
        <p className={MODULE_FORM_ERROR_BANNER_CLASS} role="alert">
          {formError}
        </p>
      ) : null}

      <AssetInformationFormFooter
        onCancel={onCancelEdit}
        onSubmitWorkflow={onSubmitWorkflow}
        onForward={onForward}
        onVerify={onVerify}
        onApprove={onApprove}
        showSubmit={showSubmit}
        showForward={showForward}
        showVerify={showVerify}
        showApprove={showApprove}
        showUpdate={showUpdate && !readOnly}
        submitLabel={isEditing ? 'Update' : 'Save'}
        submitLoading={submitLoading}
        workflowLoading={workflowLoading}
        approveLoading={approveLoading}
      />
    </form>
  )
}
