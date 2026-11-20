/** auth-service (8081) via gateway */
export const AUTH_ENDPOINTS = {
  login: '/api/v1/auth/login',
  logout: '/api/v1/auth/logout',
  refresh: '/api/v1/auth/refresh',
  me: '/api/v1/auth/me',
  changePassword: '/api/v1/auth/change-password',
  jwks: '/api/v1/auth/.well-known/jwks.json',
}

export const CAPTCHA_ENDPOINTS = {
  getCaptcha: '/api/v1/captcha/getCaptcha',
}