import { FormModal } from '@/shared/components'
import { PORTAL_MODAL_TITLE_CLASS } from '@/shared/components/modals/modalChrome'
import AssetEditFormSkeleton from './AssetModalSkeleton'
import AssetMaintenanceForm from './AssetMaintenanceForm'

export default function AssetMaintenanceFormModal({
  open,
  mode = 'create',
  values,
  fieldErrors,
  formError,
  saving,
  loading = false,
  approving = false,
  workflowLoading = false,
  assetOptions,
  purchaseInvoiceOptions,
  onChange,
  onSave,
  onDelete,
  onSubmitWorkflow,
  onForward,
  onVerify,
  onApprove,
  deleting = false,
  onClose,
}) {
  const isEdit = mode === 'edit' || Boolean(values?.idMask)
  const title = isEdit ? 'Edit Asset Maintenance' : 'Add Asset Maintenance'

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title={title}
      titleClassName={PORTAL_MODAL_TITLE_CLASS}
      size="3xl"
      showFooter={false}
    >
      {open && loading ? (
        <AssetEditFormSkeleton
          sections={[{ fields: 9, cols: 3 }]}
          loadingMessage="Loading maintenance details…"
        />
      ) : null}
      {open && !loading ? (
        <AssetMaintenanceForm
          values={values}
          fieldErrors={fieldErrors}
          formError={formError}
          saving={saving}
          approving={approving}
          assetOptions={assetOptions}
          purchaseInvoiceOptions={purchaseInvoiceOptions}
          onChange={onChange}
          onSubmit={onSave}
          onCancel={onClose}
          onDelete={isEdit ? onDelete : undefined}
          onSubmitWorkflow={isEdit ? onSubmitWorkflow : undefined}
          onForward={isEdit ? onForward : undefined}
          onVerify={isEdit ? onVerify : undefined}
          onApprove={isEdit ? onApprove : undefined}
          workflowLoading={workflowLoading}
          deleteLoading={deleting}
          submitLabel={isEdit ? 'Update' : 'Save'}
          showCancel
          footerCentered={false}
          isEdit={isEdit}
        />
      ) : null}
    </FormModal>
  )
}
