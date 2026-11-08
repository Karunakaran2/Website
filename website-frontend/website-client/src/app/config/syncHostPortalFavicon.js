import { getHostPortalBrand } from '@/app/config/hostPortalBrand'

const DEFAULT_FAVICON_HREF = `${import.meta.env.BASE_URL}favicon.ico`

function resolveFaviconType(href) {
  const value = String(href || '').toLowerCase()
  if (value.includes('.svg')) {
    return 'image/svg+xml'
  }
  if (value.includes('.png')) {
    return 'image/png'
  }
  if (value.includes('.ico')) {
    return 'image/x-icon'
  }
  return 'image/x-icon'
}

/** Set tab favicon from KRAN Design System branding. */
export function syncHostPortalFavicon() {
  if (typeof document === 'undefined') {
    return
  }

  const brand = getHostPortalBrand()
  const href = brand.faviconSrc || DEFAULT_FAVICON_HREF
  const type = resolveFaviconType(href)

  let link = document.querySelector('link[rel="icon"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }

  link.type = type
  link.href = href
}
