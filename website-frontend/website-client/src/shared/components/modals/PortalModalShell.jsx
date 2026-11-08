import { isValidElement, useId } from 'react'
import { X } from 'lucide-react'
import { ModalBody, ModalFooter, ModalHeader } from '@/shared/lib/tailwreck'
import PortalModal from './PortalModal'
import { ModalTitle } from '@/shared/components/typography'
import {
  PORTAL_MODAL_BODY_CLASS,
  PORTAL_MODAL_FOOTER_CLASS,
  PORTAL_MODAL_HEADER_CLASS,
  PORTAL_MODAL_HEADER_READONLY_CLASS,
  PORTAL_MODAL_NESTED_Z_INDEX,
  PORTAL_MODAL_SIZE_CLASS,
  PORTAL_MODAL_Z_INDEX,
} from './modalChrome'

/**
 * SEEPZ / GIGW base modal shell — white (or read-only gray) header, scrollable body, optional footer.
 */
export default function PortalModalShell({
  isOpen,
  onClose,
  title,
  icon = null,
  size = 'md',
  className = '',
  bodyClassName = '',
  footer = null,
  footerClassName = '',
  footerLayout = 'end',
  children,
  showCloseButton = true,
  /** `readOnly` — #F8F9FA header (view-only modals). */
  headerVariant = 'default',
  /** Backdrop click does not dismiss (data entry). */
  staticBackdrop = false,
  /** Escape closes this modal when true (default). Set false only for forced acknowledgment. */
  closeOnEscape = true,
  /** `nested` — above parent form modal (Add Bank, confirm on open form). */
  stack = 'base',
}) {
  const titleId = useId()

  if (!isOpen) {
    return null
  }

  const shellClass =
    size === 'custom'
      ? className
      : `${PORTAL_MODAL_SIZE_CLASS[size] || PORTAL_MODAL_SIZE_CLASS.md} ${className}`.trim()

  const headerClass =
    headerVariant === 'readOnly' ? PORTAL_MODAL_HEADER_READONLY_CLASS : PORTAL_MODAL_HEADER_CLASS

  const footerJustify =
    footerLayout === 'end' ? 'justify-end' : 'justify-between'

  return (
    <PortalModal
      isOpen={isOpen}
      onClose={onClose}
      size="custom"
      className={shellClass}
      staticBackdrop={staticBackdrop}
      closeOnEscape={closeOnEscape}
      overlayZIndex={stack === 'nested' ? PORTAL_MODAL_NESTED_Z_INDEX : PORTAL_MODAL_Z_INDEX}
      ariaLabelledBy={title ? titleId : undefined}
    >
      <ModalHeader className={headerClass}>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {isValidElement(icon)
            ? icon
            : typeof icon === 'function'
              ? (() => {
                  const IconComp = icon
                  return <IconComp size={18} className="shrink-0 text-[#01458e]" aria-hidden />
                })()
              : null}
          {title ? (
            typeof title === 'string' ? (
              <ModalTitle id={titleId} className="min-w-0 break-words [overflow-wrap:anywhere] line-clamp-2">
                {title}
              </ModalTitle>
            ) : (
              <div id={titleId} className="min-w-0 flex-1">
                {title}
              </div>
            )
          ) : null}
        </div>
        {showCloseButton && onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#01458e]"
            aria-label="Close"
          >
            <X size={18} aria-hidden />
          </button>
        ) : null}
      </ModalHeader>

      <ModalBody className={`${PORTAL_MODAL_BODY_CLASS} ${bodyClassName}`.trim()}>
        {children}
      </ModalBody>

      {footer ? (
        <ModalFooter
          className={`${PORTAL_MODAL_FOOTER_CLASS} ${footerJustify} ${footerClassName}`.trim()}
        >
          {footer}
        </ModalFooter>
      ) : null}
    </PortalModal>
  )
}
