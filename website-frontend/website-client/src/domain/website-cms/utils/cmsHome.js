import { getModuleRoute } from '@/shared/constants'
import { WEBSITE_DASHBOARD_PRIMARY_ID } from '../constants/websiteDashboardNav'

/** CMS workspace entry — module shell with gold/white nav (not /home card landing). */
export function getWebsiteCmsHomePath() {
  return getModuleRoute(WEBSITE_DASHBOARD_PRIMARY_ID, 'overview')
}