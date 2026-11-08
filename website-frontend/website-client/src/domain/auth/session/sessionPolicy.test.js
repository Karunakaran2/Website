import { describe, expect, it } from 'vitest'
import { IDLE_LIMIT_MS, WARNING_LEAD_MS, preferAccessToken, sessionWindowsFromEnv } from './sessionPolicy'

describe('sessionWindowsFromEnv', () => {
  it('keeps the 20 minute idle and 5 minute warning outside development', () => {
    expect(sessionWindowsFromEnv({
      dev: false,
      idleSeconds: '120',
      warningSeconds: '60',
    })).toEqual({
      idleLimitMs: IDLE_LIMIT_MS,
      warningLeadMs: WARNING_LEAD_MS,
    })
  })

  it('uses a 2 minute idle and 1 minute warning in development when configured', () => {
    expect(sessionWindowsFromEnv({
      dev: true,
      idleSeconds: '120',
      warningSeconds: '60',
    })).toEqual({
      idleLimitMs: 2 * 60 * 1000,
      warningLeadMs: 60 * 1000,
    })
  })

  it('keeps the live access token when a profile copy expires sooner', () => {
    const live = jwtExpiringAt(2_000)
    const stale = jwtExpiringAt(1_000)
    expect(preferAccessToken(stale, live)).toBe(live)
    expect(preferAccessToken('', live)).toBe(live)
  })

  it('keeps a newly issued access token that expires later than the live token', () => {
    const live = jwtExpiringAt(1_000)
    const issued = jwtExpiringAt(2_000)
    expect(preferAccessToken(issued, live)).toBe(issued)
  })

  it('ignores a warning window that is not shorter than the idle limit', () => {
    expect(sessionWindowsFromEnv({
      dev: true,
      idleSeconds: '120',
      warningSeconds: '120',
    })).toEqual({
      idleLimitMs: 2 * 60 * 1000,
      warningLeadMs: 60 * 1000,
    })
  })
})

function jwtExpiringAt(expSeconds) {
  const encode = (value) => btoa(JSON.stringify(value))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
  return `${encode({ alg: 'none' })}.${encode({ exp: expSeconds })}.sig`
}
