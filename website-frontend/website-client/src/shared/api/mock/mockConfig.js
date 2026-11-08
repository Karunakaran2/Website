/**
 * Mock Configuration
 * Default: mock in dev (`import.meta.env.DEV`), real API in production builds.
 * Override with VITE_MOCK_API=true|false.
 */
export function isMockEnabled() {
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
    return false
  }
  if (import.meta.env?.MODE === 'test') {
    return false
  }
  const envValue = import.meta.env?.VITE_MOCK_API
  if (envValue === 'true' || envValue === true) {
    return true
  }
  if (envValue === 'false' || envValue === false) {
    return false
  }
  // Dev/demo default: mock without backend. Production builds default to real API.
  return import.meta.env.DEV === true
}

export const DEMO_CREDENTIALS = {
  username: 'admin',
  password: 'password',
  role: 'System Administrator',
  designation: 'Finance Officer',
  displayName: 'Administrator (SPFO)',
}
