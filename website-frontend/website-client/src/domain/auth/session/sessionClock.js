import {
  ACTIVITY_THROTTLE_MS,
  IDLE_LIMIT_MS,
  WARNING_LEAD_MS,
  jwtRefreshDelayMs,
  remainingIdleMs,
} from './sessionPolicy'

const IDLE_TICK_MS = 1000

/**
 * One inactivity clock and one access-token refresh timer for the whole portal.
 * Idle state follows elapsed wall time, so a frozen background tab still warns
 * and logs out when it ticks or becomes visible. Token refresh does not count
 * as user activity.
 */
export function createSessionClock({
  now = () => Date.now(),
  getAccessToken,
  refreshAccessToken,
  endSession,
  onWarning,
  onRemaining,
  onDebug,
  idleLimitMs = IDLE_LIMIT_MS,
  warningLeadMs = WARNING_LEAD_MS,
}) {
  let lastActivityAt = now()
  let warningOpen = false
  let stopped = true
  let ending = false
  let idleTimer = null
  let jwtTimer = null
  let removeVisibilityListener = () => {}

  function remainingMs(at = now()) {
    return remainingIdleMs(lastActivityAt, at, idleLimitMs)
  }

  function clearIdleTimer() {
    clearInterval(idleTimer)
    idleTimer = null
  }

  function clearJwtTimer() {
    clearTimeout(jwtTimer)
    jwtTimer = null
  }

  function emitWarning(open, remaining) {
    onWarning?.({ open, remainingMs: remaining })
  }

  function evaluateIdle() {
    if (stopped || ending) {
      return
    }
    const remaining = remainingMs()
    onRemaining?.(remaining)
    if (remaining <= 0) {
      void expire()
      return
    }
    if (remaining <= warningLeadMs) {
      if (!warningOpen) {
        warningOpen = true
        onDebug?.('warning-opened', { remainingMs: remaining })
      }
      emitWarning(true, remaining)
      return
    }
    if (warningOpen) {
      warningOpen = false
      emitWarning(false, remaining)
    }
  }

  function armIdleCheck() {
    if (stopped) {
      return
    }
    clearIdleTimer()
    evaluateIdle()
    if (stopped || ending) {
      return
    }
    idleTimer = setInterval(evaluateIdle, IDLE_TICK_MS)
  }

  function watchVisibility() {
    removeVisibilityListener()
    if (typeof document === 'undefined') {
      return
    }
    const onChange = () => {
      if (document.visibilityState === 'visible') {
        evaluateIdle()
      }
    }
    document.addEventListener('visibilitychange', onChange)
    removeVisibilityListener = () => {
      document.removeEventListener('visibilitychange', onChange)
      removeVisibilityListener = () => {}
    }
  }

  function scheduleJwt() {
    if (stopped) {
      return
    }
    clearJwtTimer()
    const delay = jwtRefreshDelayMs(getAccessToken?.(), now())
    if (delay == null) {
      return
    }
    jwtTimer = setTimeout(() => {
      void refreshBeforeExpiry()
    }, delay)
  }

  async function refreshBeforeExpiry() {
    if (stopped || ending) {
      return
    }
    const refreshed = await refreshAccessToken()
    if (stopped || ending) {
      return
    }
    if (!refreshed) {
      await expire()
      return
    }
    scheduleJwt()
  }

  async function expire() {
    if (ending) {
      return
    }
    ending = true
    stopped = true
    warningOpen = false
    clearIdleTimer()
    clearJwtTimer()
    removeVisibilityListener()
    emitWarning(false, 0)
    onRemaining?.(null)
    onDebug?.('inactivity-logout-started')
    await endSession?.()
  }

  return {
    start() {
      stopped = false
      ending = false
      warningOpen = false
      lastActivityAt = now()
      onDebug?.('idle-clock-started', {
        idleLimitMs,
        warningLeadMs,
        warningInMs: idleLimitMs - warningLeadMs,
        logoutInMs: idleLimitMs,
      })
      watchVisibility()
      armIdleCheck()
      scheduleJwt()
    },
    stop() {
      stopped = true
      warningOpen = false
      clearIdleTimer()
      clearJwtTimer()
      removeVisibilityListener()
      emitWarning(false, 0)
      onRemaining?.(null)
    },
    isRunning() {
      return !stopped
    },
    noteActivity(reason = 'activity') {
      if (stopped || warningOpen) {
        return
      }
      const current = now()
      if (current - lastActivityAt < ACTIVITY_THROTTLE_MS) {
        return
      }
      lastActivityAt = current
      onDebug?.('activity-reset', { reason })
      armIdleCheck()
    },
    noteTokenUpdate({ resetActivity = false } = {}) {
      if (stopped) {
        return
      }
      scheduleJwt()
      if (!resetActivity) {
        onDebug?.('jwt-refresh-kept-idle-deadline', { remainingMs: remainingMs() })
        return
      }
      warningOpen = false
      lastActivityAt = now()
      onDebug?.('seat-switch-reset-idle')
      emitWarning(false, idleLimitMs)
      armIdleCheck()
    },
    async continueSession() {
      if (stopped || ending || !warningOpen) {
        return false
      }
      onDebug?.('continue-session')
      const refreshed = await refreshAccessToken()
      if (stopped || ending) {
        return false
      }
      if (!refreshed) {
        await expire()
        return false
      }
      warningOpen = false
      lastActivityAt = now()
      onDebug?.('continue-session-reset-idle')
      emitWarning(false, idleLimitMs)
      armIdleCheck()
      scheduleJwt()
      return true
    },
  }
}
