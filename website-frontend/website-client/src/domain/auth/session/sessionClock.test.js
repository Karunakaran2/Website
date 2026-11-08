import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSessionClock } from './sessionClock'
import { IDLE_LIMIT_MS, WARNING_LEAD_MS } from './sessionPolicy'

const MINUTE_MS = 60 * 1000

function accessTokenExpiringIn(seconds) {
  const exp = Math.floor(Date.now() / 1000) + seconds
  const payload = Buffer.from(JSON.stringify({ exp })).toString('base64url')
  return `e30.${payload}.sig`
}

function warningOpens(events) {
  let wasOpen = false
  let opens = 0
  events.forEach((event) => {
    if (event.open && !wasOpen) {
      opens += 1
    }
    wasOpen = event.open
  })
  return opens
}

describe('createSessionClock', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  function startClock({ refreshSucceeds = true, idleLimitMs, warningLeadMs } = {}) {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
    let token = accessTokenExpiringIn(900)
    const events = []
    const endSession = vi.fn(async () => {})
    const refreshAccessToken = vi.fn(async () => {
      if (!refreshSucceeds) {
        return false
      }
      token = accessTokenExpiringIn(900)
      return true
    })
    const clock = createSessionClock({
      getAccessToken: () => token,
      refreshAccessToken,
      endSession,
      onWarning: (event) => events.push(event),
      idleLimitMs,
      warningLeadMs,
    })
    clock.start()
    return { clock, events, endSession, refreshAccessToken, replaceToken: () => { token = accessTokenExpiringIn(900) } }
  }

  it('opens the warning once in the last five minutes and logs out at twenty minutes', async () => {
    const { events, endSession } = startClock()

    await vi.advanceTimersByTimeAsync(IDLE_LIMIT_MS - WARNING_LEAD_MS)
    expect(warningOpens(events)).toBe(1)
    expect(events.at(-1).open).toBe(true)
    expect(events.at(-1).remainingMs).toBe(WARNING_LEAD_MS)
    expect(endSession).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(WARNING_LEAD_MS)
    expect(endSession).toHaveBeenCalledTimes(1)
    expect(warningOpens(events)).toBe(1)
  })

  it('resets the idle clock after meaningful activity', async () => {
    const { clock, events, endSession } = startClock()

    await vi.advanceTimersByTimeAsync(14 * MINUTE_MS)
    clock.noteActivity()
    await vi.advanceTimersByTimeAsync(14 * MINUTE_MS)

    expect(events.some((event) => event.open)).toBe(false)
    expect(endSession).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(MINUTE_MS)
    expect(warningOpens(events)).toBe(1)
  })

  it('does not reset the idle clock while the warning is open', async () => {
    const { clock, endSession } = startClock()

    await vi.advanceTimersByTimeAsync(IDLE_LIMIT_MS - WARNING_LEAD_MS)
    clock.noteActivity()
    await vi.advanceTimersByTimeAsync(WARNING_LEAD_MS)

    expect(endSession).toHaveBeenCalledTimes(1)
  })

  it('continues the session by refreshing both tokens and resetting the idle clock', async () => {
    const { clock, events, endSession, refreshAccessToken } = startClock()

    await vi.advanceTimersByTimeAsync(IDLE_LIMIT_MS - WARNING_LEAD_MS)
    const refreshed = await clock.continueSession()

    expect(refreshed).toBe(true)
    expect(refreshAccessToken).toHaveBeenCalled()
    expect(events.at(-1).open).toBe(false)
    expect(endSession).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(14 * MINUTE_MS)
    expect(events.filter((event) => event.open).length).toBeGreaterThan(0)
    expect(events.at(-1).open).toBe(false)

    await vi.advanceTimersByTimeAsync(MINUTE_MS)
    expect(warningOpens(events)).toBe(2)
    expect(endSession).not.toHaveBeenCalled()
  })

  it('logs out once when continue cannot refresh', async () => {
    const harness = startClock()
    await vi.advanceTimersByTimeAsync(IDLE_LIMIT_MS - WARNING_LEAD_MS)
    harness.refreshAccessToken.mockResolvedValue(false)

    const refreshed = await harness.clock.continueSession()
    await harness.clock.continueSession()

    expect(refreshed).toBe(false)
    expect(harness.endSession).toHaveBeenCalledTimes(1)
  })

  it('refreshes the access token before it expires without resetting inactivity', async () => {
    const { events, endSession, refreshAccessToken } = startClock()

    await vi.advanceTimersByTimeAsync(14 * MINUTE_MS)
    expect(refreshAccessToken).toHaveBeenCalledTimes(1)
    expect(events.some((event) => event.open)).toBe(false)

    await vi.advanceTimersByTimeAsync(MINUTE_MS)
    expect(warningOpens(events)).toBe(1)
    expect(endSession).not.toHaveBeenCalled()
  })

  it('logs out once when proactive refresh fails', async () => {
    const harness = startClock({ refreshSucceeds: false })

    await vi.advanceTimersByTimeAsync(14 * MINUTE_MS)

    expect(harness.refreshAccessToken).toHaveBeenCalledTimes(1)
    expect(harness.endSession).toHaveBeenCalledTimes(1)
  })

  it('warns after one minute and logs out after two when that window is configured', async () => {
    const { events, endSession } = startClock({
      idleLimitMs: 2 * MINUTE_MS,
      warningLeadMs: MINUTE_MS,
    })

    await vi.advanceTimersByTimeAsync(MINUTE_MS)
    expect(warningOpens(events)).toBe(1)
    expect(events.at(-1).open).toBe(true)
    expect(events.at(-1).remainingMs).toBe(MINUTE_MS)
    expect(endSession).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(MINUTE_MS)
    expect(endSession).toHaveBeenCalledTimes(1)
  })

  it('logs out from elapsed time when the tab becomes visible', async () => {
    let onVisible
    vi.stubGlobal('document', {
      visibilityState: 'visible',
      addEventListener: (type, handler) => {
        if (type === 'visibilitychange') {
          onVisible = handler
        }
      },
      removeEventListener: () => {},
    })
    const { endSession } = startClock()

    vi.setSystemTime(new Date('2026-01-01T00:20:00Z'))
    onVisible()
    await Promise.resolve()

    expect(endSession).toHaveBeenCalledTimes(1)
  })

  it('resets inactivity and reschedules expiry when the seat token is replaced', async () => {
    const { clock, events, refreshAccessToken, replaceToken } = startClock()

    await vi.advanceTimersByTimeAsync(10 * MINUTE_MS)
    replaceToken()
    clock.noteTokenUpdate({ resetActivity: true })
    const refreshesAtSwitch = refreshAccessToken.mock.calls.length

    await vi.advanceTimersByTimeAsync(14 * MINUTE_MS)
    expect(events.some((event) => event.open)).toBe(false)
    expect(refreshAccessToken.mock.calls.length).toBe(refreshesAtSwitch + 1)
  })
})
