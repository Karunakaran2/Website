import { DEFAULT_PRIMARY_NAV_ID, getDefaultSecondaryTabId } from '@/app/shell/constants/dashboard'
import { getModuleRoute } from '@/shared/constants'

export function getInboxOverviewPath() {
  return getModuleRoute(
    DEFAULT_PRIMARY_NAV_ID,
    getDefaultSecondaryTabId(DEFAULT_PRIMARY_NAV_ID),
  )
}
