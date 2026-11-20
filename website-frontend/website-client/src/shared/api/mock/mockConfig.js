/**
 * Mock API is opt-in only (`VITE_MOCK_API=true`). Default is always the real backend.
 */
export function isMockEnabled() {
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
    return false
  }
  if (import.meta.env?.MODE === 'test') {
    return false
  }
  return String(import.meta.env?.VITE_MOCK_API ?? 'false').toLowerCase() === 'true'
}