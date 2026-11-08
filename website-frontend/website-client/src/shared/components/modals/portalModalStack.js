import { isEscapeKey } from '@/shared/utils/keyboardUtils'

/** @type {{ id: symbol, onClose: () => void, closeOnEscape: boolean }[]} */
let stack = []
let escapeListenerAttached = false

function shouldDeferToOpenOverlay(event) {
  const target = event.target
  if (!target || typeof target.closest !== 'function') {
    return false
  }
  return Boolean(
    target.closest('[aria-expanded="true"]')
    || target.closest('[role="listbox"]')
    || target.closest('[data-headlessui-state="open"]'),
  )
}

function handleWindowEscape(event) {
  if (!isEscapeKey(event) || stack.length === 0) {
    return
  }
  const top = stack[stack.length - 1]
  if (top.closeOnEscape === false) {
    return
  }
  if (shouldDeferToOpenOverlay(event)) {
    return
  }
  event.preventDefault()
  event.stopImmediatePropagation()
  top.onClose()
}

function attachEscapeListener() {
  if (escapeListenerAttached) {
    return
  }
  window.addEventListener('keydown', handleWindowEscape, true)
  escapeListenerAttached = true
}

function detachEscapeListenerIfIdle() {
  if (stack.length === 0 && escapeListenerAttached) {
    window.removeEventListener('keydown', handleWindowEscape, true)
    escapeListenerAttached = false
  }
}

/**
 * Register an open portal modal. Escape closes only the most recently registered modal.
 * @returns {symbol} registration id — pass to {@link unregisterPortalModal}
 */
export function registerPortalModal(onClose, { closeOnEscape = true } = {}) {
  const entry = { id: Symbol('portalModal'), onClose, closeOnEscape }
  stack.push(entry)
  attachEscapeListener()
  return entry.id
}

export function unregisterPortalModal(id) {
  stack = stack.filter((entry) => entry.id !== id)
  detachEscapeListenerIfIdle()
}
