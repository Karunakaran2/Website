import { AUTH_ENDPOINTS, CAPTCHA_ENDPOINTS } from './endpoints'

/** Maps to auth-service controllers (gateway `/api/v1/auth/**`, `/api/v1/captcha/**`). */
export const AUTH_API_OPERATIONS = [
  { hook: 'useGetCaptchaQuery', method: 'GET', path: CAPTCHA_ENDPOINTS.getCaptcha, auth: false },
  { hook: 'useLoginMutation', method: 'POST', path: AUTH_ENDPOINTS.login, auth: false },
  { hook: 'useRefreshSessionMutation', method: 'POST', path: AUTH_ENDPOINTS.refresh, auth: false },
  { hook: 'useLogoutUserMutation', method: 'POST', path: AUTH_ENDPOINTS.logout, auth: true },
  { hook: 'useGetLoginUserQuery', method: 'GET', path: AUTH_ENDPOINTS.me, auth: true },
  { hook: 'useGetJwksQuery', method: 'GET', path: AUTH_ENDPOINTS.jwks, auth: false },
]