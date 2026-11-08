import { CancelButton, PrimaryButton } from '@/shared/components/buttons'
import { FORM_FOOTER_CANCEL_CLASS, FORM_FOOTER_PRIMARY_CLASS } from '@/shared/components/buttons/actionButtonStyles'

export function PortalModalCancelButton({
  onClick,
  disabled = false,
  type = 'button',
  children,
  /** Alias for `children` (legacy modals pass `label=`). */
  label,
  className = '',
}) {
  const text = children ?? label ?? 'Cancel'

  return (
    <CancelButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      hideIcon
      className={`${FORM_FOOTER_CANCEL_CLASS} ${className}`.trim()}
    >
      {text}
    </CancelButton>
  )
}

export function PortalModalPrimaryButton({
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
  children,
  /** Alias for `children` (legacy modals pass `label=`). */
  label,
  className = '',
  form,
}) {
  const text = children ?? label ?? 'Save'

  return (
    <PrimaryButton
      type={type}
      form={form}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
      className={`${FORM_FOOTER_PRIMARY_CLASS} ${className}`.trim()}
    >
      {text}
    </PrimaryButton>
  )
}
