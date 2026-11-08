import { useEffect } from 'react'
import { FieldGrid, IndianAmountField, InputField, SelectField } from '@/shared/components/forms'
import { MODULE_FORM_ERROR_BANNER_CLASS } from '@/shared/constants/moduleLayoutStyles'
import { isMaintenanceApproved } from '../constants/assetMaintenance'
import { useLazyGetSuggestedNextDueDateForAssetQuery } from '../services/assetApi'
import { resolveAssetMaintenanceFormFooterActions } from '../utils/assetMaintenanceFormFooterActions'
import AssetMaintenanceFormFooter from './AssetMaintenanceFormFooter'
import AssetMaintenancePurchaseJournalTable from './AssetMaintenancePurchaseJournalTable'

export default function AssetMaintenanceForm({
  values,
  fieldErrors = {},
  formError,
  saving,
  approving = false,
  assetOptions = [],
  purchaseInvoiceOptions = [],
  onChange,
  onSubmit,
  onCancel,
  onDelete,
  onSubmitWorkflow,
  onForward,
  onVerify,
  onApprove,
  workflowLoading = false,
  submitLabel = 'Save',
  deleteLoading = false,
  showCancel = false,
  footerCentered = true,
  isEdit = false,
}) {
  const isFinallyApproved = isMaintenanceApproved(values.approve)
  const footerActions = resolveAssetMaintenanceFormFooterActions({
    workflowStatus: values.workflowStatus,
    hasId: Boolean(values.idMask),
    canSubmit: values.canSubmit,
    canForward: values.canForward,
    canVerify: values.canVerify,
    canApprove: values.canApprove,
    isFinallyApproved,
  })
  const readOnly = isEdit && (isFinallyApproved || footerActions.readOnlyForm)
  const [fetchSuggestedNextDue] = useLazyGetSuggestedNextDueDateForAssetQuery()

  useEffect(() => {
    if (readOnly || !values.assetInformationIdMask || String(values.nextDueDateStr ?? '').trim()) {
      return undefined
    }
    const suggestArg = {
      assetInformationIdMask: values.assetInformationIdMask,
      ...(values.idMask ? { excludeMaintenanceIdMask: values.idMask } : {}),
    }
    let cancelled = false
    fetchSuggestedNextDue(suggestArg)
      .unwrap()
      .then((payload) => {
        if (!cancelled && payload?.nextDueDate) {
          onChange('nextDueDateStr', payload.nextDueDate)
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [
    fetchSuggestedNextDue,
    onChange,
    readOnly,
    values.assetInformationIdMask,
    values.idMask,
    values.nextDueDateStr,
  ])

  const handleField =
    (field) =>
    (event) => {
      onChange(field, event?.target?.value ?? event)
    }

  const handleAssetChange = (event) => {
    const idMask = event.target.value
    onChange('assetInformationIdMask', idMask)
    onChange('purchaseInvoiceIdMask', '')
    onChange('vendorIdMask', '')
    onChange('vendorName', '')
    onChange('nextDueDateStr', '')
    const asset = assetOptions.find((opt) => opt.idMask === idMask)
    onChange('assetDescription', asset?.assetDescription ?? '')
    if (!idMask || readOnly) {
      return
    }
    fetchSuggestedNextDue({ assetInformationIdMask: idMask })
      .unwrap()
      .then((payload) => {
        const suggested = payload?.nextDueDate ?? ''
        if (suggested) {
          onChange('nextDueDateStr', suggested)
        }
      })
      .catch(() => {})
  }

  const handlePurchaseInvoiceChange = (event) => {
    const idMask = event.target.value
    onChange('purchaseInvoiceIdMask', idMask)
    const invoice = purchaseInvoiceOptions.find((opt) => opt.idMask === idMask)
    if (invoice?.vendorIdMask) {
      onChange('vendorIdMask', invoice.vendorIdMask)
      onChange('vendorName', invoice.vendorName ?? '')
    } else {
      onChange('vendorIdMask', '')
      onChange('vendorName', '')
    }
  }

  return (
    <form
      className="flex min-w-0 flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
      noValidate
    >
      {formError ? (
        <p className={MODULE_FORM_ERROR_BANNER_CLASS} role="alert">
          {formError}
        </p>
      ) : null}

      <fieldset disabled={readOnly} className="flex min-w-0 flex-col gap-4 border-0 p-0 m-0">
        <FieldGrid cols={3}>
          <SelectField
            label="Asset Id"
            name="assetInformationIdMask"
            value={values.assetInformationIdMask}
            onChange={handleAssetChange}
            required
            error={fieldErrors.assetInformationIdMask}
          >
            <option value="">-Select Asset Id-</option>
            {assetOptions.map((opt) => (
              <option key={opt.idMask} value={opt.idMask}>
                {opt.label}
              </option>
            ))}
          </SelectField>
          <InputField
            label="Maintenance Date"
            name="maintenanceDateStr"
            type="date"
            value={values.maintenanceDateStr}
            onChange={handleField('maintenanceDateStr')}
            required
            error={fieldErrors.maintenanceDateStr}
          />
          <SelectField
            label="Purchase Invoice"
            name="purchaseInvoiceIdMask"
            value={values.purchaseInvoiceIdMask}
            onChange={handlePurchaseInvoiceChange}
            required
            error={fieldErrors.purchaseInvoiceIdMask}
          >
            <option value="">-Select Invoice-</option>
            {purchaseInvoiceOptions.map((opt) => (
              <option key={opt.idMask} value={opt.idMask}>
                {opt.label}
              </option>
            ))}
          </SelectField>
          <InputField
            label="Asset Description"
            name="assetDescription"
            value={values.assetDescription}
            readOnly
            placeholder="Select an asset"
          />
          <InputField
            label="Vendor Name"
            name="vendorName"
            value={values.vendorName}
            readOnly
            placeholder="Select a purchase invoice"
            error={fieldErrors.vendorIdMask}
          />
          <IndianAmountField
            label="Cost"
            name="cost"
            value={values.cost}
            onChange={handleField('cost')}
            required
            error={fieldErrors.cost}
          />
          <InputField
            label="Next Due Date"
            name="nextDueDateStr"
            type="date"
            value={values.nextDueDateStr}
            onChange={handleField('nextDueDateStr')}
          />
          <InputField
            label="Maintenance Description"
            name="maintenanceDescription"
            value={values.maintenanceDescription}
            onChange={handleField('maintenanceDescription')}
            placeholder="Describe the maintenance work"
            required
            error={fieldErrors.maintenanceDescription}
            className="col-span-full sm:col-span-2"
          />
        </FieldGrid>

        <AssetMaintenancePurchaseJournalTable
          purchaseInvoiceIdMask={values.purchaseInvoiceIdMask}
        />
      </fieldset>

      <AssetMaintenanceFormFooter
        onCancel={showCancel ? onCancel : undefined}
        onDelete={footerActions.showUpdate && onDelete ? onDelete : undefined}
        showDelete={isEdit && !isFinallyApproved && Boolean(onDelete)}
        onSubmitWorkflow={onSubmitWorkflow}
        onForward={onForward}
        onVerify={onVerify}
        onApprove={onApprove}
        showSubmit={footerActions.showSubmit}
        showForward={footerActions.showForward}
        showVerify={footerActions.showVerify}
        showApprove={footerActions.showApprove}
        showUpdate={(footerActions.showUpdate || footerActions.showDraftSave) && !readOnly}
        submitLabel={submitLabel}
        submitLoading={saving}
        workflowLoading={workflowLoading}
        approveLoading={approving}
        deleteLoading={deleteLoading}
        footerCentered={footerCentered}
      />
    </form>
  )
}
