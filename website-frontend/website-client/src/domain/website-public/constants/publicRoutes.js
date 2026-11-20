/** Legacy KRAN Consulting URL shapes (see KranConsulting JSPs). */
export const PUBLIC_ROUTES = {
  HOME: '/',
  WELCOME: '/welcome',
  ABOUT: '/aboutus',
  NEWS: '/news',
  CONTACT: '/contact',
  DATASHEETS: '/datasheets',
  GALLERY: '/gallery',
  CASE_STUDY: '/casestudy',
  CAREER: '/career',
}

/** Paths that must not require admin login (SessionGuard). */
export const PUBLIC_WEBSITE_PATHS = new Set([
  PUBLIC_ROUTES.HOME,
  PUBLIC_ROUTES.WELCOME,
  PUBLIC_ROUTES.ABOUT,
  PUBLIC_ROUTES.NEWS,
  PUBLIC_ROUTES.CONTACT,
  PUBLIC_ROUTES.DATASHEETS,
  PUBLIC_ROUTES.GALLERY,
  PUBLIC_ROUTES.CASE_STUDY,
  PUBLIC_ROUTES.CAREER,
])

export function isPublicWebsitePath(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/'
  return PUBLIC_WEBSITE_PATHS.has(path)
}