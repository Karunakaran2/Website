export const TASKS_CHANGED_EVENT = 'kran:tasks-changed'

export function notifyTasksChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(TASKS_CHANGED_EVENT))
  }
}

export function subscribeTasksChanged(handler) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener(TASKS_CHANGED_EVENT, handler)
  return () => window.removeEventListener(TASKS_CHANGED_EVENT, handler)
}
