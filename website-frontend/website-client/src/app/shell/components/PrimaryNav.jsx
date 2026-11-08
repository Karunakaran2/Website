import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { MdKeyboardArrowDown } from 'react-icons/md'
import { getPrimaryNavItems, SETUP_HOME_ID } from '@/app/shell/constants/dashboard'
import { MODULE_NAV_TAB_FONT } from '@/app/shell/constants/moduleNavStyles'
import { useDashboardNav } from '@/app/shell/hooks/useDashboardNav'
import { useDashboardRouteIds } from '@/app/shell/hooks/useDashboardRouteIds'
import { useNavbarOverflow } from '@/app/shell/hooks/useNavbarOverflow'
import { getPrimaryNavTo } from '@/app/shell/utils/dashboardNavPaths'

const NAV_LABEL = `${MODULE_NAV_TAB_FONT} font-medium text-black`
/** Active = white pill only; same font-medium (500) as other tabs */
function primaryTabClass(highlighted) {
  return `flex h-full shrink-0 cursor-pointer items-center whitespace-nowrap px-3 no-underline transition-all duration-200 md:px-5 ${NAV_LABEL} ${
    highlighted ? 'bg-white' : 'shadow-none hover:bg-white'
  }`
}

function activateMoreKey(event, onActivate) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    onActivate()
  }
}

export default function PrimaryNav() {
  const { t } = useTranslation()
  const routeIds = useDashboardRouteIds()
  const { activePrimaryId } = useDashboardNav()
  const currentPrimaryId = routeIds?.primaryId ?? activePrimaryId

  const primaryNavItems = useMemo(
    () =>
      getPrimaryNavItems(currentPrimaryId).filter((item) => item.id !== SETUP_HOME_ID),
    [currentPrimaryId],
  )
  const isPrimaryHighlighted = (itemId) => currentPrimaryId === itemId
  const { visibleCount, containerRef, measureRef } = useNavbarOverflow(primaryNavItems)
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef(null)

  const visibleItems = primaryNavItems.slice(0, visibleCount)
  const overflowItems = primaryNavItems.slice(visibleCount)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setMoreOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const overflowHighlighted =
    moreOpen || overflowItems.some((item) => isPrimaryHighlighted(item.id))

  return (
    <nav
      aria-label="Primary navigation"
      className="relative flex h-[40px] w-full shrink-0 items-center bg-[#f5c518] px-[16px] sm:px-[20px] opacity-100"
    >
      <ul
        ref={measureRef}
        className="pointer-events-none absolute -left-[624.9375rem] -top-[624.9375rem] flex h-full items-center whitespace-nowrap opacity-0 invisible"
        aria-hidden
      >
        {primaryNavItems.map((item) => (
          <li key={item.id} className="flex h-full shrink-0 items-center">
            <span
              className={`flex h-full items-center px-3 md:px-5 ${MODULE_NAV_TAB_FONT} font-medium`}
            >
              {t(`nav.primary.${item.id}`, { defaultValue: item.label })}
            </span>
          </li>
        ))}
      </ul>

      <ul
        ref={containerRef}
        className="flex h-full w-full flex-nowrap items-center animate-fadeIn"
      >
        {visibleItems.map((item) => (
          <li key={item.id} className="relative flex h-full shrink-0 items-center">
            <NavLink
              to={getPrimaryNavTo(item.id)}
              end={false}
              aria-current={isPrimaryHighlighted(item.id) ? 'page' : 'false'}
              className={primaryTabClass(isPrimaryHighlighted(item.id))}
            >
              <span>{t(`nav.primary.${item.id}`, { defaultValue: item.label })}</span>
            </NavLink>
          </li>
        ))}

        {overflowItems.length > 0 ? (
          <li
            ref={moreRef}
            className="relative flex h-full shrink-0 items-center"
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <div
              role="button"
              tabIndex={0}
              onClick={() => setMoreOpen((v) => !v)}
              onKeyDown={(e) => activateMoreKey(e, () => setMoreOpen((v) => !v))}
              className={`${primaryTabClass(overflowHighlighted)} select-none gap-1`}
              aria-current={overflowHighlighted ? 'true' : 'false'}
              aria-expanded={moreOpen}
              aria-haspopup="true"
            >
              <span>{t('More')}</span>
              <MdKeyboardArrowDown
                size={14}
                className={`ml-0.5 shrink-0 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`}
              />
            </div>

            {moreOpen ? (
              <ul className="absolute right-0 top-full z-50 mt-0 max-h-[80vh] w-56 overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-xl animate-fadeIn">
                {overflowItems.map((item) => (
                  <li key={item.id} className="relative">
                    <NavLink
                      to={getPrimaryNavTo(item.id)}
                      end={false}
                      aria-current={isPrimaryHighlighted(item.id) ? 'page' : 'false'}
                      onClick={() => setMoreOpen(false)}
                      className={`mx-1 my-0.5 flex w-[calc(100%-0.5rem)] cursor-pointer items-center gap-3 rounded-md px-4 py-2 text-[13px] leading-5 font-medium no-underline transition-all duration-200 ${
                        isPrimaryHighlighted(item.id)
                          ? 'bg-slate-100 text-black'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-black'
                      }`}
                    >
                      <span>{t(`nav.primary.${item.id}`, { defaultValue: item.label })}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ) : null}
      </ul>
    </nav>
  )
}
