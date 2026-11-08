/** App base path — same pattern as spfo_frontend (Vite base + React Router basename). */
export function getPublicBase() {
  const raw = String(import.meta.env.VITE_PUBLIC_URL || import.meta.env.BASE_URL || '/').trim()
  if (!raw || raw === '/') return ''
  return raw.replace(/\/+$/, '')
}
