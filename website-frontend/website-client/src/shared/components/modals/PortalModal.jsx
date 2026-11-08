import { createPortal } from 'react-dom'
import { useEffect, useRef } from 'react'
import { Modal } from '@/shared/lib/tailwreck'
import { useFocusTrap } from '@/shared/hooks/useFocusTrap'
import { PORTAL_MODAL_Z_INDEX } from './modalChrome'
import { registerPortalModal, unregisterPortalModal } from './portalModalStack'

/**
 * Portal modal overlay — centered, 50% backdrop, focus trap, body scroll lock.
 * `staticBackdrop` — backdrop click does not dismiss (data-entry). Escape is controlled by `closeOnEscape`.
 */
export default function PortalModal({
  children,
  isOpen = false,
  onClose,
  ariaLabelledBy,
  ariaDescribedBy,
  overlayZIndex,
  staticBackdrop = false,
  closeOnEscape = true,
  theme = 'no-preset',
  position = 'center',
  rounded = 'lg',
  shadow = 'lg',
  ...props
}) {
  const containerRef = useRef(null)
  const stackIdRef = useRef(null)
  useFocusTrap(isOpen, containerRef)

  useEffect(() => {
    if (!isOpen || !onClose) {
      return undefined
    }
    const registrationId = registerPortalModal(onClose, { closeOnEscape })
    stackIdRef.current = registrationId
    return () => {
      unregisterPortalModal(registrationId)
      if (stackIdRef.current === registrationId) {
        stackIdRef.current = null
      }
    }
  }, [isOpen, onClose, closeOnEscape])

  if (typeof document === 'undefined' || !isOpen) {
    return null
  }

  return createPortal(
    <div
      ref={containerRef}
      className="probity-portal-modal fixed inset-0"
      style={{ zIndex: overlayZIndex ?? PORTAL_MODAL_Z_INDEX }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
    >
      <Modal
        isOpen={isOpen}
        onClose={undefined}
        disableBackdropClick={staticBackdrop}
        theme={theme}
        position={position}
        rounded={rounded}
        shadow={shadow}
        {...props}
      >
        {children}
      </Modal>
    </div>,
    document.body,
  )
}
