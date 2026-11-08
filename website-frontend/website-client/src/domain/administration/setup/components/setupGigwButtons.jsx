import { GigwButton, GigwFormIconRowActions } from '@/shared/components/buttons/gigw'
import { FORM_FOOTER_CANCEL_CLASS, FORM_FOOTER_PRIMARY_CLASS } from '@/shared/components/buttons/actionButtonStyles'

/** Nested setup modals — GIGW Cancel / Save. */
export function SetupModalCancelButton({
  onClick,
  disabled = false,
  type = 'button',
  children = 'Cancel',
  className = '',
}) {
  return (
    <GigwButton
      type={type}
      variant="secondary"
      hideIcon
      onClick={onClick}
      disabled={disabled}
      className={`${FORM_FOOTER_CANCEL_CLASS} ${className}`.trim()}
    >
      {children}
    </GigwButton>
  )
}

export function SetupModalPrimaryButton({
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
  children,
  className = '',
  form,
}) {
  return (
    <GigwButton
      type={type}
      form={form}
      variant="primary"
      hideIcon
      loading={loading}
      onClick={onClick}
      disabled={disabled}
      className={`${FORM_FOOTER_PRIMARY_CLASS} ${className}`.trim()}
    >
      {children}
    </GigwButton>
  )
}

/** Setup alias — icon row actions (same as {@link GigwFormIconRowActions}). */
export function SetupFormRowActions({
  canRemove = true,
  onRemove,
  onAdd,
  addLabel = 'Add row',
  removeLabel = 'Remove',
  disabled = false,
  className = 'mt-3 flex justify-end gap-1',
  showRemove = true,
}) {
  return (
    <GigwFormIconRowActions
      canRemove={canRemove}
      showRemove={showRemove}
      showAdd={Boolean(onAdd)}
      onRemove={onRemove}
      onAdd={onAdd}
      removeLabel={removeLabel}
      addLabel={addLabel}
      disabled={disabled}
      className={className}
    />
  )
}

/** Setup alias — {@link GigwFormIconRowActions}. */
export function SetupFormIconRowActions(props) {
  return <GigwFormIconRowActions {...props} />
}

/** Field helper / table name link — GIGW tertiary link. */
export function SetupLinkButton({ children, className = '', ...props }) {
  return (
    <GigwButton
      type="button"
      variant="tertiary"
      hideIcon
      className={`mt-1 h-auto min-h-0 px-0 py-0 underline ${className}`.trim()}
      {...props}
    >
      {children}
    </GigwButton>
  )
}
