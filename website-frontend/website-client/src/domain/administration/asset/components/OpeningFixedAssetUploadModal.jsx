import { FormModal } from '@/shared/components'
import OpeningFixedAssetUploadPanel from './OpeningFixedAssetUploadPanel'

export default function OpeningFixedAssetUploadModal({
  open,
  onClose,
  uploading = false,
  uploadError = '',
  onUpload,
  formKey = 0,
}) {
  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="Opening Fixed Asset"
      size="lg"
      showFooter={false}
    >
      <OpeningFixedAssetUploadPanel
        key={formKey}
        inputId={`opening-fixed-asset-excel-${formKey}`}
        uploading={uploading}
        uploadError={uploadError}
        onUpload={onUpload}
        onCancel={onClose}
      />
    </FormModal>
  )
}
