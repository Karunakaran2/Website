import { describe, expect, it } from 'vitest'
import { ROUTES } from '@/shared/constants/routes'
import { isPublicPath } from '@/domain/auth/components/SessionGuard'

describe('auth routes', () => {
  it('exposes login and secondary auth paths', () => {
    expect(ROUTES.LOGIN).toBe('/')
    expect(ROUTES.FORGOT_PASSWORD).toBe('/auth/forgot-password')
    expect(ROUTES.ONE_TIME_REGISTRATION).toBe('/auth/one-time-registration')
    expect(ROUTES.APPLICATION_TRACKING).toBe('/auth/application-tracking')
    expect(ROUTES.SEATS).toBe('/seats')
  })

  it('treats forgot password and OTR as public paths for SessionGuard', () => {
    expect(isPublicPath(ROUTES.FORGOT_PASSWORD)).toBe(true)
    expect(isPublicPath(ROUTES.ONE_TIME_REGISTRATION)).toBe(true)
    expect(isPublicPath(ROUTES.APPLICATION_TRACKING)).toBe(true)
  })
})
