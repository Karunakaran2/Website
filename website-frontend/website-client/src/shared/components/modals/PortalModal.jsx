import { createPortal } from 'react-dom'
import { useEffect, useRef } from 'react'
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
  className = '',
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
      className="probity-portal-modal fixed inset-0 flex items-center justify-center bg-slate-900/50 p-3 sm:p-4"
      style={{ zIndex: overlayZIndex ?? PORTAL_MODAL_Z_INDEX }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      onMouseDown={(event) => {
        if (staticBackdrop || event.target !== event.currentTarget) return
        onClose?.()
      }}
    >
      <div className={`relative z-[1] ${className}`.trim()}>{children}</div>
    </div>,
    document.body,
  )
}
