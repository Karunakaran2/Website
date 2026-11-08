let activeClock = null
let latestRemainingMs = null
const remainingListeners = new Set()

export function bindSessionClock(clock) {
  activeClock = clock
}

export function publishSessionRemaining(remainingMs) {
  latestRemainingMs = remainingMs
  remainingListeners.forEach((listener) => listener(remainingMs))
}

export function subscribeSessionRemaining(listener) {
  remainingListeners.add(listener)
  listener(latestRemainingMs)
  return () => remainingListeners.delete(listener)
}

export function stopSessionClock() {
  activeClock?.stop()
}
