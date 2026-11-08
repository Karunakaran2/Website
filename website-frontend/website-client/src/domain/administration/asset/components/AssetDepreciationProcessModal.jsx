import { FormModal } from '@/shared/components'
import { PORTAL_MODAL_TITLE_CLASS } from '@/shared/components/modals/modalChrome'
import AssetDepreciationProcessForm from './AssetDepreciationProcessForm'

export default function AssetDepreciationProcessModal({
  open,
  onClose,
  values,
  fieldErrors,
  formError,
  previewLoading,
  previewLines,
  previewTotal,
  approving,
  onChange,
  onLoadPreview,
  onApprove,
}) {
  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Fixed Asset Depreciation"
      titleClassName={PORTAL_MODAL_TITLE_CLASS}
      size="5xl"
      showFooter={false}
    >
      {open ? (
        <AssetDepreciationProcessForm
          values={values}
          fieldErrors={fieldErrors}
          formError={formError}
          previewLoading={previewLoading}
          previewLines={previewLines}
          previewTotal={previewTotal}
          approving={approving}
          onChange={onChange}
          onLoadPreview={onLoadPreview}
          onApprove={onApprove}
          onCancel={onClose}
        />
      ) : null}
    </FormModal>
  )
}
