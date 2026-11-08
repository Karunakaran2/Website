import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

function cameFromOverlay(relatedTarget) {
  if (!(relatedTarget instanceof Element)) {
    return true
  }
  return Boolean(
    relatedTarget.closest('[role="dialog"]')
    || relatedTarget.closest('.probity-portal-modal'),
  )
}

function placeTooltip(anchor) {
  const rect = anchor.getBoundingClientRect()
  return {
    top: rect.top - 7,
    left: rect.left + rect.width / 2,
  }
}

/** Label on hover for icon-only row actions (not native browser `title`). */
export default function ActionIconTooltip({ label, children }) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState(null)
  const dismissedRef = useRef(false)
  const anchorRef = useRef(null)

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null)
      return undefined
    }

    const update = () => {
      const anchor = anchorRef.current
      if (!anchor) {
        return
      }
      const next = placeTooltip(anchor)
      setCoords((previous) => (
        previous && previous.top === next.top && previous.left === next.left
          ? previous
          : next
      ))
    }

    update()
    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [open, label])

  if (!label) {
    return children
  }

  return (
    <span
      ref={anchorRef}
      className="relative inline-flex"
      onPointerEnter={(event) => {
        if (dismissedRef.current) {
          if (cameFromOverlay(event.relatedTarget)) {
            return
          }
          dismissedRef.current = false
        }
        setOpen(true)
      }}
      onPointerLeave={() => {
        setOpen(false)
      }}
      onPointerDown={(event) => {
        dismissedRef.current = true
        setOpen(false)
        const button = event.currentTarget.querySelector('button')
        if (button instanceof HTMLElement && document.activeElement === button) {
          button.blur()
        }
      }}
    >
      {children}
      {open && coords
        ? createPortal(
          <span
            role="tooltip"
            style={{ top: coords.top, left: coords.left }}
            className="pointer-events-none fixed z-[1200] -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-black px-2.5 py-1 text-xs font-medium leading-snug text-white"
          >
            {label}
            <span
              className="absolute left-1/2 top-full -translate-x-1/2 border-[5px] border-transparent border-t-black"
              aria-hidden
            />
          </span>,
          document.body,
        )
        : null}
    </span>
  )
}
