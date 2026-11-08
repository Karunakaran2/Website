import { useEffect, useRef } from 'react'
import { getFocusableElements, trapTabKey } from '@/shared/utils/keyboardUtils'

/**
 * Keep keyboard focus inside an open overlay (modals, menus).
 * Restores focus to the previously focused element on close.
 */
export function useFocusTrap(isActive, containerRef, { lockBodyScroll = true } = {}) {
  const previouslyFocusedRef = useRef(null)

  useEffect(() => {
    if (!isActive || !containerRef?.current) {
      return undefined
    }

    previouslyFocusedRef.current = document.activeElement
    const container = containerRef.current
    const focusables = getFocusableElements(container)
    ;(focusables[0] || container).focus?.({ preventScroll: true })

    const handleKeyDown = (event) => {
      trapTabKey(event, container)
    }

    const shellLocksScroll = document.documentElement.classList.contains('probity-shell-lock')
    const previousOverflow = document.body.style.overflow
    if (lockBodyScroll && !shellLocksScroll) {
      document.body.style.overflow = 'hidden'
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (lockBodyScroll && !shellLocksScroll) {
        document.body.style.overflow = previousOverflow
      }
      const previous = previouslyFocusedRef.current
      if (previous && typeof previous.focus === 'function' && document.contains(previous)) {
        previous.focus({ preventScroll: true })
      }
    }
  }, [isActive, containerRef, lockBodyScroll])
}
