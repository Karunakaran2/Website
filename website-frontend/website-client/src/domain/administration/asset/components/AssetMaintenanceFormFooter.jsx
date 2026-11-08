import { GigwButton } from '@/shared/components/buttons/gigw'
import {
  FORM_FOOTER_CANCEL_CLASS,
  FORM_FOOTER_PRIMARY_CLASS,
} from '@/shared/components/buttons/actionButtonStyles'
import { MODULE_FORM_FOOTER_CLASS } from '@/shared/constants/moduleLayoutStyles'

/**
 * Asset Maintenance modal footer — Cancel, Delete, workflow actions, Save/Update.
 */
export default function AssetMaintenanceFormFooter({
  onCancel,
  onDelete,
  onSubmitWorkflow,
  onForward,
  onVerify,
  onApprove,
  showDelete = false,
  showSubmit = false,
  showForward = false,
  showVerify = false,
  showApprove = false,
  showUpdate = true,
  submitLabel = 'Save',
  submitLoading = false,
  workflowLoading = false,
  approveLoading = false,
  deleteLoading = false,
  footerCentered = true,
}) {
  const workflowBusy = workflowLoading || approveLoading || deleteLoading

  return (
    <div
      className={`${MODULE_FORM_FOOTER_CLASS} ${footerCentered ? 'justify-center sm:justify-center' : ''}`}
    >
      {onCancel ? (
        <GigwButton
          type="button"
          variant="secondary"
          className={FORM_FOOTER_CANCEL_CLASS}
          onClick={onCancel}
          disabled={workflowBusy || submitLoading}
        >
          Cancel
        </GigwButton>
      ) : null}
      {showDelete && onDelete ? (
        <GigwButton
          type="button"
          variant="danger"
          className={FORM_FOOTER_PRIMARY_CLASS}
          loading={deleteLoading}
          disabled={deleteLoading || submitLoading || workflowBusy}
          onClick={onDelete}
        >
          Delete
        </GigwButton>
      ) : null}
      {showSubmit && onSubmitWorkflow ? (
        <GigwButton
          type="button"
          variant="secondary"
          className={FORM_FOOTER_PRIMARY_CLASS}
          loading={workflowLoading}
          disabled={workflowBusy || submitLoading}
          onClick={onSubmitWorkflow}
        >
          Submit
        </GigwButton>
      ) : null}
      {showForward && onForward ? (
        <GigwButton
          type="button"
          variant="secondary"
          className={FORM_FOOTER_PRIMARY_CLASS}
          loading={workflowLoading}
          disabled={workflowBusy || submitLoading}
          onClick={onForward}
        >
          Forward
        </GigwButton>
      ) : null}
      {showVerify && onVerify ? (
        <GigwButton
          type="button"
          variant="secondary"
          className={FORM_FOOTER_PRIMARY_CLASS}
          loading={workflowLoading}
          disabled={workflowBusy || submitLoading}
          onClick={onVerify}
        >
          Verify
        </GigwButton>
      ) : null}
      {showApprove && onApprove ? (
        <GigwButton
          type="button"
          variant="success"
          className={FORM_FOOTER_PRIMARY_CLASS}
          loading={approveLoading}
          disabled={workflowBusy || submitLoading}
          onClick={onApprove}
        >
          Approve
        </GigwButton>
      ) : null}
      {showUpdate ? (
        <GigwButton
          type="submit"
          variant="primary"
          className={FORM_FOOTER_PRIMARY_CLASS}
          loading={submitLoading}
          disabled={submitLoading || workflowBusy}
        >
          {submitLabel}
        </GigwButton>
      ) : null}
    </div>
  )
}
