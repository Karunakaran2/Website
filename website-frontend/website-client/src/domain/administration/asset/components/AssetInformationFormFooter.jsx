import { GigwButton } from '@/shared/components/buttons/gigw'
import {
  FORM_FOOTER_CANCEL_CLASS,
  FORM_FOOTER_PRIMARY_CLASS,
} from '@/shared/components/buttons/actionButtonStyles'
import { MODULE_FORM_FOOTER_CLASS } from '@/shared/constants/moduleLayoutStyles'

/**
 * Asset Information modal footer — Cancel, workflow actions, Save/Update (accounting voucher order).
 */
export default function AssetInformationFormFooter({
  onCancel,
  onSubmitWorkflow,
  onForward,
  onVerify,
  onApprove,
  showSubmit = false,
  showForward = false,
  showVerify = false,
  showApprove = false,
  showUpdate = true,
  submitLabel = 'Save',
  submitLoading = false,
  workflowLoading = false,
  approveLoading = false,
}) {
  const workflowBusy = workflowLoading || approveLoading

  return (
    <div className={MODULE_FORM_FOOTER_CLASS}>
      {onCancel ? (
        <GigwButton
          type="button"
          variant="secondary"
          className={FORM_FOOTER_CANCEL_CLASS}
          onClick={onCancel}
        >
          Cancel
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
          data-testid="asset-information-approve"
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
