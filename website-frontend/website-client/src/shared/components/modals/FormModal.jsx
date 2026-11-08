import PortalModalShell from './PortalModalShell'
import {
  PortalModalCancelButton,
  PortalModalPrimaryButton,
} from './PortalModalButtons'

/**
 * Shared add/edit form modal — SEEPZ base modal (white header, static backdrop, Cancel + Save aligned right).
 */
export default function FormModal({
  open,
  onClose,
  title,
  icon = null,
  size = 'xl',
  className = '',
  bodyClassName = '',
  bodyMaxHeightClass = 'max-h-[min(75dvh,calc(100dvh-10rem))] overflow-y-auto',
  footer = null,
  showFooter = true,
  showCloseButton = true,
  cancelLabel = 'Cancel',
  primaryLabel = 'Save',
  onPrimaryClick,
  primaryType = 'button',
  primaryForm,
  primaryLoading = false,
  primaryDisabled = false,
  cancelDisabled = false,
  headerVariant,
  staticBackdrop = true,
  closeOnEscape = true,
  stack = 'base',
  children,
}) {
  const resolvedHeaderVariant =
    headerVariant ?? (showFooter ? 'default' : 'readOnly')

  const resolvedFooter =
    footer
    ?? (showFooter ? (
      <>
        <PortalModalCancelButton
          type="button"
          onClick={onClose}
          disabled={cancelDisabled || primaryLoading}
        >
          {cancelLabel}
        </PortalModalCancelButton>
        <PortalModalPrimaryButton
          type={primaryType}
          form={primaryForm}
          onClick={onPrimaryClick}
          disabled={primaryDisabled}
          loading={primaryLoading}
        >
          {primaryLabel}
        </PortalModalPrimaryButton>
      </>
    ) : null)

  return (
    <PortalModalShell
      isOpen={open}
      onClose={onClose}
      title={title}
      icon={icon}
      size={size}
      className={className}
      bodyClassName={`${bodyMaxHeightClass} ${bodyClassName}`.trim()}
      footer={resolvedFooter}
      footerLayout="end"
      showCloseButton={showCloseButton}
      headerVariant={resolvedHeaderVariant}
      staticBackdrop={staticBackdrop}
      closeOnEscape={closeOnEscape}
      stack={stack}
    >
      {children}
    </PortalModalShell>
  )
}
