import { CheckCircle2, Loader2 } from 'lucide-react'
import { FORM_FOOTER_CANCEL_CLASS, FORM_FOOTER_PRIMARY_CLASS } from '@/shared/components/buttons/actionButtonStyles'
import { GigwButton } from '@/shared/components/buttons/gigw'
import { Caption } from '@/shared/components/typography'
import PortalModalShell from './PortalModalShell'

/** Maps ConfirmDialog `tone` to GIGW button variant (match domain footer / row action colors). */
const CONFIRM_GIGW_VARIANT = {
  primary: 'primary',
  danger: 'danger',
  delete: 'danger',
  save: 'primary',
  update: 'primary',
  /** Voucher + setup workflow submit — navy (same as {@link VoucherFooterSubmitButton}). */
  submit: 'primary',
  /** Final approval — green (same as {@link VoucherFooterApproveButton}). */
  approve: 'success',
  /** Verification step — outline green (same as {@link VoucherFooterVerifyButton}). */
  verify: 'outlineSuccess',
  activate: 'success',
  deactivate: 'danger',
  draft: 'outlineUtility',
}

/**
 * Save / update / action confirmation — SEEPZ base modal shell, compact width.
 */
export default function ConfirmDialog({
  open,
  title = 'Confirm',
  message,
  description,
  confirmLabel = 'Yes',
  cancelLabel = 'No',
  onConfirm,
  onCancel,
  loading = false,
  /** `working` — spinner + progress; `done` — brief success before close */
  phase = 'idle',
  loadingLabel = 'Please wait…',
  tone = 'primary',
  stack = 'base',
}) {
  const confirmVariant = CONFIRM_GIGW_VARIANT[tone] ?? CONFIRM_GIGW_VARIANT.primary
  const isBusy = loading || phase === 'working' || phase === 'done'
  const showWorking = phase === 'working'
  const showDone = phase === 'done'

  const handleClose = () => {
    if (isBusy) {
      return
    }
    onCancel?.()
  }

  return (
    <PortalModalShell
      isOpen={open}
      onClose={handleClose}
      title={title}
      size="sm"
      stack={stack}
      bodyClassName="!max-h-none"
      showCloseButton={!isBusy}
      staticBackdrop={false}
      footerLayout="end"
      footer={showWorking || showDone ? null : (
        <>
          <GigwButton
            type="button"
            variant="secondary"
            hideIcon
            onClick={handleClose}
            disabled={isBusy}
            className={FORM_FOOTER_CANCEL_CLASS}
          >
            {cancelLabel}
          </GigwButton>
          <GigwButton
            key={`confirm-${tone}-${confirmLabel}`}
            type="button"
            variant={confirmVariant}
            hideIcon
            onClick={onConfirm}
            loading={loading}
            disabled={isBusy}
            className={FORM_FOOTER_PRIMARY_CLASS}
          >
            {confirmLabel}
          </GigwButton>
        </>
      )}
    >
      <div
        className="relative min-h-[4.5rem] overflow-hidden transition-all duration-300 ease-out"
        aria-live="polite"
        aria-busy={showWorking}
      >
        <div
          className={`min-w-0 space-y-1 transition-all duration-300 ease-out ${
            showWorking || showDone
              ? 'pointer-events-none translate-y-2 opacity-0'
              : 'translate-y-0 opacity-100'
          }`}
        >
          {message ? (
            <p className="m-0 text-sm font-semibold text-slate-800 dark:text-slate-100">{message}</p>
          ) : null}
          {description ? (
            <Caption className="mt-0 leading-relaxed">{description}</Caption>
          ) : null}
        </div>

        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-3 transition-all duration-300 ease-out ${
            showWorking
              ? 'translate-y-0 opacity-100'
              : '-translate-y-2 opacity-0'
          }`}
        >
          <Loader2
            className="size-9 animate-spin text-[#01458e]"
            strokeWidth={2}
            aria-hidden
          />
          <p className="m-0 text-sm font-medium text-slate-700 dark:text-slate-200">{loadingLabel}</p>
          <div className="relative h-1 w-full max-w-[220px] overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div className="absolute h-full w-1/3 animate-pulse-loader rounded-full bg-[#01458e]" />
          </div>
        </div>

        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-2 transition-all duration-300 ease-out ${
            showDone
              ? 'translate-y-0 opacity-100'
              : 'translate-y-2 opacity-0'
          }`}
        >
          <CheckCircle2 className="size-10 text-emerald-600" strokeWidth={2} aria-hidden />
          <p className="m-0 text-sm font-medium text-slate-700 dark:text-slate-200">Done</p>
        </div>
      </div>
    </PortalModalShell>
  )
}
