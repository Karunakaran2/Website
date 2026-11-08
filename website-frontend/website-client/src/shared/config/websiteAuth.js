/** When true, CMS login uses website auth-service (`/api/v1/auth/*`) instead of Probity login APIs. */
export const WEBSITE_AUTH_ENABLED =
  String(import.meta.env.VITE_WEBSITE_AUTH ?? 'true').toLowerCase() === 'true'
