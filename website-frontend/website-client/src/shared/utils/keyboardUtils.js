/** @returns {boolean} Enter or Space — standard activation for buttons / custom controls */
export const isActivationKey = (event) => event.key === 'Enter' || event.key === ' '

export const isEscapeKey = (event) =>
  event.key === 'Escape' || event.key === 'Esc' || event.code === 'Escape'

export const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function getFocusableElements(container) {
  if (!container) {
    return []
  }
  return [...container.querySelectorAll(FOCUSABLE_SELECTOR)].filter(
    (el) => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true',
  )
}

/** Trap Tab / Shift+Tab within container */
export function trapTabKey(event, container) {
  if (event.key !== 'Tab' || !container) {
    return
  }
  const focusables = getFocusableElements(container)
  if (!focusables.length) {
    return
  }
  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

export function activateFromKeyboard(event, action) {
  if (isActivationKey(event)) {
    event.preventDefault()
    action()
  }
}

export function moveHorizontalIndex(key, currentIndex, count) {
  if (count <= 0) {
    return currentIndex
  }
  if (key === 'ArrowRight' || key === 'ArrowDown') {
    return (currentIndex + 1) % count
  }
  if (key === 'ArrowLeft' || key === 'ArrowUp') {
    return (currentIndex - 1 + count) % count
  }
  return currentIndex
}

export function moveListboxIndex(key, currentIndex, count) {
  if (count <= 0) {
    return currentIndex
  }
  if (key === 'ArrowDown') {
    return (currentIndex + 1) % count
  }
  if (key === 'ArrowUp') {
    return (currentIndex - 1 + count) % count
  }
  if (key === 'Home') {
    return 0
  }
  if (key === 'End') {
    return count - 1
  }
  return currentIndex
}
