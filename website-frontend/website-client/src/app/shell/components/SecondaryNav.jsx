import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { MODULE_NAV_TAB_FONT } from '@/app/shell/constants/moduleNavStyles'
import { getSecondaryNavItems } from '@/app/shell/constants/dashboard'
import { useDashboardNav } from '@/app/shell/hooks/useDashboardNav'
import { useDashboardRouteIds } from '@/app/shell/hooks/useDashboardRouteIds'
import { getSecondaryNavTo } from '@/app/shell/utils/dashboardNavPaths'

/** SPFO sub-nav row is 45px; use px height so fluid html font-size does not shrink the bar */
export default function SecondaryNav() {
  const { t } = useTranslation()
  const routeIds = useDashboardRouteIds()
  const { activePrimaryId, activeSecondaryId } = useDashboardNav()
  const resolvedPrimaryId = routeIds?.primaryId ?? activePrimaryId
  const resolvedSecondaryId = routeIds?.secondaryId ?? activeSecondaryId
  const secondaryNavItems = getSecondaryNavItems(resolvedPrimaryId)

  if (resolvedPrimaryId === 'inbox' || secondaryNavItems.length === 0) {
    return null
  }

  return (
    <div className="box-border h-[45px] min-h-[45px] max-h-[45px] w-full shrink-0 border-b border-slate-200 bg-white">
      <ul className="custom-scrollbar box-border flex h-[45px] min-h-[45px] max-h-[45px] w-full min-w-0 items-center overflow-x-auto px-3 sm:px-5 xl:px-[20px]">
        {secondaryNavItems.map((tab) => (
          <li key={tab.id} className="h-[45px] shrink-0">
            <NavLink
              to={getSecondaryNavTo(resolvedPrimaryId, tab.id)}
              aria-current={resolvedSecondaryId === tab.id ? 'page' : 'false'}
              className={`relative box-border flex h-[45px] items-center whitespace-nowrap px-3 font-medium no-underline md:px-5 ${MODULE_NAV_TAB_FONT} transition ${
                resolvedSecondaryId === tab.id
                  ? 'text-[#01458e]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t(tab.label)}
              {resolvedSecondaryId === tab.id ? (
                <span
                  aria-hidden
                  className="absolute inset-x-2 bottom-0 h-[3px] rounded-t bg-[#f5c518]"
                />
              ) : null}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}
