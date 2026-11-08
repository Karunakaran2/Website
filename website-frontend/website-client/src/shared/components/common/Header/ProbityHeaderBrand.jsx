import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useHeaderHomeTarget } from '@/app/shell/hooks/useHeaderHomeTarget'
import { getEffectiveHostPortal, getHostPortalBrand } from '@/app/config/hostPortalBrand'

function ModuleTitleSuffix({ portalLabel, translatedPortal }) {
  if (!portalLabel || !translatedPortal) {
    return null
  }

  return (
    <>
      <div className="hidden h-6 w-[2px] shrink-0 bg-white/30 sm:block" />
      <div className="hidden shrink-0 items-center sm:flex">
        <span className="text-[1rem] font-bold leading-none tracking-wide text-white md:text-[1.125rem]">
          {translatedPortal}
        </span>
      </div>
    </>
  )
}

/** Host portal lockup: emblem + org title stack + module name (SWFS). */
function HostPortalTitleStack({
  brand,
  homeTo,
  ariaLabel,
  t,
  portalLabel,
  translatedPortal,
}) {
  const logoAlt = brand.logoAltKey ? t(brand.logoAltKey) : ''
  const titleShort = t(brand.titleShortKey)
  const titleLong = t(brand.titleLongKey)
  const subtitle = t(brand.subtitleKey)

  return (
    <Link
      to={homeTo}
      className="flex min-w-0 items-center gap-3 no-underline"
      aria-label={ariaLabel}
    >
      <img
        src={brand.logoSrc}
        alt={logoAlt}
        className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16 lg:h-[68px] lg:w-[68px]"
      />
      <div className="flex min-w-0 flex-col justify-center">
        <h1 className="truncate font-sans text-lg font-semibold leading-tight text-white sm:text-xl lg:text-[1.5rem] lg:leading-none">
          <span className="lg:hidden">{titleShort}</span>
          <span className="hidden lg:inline">{titleLong}</span>
        </h1>
        <p className="mt-1 hidden truncate text-[0.6875rem] leading-none text-white/80 lg:block">
          {subtitle}
        </p>
      </div>
      <ModuleTitleSuffix portalLabel={portalLabel} translatedPortal={translatedPortal} />
    </Link>
  )
}

/** Full-width host banner (SPFO: logo asset + module title beside lockup). */
function HostPortalLogoBanner({
  brand,
  homeTo,
  ariaLabel,
  t,
  portalLabel,
  translatedPortal,
}) {
  const logoAlt = brand.logoAltKey ? t(brand.logoAltKey) : ''
  const logoClassName =
    brand.logoClassName
    ?? 'h-[45px] w-auto max-w-[min(100vw-10rem,520px)] shrink-0 object-contain object-left'

  return (
    <Link
      to={homeTo}
      className="flex min-w-0 items-center gap-[10px] no-underline"
      aria-label={ariaLabel}
    >
      <img src={brand.logoSrc} className={logoClassName} alt={logoAlt} />
      <ModuleTitleSuffix portalLabel={portalLabel} translatedPortal={translatedPortal} />
    </Link>
  )
}

/** Module header brand — host layout from .env (Probity, SPFO banner, or SWFS stack). */
export default function ProbityHeaderBrand({ portalLabel } = {}) {
  const { t } = useTranslation()
  const homeTo = useHeaderHomeTarget()
  const translatedPortal = portalLabel ? t(portalLabel) : ''
  const brand = getHostPortalBrand(getEffectiveHostPortal())
  const wordmarkClassName =
    brand.wordmarkClassName
    ?? 'flex h-[45px] shrink-0 items-center font-sans text-[1.5rem] font-semibold leading-none text-white md:text-[1.5625rem]'
  const ariaLabel = t(brand.ariaKey, {
    portal: translatedPortal || brand.wordmark || 'Design System',
    defaultValue: `${brand.wordmark ?? 'Design System'} ${translatedPortal}`.trim(),
  })

  if (brand.layout === 'hostTitleStack') {
    return (
      <div className="flex min-w-0 items-center">
        <HostPortalTitleStack
          brand={brand}
          homeTo={homeTo}
          ariaLabel={ariaLabel}
          t={t}
          portalLabel={portalLabel}
          translatedPortal={translatedPortal}
        />
      </div>
    )
  }

  if (brand.layout === 'hostLogoBanner') {
    return (
      <div className="flex min-w-0 items-center">
        <HostPortalLogoBanner
          brand={brand}
          homeTo={homeTo}
          ariaLabel={ariaLabel}
          t={t}
          portalLabel={portalLabel}
          translatedPortal={translatedPortal}
        />
      </div>
    )
  }

  return (
    <div className="flex min-w-0 items-center">
      <Link
        to={homeTo}
        className="flex min-w-0 max-w-full items-center gap-2 no-underline sm:gap-[10px]"
        aria-label={ariaLabel}
      >
        {brand.logoSrc ? (
          <img
            src={brand.logoSrc}
            alt={brand.logoAltKey ? t(brand.logoAltKey) : 'KRAN'}
            className={
              brand.logoClassName
              ?? 'h-[36px] w-auto max-w-[92px] shrink-0 object-contain object-left'
            }
          />
        ) : (
          <span className={wordmarkClassName}>{brand.wordmark ?? 'Probity'}</span>
        )}
        <ModuleTitleSuffix portalLabel={portalLabel} translatedPortal={translatedPortal} />
      </Link>
    </div>
  )
}
