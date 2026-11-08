import { kranMarkSrc } from '@/shared/components/branding/KranMarkLogo'
import faviconIco from '@/assets/favicon.ico'

/** @typedef {'kran' | 'default'} HostPortalId */
/** @typedef {'wordmarkModule' | 'hostLogoBanner' | 'hostTitleStack'} HostPortalLayout */

/**
 * Module header branding for KRAN Consulting Design System.
 */
export const HOST_PORTAL_BRAND = {
  kran: {
    layout: /** @type {HostPortalLayout} */ ('wordmarkModule'),
    wordmark: 'KRAN Design System',
    logoSrc: kranMarkSrc,
    faviconSrc: faviconIco,
    logoAltKey: 'hostPortal.kranLogoAlt',
    ariaKey: 'hostPortal.ariaKranFull',
    logoClassName:
      'h-[36px] w-auto max-w-[92px] shrink-0 object-contain object-left',
  },
}

export function getEffectiveHostPortal() {
  return 'kran'
}

export function getHostPortalBrand(portalId = getEffectiveHostPortal()) {
  return HOST_PORTAL_BRAND[portalId] ?? HOST_PORTAL_BRAND.kran
}
