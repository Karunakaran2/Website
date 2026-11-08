import { Clock } from 'lucide-react'
import { FORM_FOOTER_CANCEL_CLASS, FORM_FOOTER_PRIMARY_CLASS } from '@/shared/components/buttons/actionButtonStyles'
import { GigwButton } from '@/shared/components/buttons/gigw'
import PortalModalShell from '@/shared/components/modals/PortalModalShell'
import { BodyText } from '@/shared/components/typography'
import { formatRemaining } from '../session/sessionPolicy'

export default function SessionTimeoutDialog({
  open,
  remainingMs,
  onContinue,
  onLogout,
  continuing = false,
}) {
  const remainingLabel = formatRemaining(remainingMs)

  return (
    <PortalModalShell
      isOpen={open}
      onClose={() => {}}
      title="Session Expiring"
      size="sm"
      showCloseButton={false}
      staticBackdrop
      closeOnEscape={false}
      stack="nested"
      footer={(
        <>
          <GigwButton
            type="button"
            variant="secondary"
            hideIcon
            className={FORM_FOOTER_CANCEL_CLASS}
            onClick={onLogout}
            disabled={continuing}
          >
            Logout
          </GigwButton>
          <GigwButton
            type="button"
            variant="primary"
            hideIcon
            className={FORM_FOOTER_PRIMARY_CLASS}
            onClick={onContinue}
            loading={continuing}
          >
            Continue Session
          </GigwButton>
        </>
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <span
            className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600"
            aria-hidden
          >
            <Clock size={18} strokeWidth={2} />
          </span>
          <div className="min-w-0 space-y-1 pt-0.5">
            <BodyText className="m-0">
              Your session is about to expire due to inactivity.
            </BodyText>
            <BodyText className="m-0 text-slate-600">
              Do you want to continue?
            </BodyText>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-3 py-[8px]">
          <BodyText as="span" medium className="m-0 text-slate-800">
            Time remaining
          </BodyText>
          <span
            className="min-w-[48px] text-right text-[14px] font-semibold leading-5 tabular-nums text-red-600"
            aria-label={`Time remaining ${remainingLabel}`}
          >
            {remainingLabel}
          </span>
        </div>
      </div>
    </PortalModalShell>
  )
}
