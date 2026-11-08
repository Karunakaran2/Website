import { GigwButton } from '@/shared/components/buttons/gigw'
import { FORM_FOOTER_CANCEL_CLASS, FORM_FOOTER_PRIMARY_CLASS } from '@/shared/components/buttons/actionButtonStyles'
import {
  MODAL_FORM_FOOTER_CLASS,
  MODULE_FORM_FOOTER_CLASS,
} from '@/shared/constants/moduleLayoutStyles'

/**
 * Modal form footer — GIGW Cancel + primary submit.
 * Wire save through validation first, then `confirmBeforeAction` / `confirmVoucherAction` `validate` (probity-ui-instructions §3.9).
 */
export default function DomainFormFooter({
  useResetFooter = false,
  onReset,
  onCancel,
  hideSecondary = false,
  submitLabel = 'Save',
  submitLoading = false,
  showSubmit = true,
  /** Associates submit with a form when footer is rendered outside `<form>` (modal shell). */
  form,
  /**
   * `portal` — buttons only; pair with `FormModal` / `PortalModalShell` footer (shell draws top border).
   * `modal` — button row in modal body (no top border). `page` — card body (default, with top border).
   */
  layout = 'page',
  footerClassName,
}) {
  if (!showSubmit && hideSecondary) {
    return null
  }

  const buttons = (
    <>
      {!hideSecondary && useResetFooter && onReset ? (
        <GigwButton
          type="button"
          variant="outlineUtility"
          className={FORM_FOOTER_CANCEL_CLASS}
          onClick={onReset}
        >
          Reset
        </GigwButton>
      ) : null}
      {!hideSecondary && !useResetFooter && onCancel ? (
        <GigwButton
          type="button"
          variant="secondary"
          className={FORM_FOOTER_CANCEL_CLASS}
          onClick={onCancel}
        >
          Cancel
        </GigwButton>
      ) : null}
      {showSubmit ? (
        <GigwButton
          type="submit"
          form={form}
          variant="primary"
          className={FORM_FOOTER_PRIMARY_CLASS}
          loading={submitLoading}
          disabled={submitLoading}
        >
          {submitLabel}
        </GigwButton>
      ) : null}
    </>
  )

  if (layout === 'portal') {
    return buttons
  }

  const shellClass =
    footerClassName
    ?? (layout === 'modal' ? MODAL_FORM_FOOTER_CLASS : MODULE_FORM_FOOTER_CLASS)

  return <div className={shellClass}>{buttons}</div>
}
