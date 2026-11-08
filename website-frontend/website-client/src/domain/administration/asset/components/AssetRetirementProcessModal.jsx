import { FormModal } from '@/shared/components'
import { PORTAL_MODAL_TITLE_CLASS } from '@/shared/components/modals/modalChrome'
import AssetRetirementProcessForm from './AssetRetirementProcessForm'

export default function AssetRetirementProcessModal({
  open,
  onClose,
  values,
  fieldErrors,
  formError,
  previewLoading,
  previewLines,
  previewState,
  retirementGroupOptions,
  customers,
  processing,
  onChange,
  onLoadPreview,
  onProcess,
  onPreviewLineChange,
  onPreviewSelectAllChange,
  onSalesNumberingChange,
}) {
  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Fixed Asset Retirement"
      titleClassName={PORTAL_MODAL_TITLE_CLASS}
      size="3xl"
      showFooter={false}
    >
      {open ? (
        <AssetRetirementProcessForm
          values={values}
          fieldErrors={fieldErrors}
          formError={formError}
          previewLoading={previewLoading}
          previewLines={previewLines}
          previewState={previewState}
          retirementGroupOptions={retirementGroupOptions}
          customers={customers}
          processing={processing}
          onChange={onChange}
          onLoadPreview={onLoadPreview}
          onProcess={onProcess}
          onPreviewLineChange={onPreviewLineChange}
          onPreviewSelectAllChange={onPreviewSelectAllChange}
          onSalesNumberingChange={onSalesNumberingChange}
          onCancel={onClose}
        />
      ) : null}
    </FormModal>
  )
}
